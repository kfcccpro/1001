const PACING_VERSION = '0.8.0';
const MAX_DUE_PER_SESSION = 6;
const MAX_NEW_PER_SESSION = 14;

state.earlyStop = false;

function completedNewIdsForUnit(){
  const ids = new Set();
  learningHistory().forEach(session => {
    if (session.unit !== state.unit.meta.unit) return;
    (session.results || []).forEach(r => {
      if (r.context === 'new') ids.add(r.id);
    });
  });
  return ids;
}

function unitProgress(){
  const all = unitLearningIds();
  const completed = completedNewIdsForUnit();
  const done = all.filter(id => completed.has(id)).length;
  return {done,total:all.length,remaining:all.filter(id => !completed.has(id))};
}

function isUnitComplete(){
  const p = unitProgress();
  return p.total > 0 && p.done >= p.total;
}

function blockCountFor(coreCount){
  if (coreCount <= 0) return 0;
  if (coreCount <= 6) return 1;
  if (coreCount <= 12) return 2;
  return 3;
}

function buildPacedCore(entries){
  const blocks = blockCountFor(entries.length);
  if (blocks <= 1) return entries;
  const size = Math.ceil(entries.length / blocks);
  const out = [];
  for (let b = 0; b < blocks; b++) {
    const chunk = entries.slice(b * size, (b + 1) * size);
    out.push(...chunk);
    if (b < blocks - 1) out.push({type:'checkpoint',blockNo:b+1,blockCount:blocks});
  }
  return out;
}

function taskEntries(){
  return state.flow.filter(e => e && e.id);
}

function taskPosition(){
  return state.flow.slice(0, state.flowIndex + 1).filter(e => e && e.id).length;
}

function plannedSession(){
  const progress = unitProgress();
  const due = dueReviews();
  const dueNow = Math.min(MAX_DUE_PER_SESSION, due.length);
  const newNow = Math.min(MAX_NEW_PER_SESSION, progress.remaining.length);
  const core = dueNow + newNow;
  return {
    progress,
    dueTotal: due.length,
    dueNow,
    newNow,
    blocks: blockCountFor(core),
    tasks: core + 2
  };
}

renderStudentHome = function(){
  const plan = plannedSession();
  const streak = streakCount();
  const complete = isUnitComplete();
  const primaryLabel = complete && plan.dueTotal === 0 ? '오늘 학습 다시 보기' : '오늘 학습 시작';
  const progressPct = plan.progress.total ? Math.round((plan.progress.done / plan.progress.total) * 100) : 0;
  const blockLabel = plan.blocks ? `${plan.blocks}블록` : '복습 중심';
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘도 한 번 더.</div></div><div class="daily-badge">매일학습</div></div>
    <p class="lead">길게 버티기보다 <b>집중 블록을 끝내고 기억을 남기는 것</b>을 우선합니다.</p>
    <div class="today-plan"><div><span>오늘 복습</span><strong>${plan.dueTotal}</strong></div><div><span>Unit 01</span><strong>${complete ? '완료' : `${plan.progress.done}/${plan.progress.total}`}</strong></div><div><span>연속 학습</span><strong>${streak}일</strong></div></div>
    <div class="pacing-summary"><span>오늘 목표</span><strong>${blockLabel} · ${plan.tasks}개 안팎</strong><p>시간을 재지 않습니다. 블록이 끝날 때만 계속할지 확인합니다. 오늘 복습이 많으면 최대 ${MAX_DUE_PER_SESSION}개를 먼저 처리합니다.</p><div class="stage-strip"><span class="stage-chip active">시작 체크</span><span class="stage-chip">복습</span><span class="stage-chip">핵심 학습</span><span class="stage-chip">마지막 체크</span></div></div>
    <div class="home-progress"><div class="home-progress-head"><span>Unit 01 진행</span><span>${progressPct}%</span></div><div class="home-progress-track"><div class="home-progress-fill" style="--value:${progressPct}%"></div></div></div>
    ${latestLearningSnapshot()}
    ${renderWeekStrip()}
    <div class="action-row"><button class="primary" id="start">${primaryLabel}</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick = () => startLearningSession({force: complete && plan.dueTotal === 0});
  document.getElementById('logout').onclick = renderLogin;
};

startLearningSession = function({force=false, demo=false}={}){
  ensureCompareItems();
  state.runMode='learn';
  state.demo=demo;
  state.earlyStop=false;
  state.flowIndex=0;
  state.results=[];
  state.sessionStartedAt=Date.now();

  const core=[];
  if (!force) {
    dueReviews().slice(0, MAX_DUE_PER_SESSION).forEach(r => core.push({id:r.itemId,context:'review',reviewId:r.id,reviewStage:r.stage}));
  }

  if (demo) {
    unitLearningIds().forEach(id => core.push({id,context:'new'}));
  } else if (force && isUnitComplete()) {
    unitLearningIds().slice(0,8).forEach(id => core.push({id,context:'practice'}));
  } else {
    unitProgress().remaining.slice(0, MAX_NEW_PER_SESSION).forEach(id => core.push({id,context:'new'}));
  }

  if (!core.length) unitLearningIds().slice(0,6).forEach(id => core.push({id,context:'practice'}));

  state.flow=[
    {id:BEFORE_ITEM.id,context:'compare',comparePhase:'before'},
    ...buildPacedCore(core),
    {id:AFTER_ITEM.id,context:'compare',comparePhase:'after'}
  ];
  resetItemState();
  renderFlow();
};

const baseTopbarV07 = topbar;
topbar = function(q){
  if (state.runMode === 'validation') return baseTopbarV07(q);
  const entry = currentEntry();
  const total = taskEntries().length;
  const pos = taskPosition();
  let label = q.display || q.id;
  if (entry?.comparePhase === 'before') label = '시작 체크';
  else if (entry?.comparePhase === 'after') label = '마지막 체크';
  else if (entry?.context === 'review') label = `${entry.reviewStage || '복습'} · ${q.display || q.id}`;
  else if (entry?.context === 'practice') label = `가볍게 다시 보기 · ${q.display || q.id}`;
  else label = `핵심 학습 · ${q.display || q.id}`;
  return `<div class="topbar"><div>${escapeHtml(label)}</div><div>${pos} / ${total}</div></div>`;
};

const baseRenderFlowV07 = renderFlow;
renderFlow = function(){
  const entry = currentEntry();
  if (entry?.type === 'checkpoint') return renderCheckpoint(entry);
  return baseRenderFlowV07();
};

function renderCheckpoint(entry){
  const canStop = entry.blockCount >= 3 && entry.blockNo >= 2;
  const doneSteps = Array.from({length:3}, (_,i) => `<div class="checkpoint-step ${i < entry.blockNo ? 'done' : ''}"></div>`).join('');
  app.innerHTML = `<section class="screen"><div class="center"><div class="checkpoint-card">
    <div class="checkpoint-kicker">BLOCK ${entry.blockNo} COMPLETE</div>
    <h1>${entry.blockNo}블록을<br>끝냈습니다.</h1>
    <p>${entry.blockNo === 1 ? '화면에서 잠깐 눈을 떼고 자세를 정리합니다. 준비되면 다음 블록으로 갑니다.' : '여기까지도 핵심 학습량은 충분합니다. 집중이 남아 있으면 한 블록 더, 아니면 마지막 체크 후 마칩니다.'}</p>
    <div class="checkpoint-meter">${doneSteps}</div>
    <div class="checkpoint-actions"><button class="primary" id="continue">${entry.blockNo === 1 ? '다음 블록' : '한 블록 더'}</button>${canStop ? '<button class="soft-stop" id="finish">마지막 체크 후 마치기</button>' : ''}</div>
    <div class="resume-note">카운트다운은 없습니다. 블록 단위로만 진행합니다.</div>
  </div></div></section>`;
  document.getElementById('continue').onclick = nextFlow;
  if (canStop) document.getElementById('finish').onclick = finishWithFinalCheck;
}

function finishWithFinalCheck(){
  state.earlyStop = true;
  state.flow = state.flow.slice(0, state.flowIndex + 1).concat([{id:AFTER_ITEM.id,context:'compare',comparePhase:'after'}]);
  nextFlow();
}

const baseRenderReportV07 = renderReport;
renderReport = function(){
  const stopped = state.runMode === 'learn' && state.earlyStop;
  baseRenderReportV07();
  if (!stopped) return;
  const anchor = document.querySelector('.compare-card') || document.querySelector('.growth-win');
  if (anchor) anchor.insertAdjacentHTML('afterend','<div class="pacing-summary"><span>오늘의 종료 기준</span><strong>2블록 + 마지막 체크 완료</strong><p>남은 새 문항은 다음 학습에서 이어집니다. 중단이 아니라 계획된 종료로 기록합니다.</p></div>');
};
