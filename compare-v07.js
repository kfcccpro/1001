const COMPARE_VERSION = '0.7.0';

const BEFORE_ITEM = {
  id:'PFAL-U01-BEFORE-S',
  display:'START CHECK',
  interaction:'span',
  sentence:'What makes a long sentence difficult is often not vocabulary but its hidden structure.',
  prompt:'문장 전체의 주어 범위를 드래그하세요.',
  answer:'What makes a long sentence difficult',
  explanation:'what이 이끄는 명사절 전체가 문장의 주어입니다.'
};

const AFTER_ITEM = {
  id:'PFAL-U01-AFTER-S',
  display:'FINAL CHECK',
  interaction:'span',
  sentence:'What matters most when a sentence becomes long is finding its main structure first.',
  prompt:'처음과 같은 원리입니다. 문장 전체의 주어 범위를 드래그하세요.',
  answer:'What matters most when a sentence becomes long',
  explanation:'what이 이끄는 명사절 전체가 하나의 주어 역할을 합니다.'
};

function ensureCompareItems(){
  state.itemMap.set(BEFORE_ITEM.id, BEFORE_ITEM);
  state.itemMap.set(AFTER_ITEM.id, AFTER_ITEM);
}

startLearningSession = function({force=false, demo=false}={}){
  ensureCompareItems();
  state.runMode='learn';
  state.demo=demo;
  state.flowIndex=0;
  state.results=[];
  state.sessionStartedAt=Date.now();
  const entries=[];
  if(!force) dueReviews().forEach(r=>entries.push({id:r.itemId,context:'review',reviewId:r.id,reviewStage:r.stage}));
  entries.push({id:BEFORE_ITEM.id,context:'compare',comparePhase:'before'});
  if(force || !isUnitDoneToday() || demo) unitLearningIds().forEach(id=>entries.push({id,context:'new'}));
  if(!entries.some(x=>x.context==='new')) unitLearningIds().slice(0,6).forEach(id=>entries.push({id,context:'new'}));
  entries.push({id:AFTER_ITEM.id,context:'compare',comparePhase:'after'});
  state.flow=entries;
  resetItemState();
  renderFlow();
};

const baseTopbarV06 = topbar;
topbar = function(q){
  const entry=currentEntry();
  if(entry?.comparePhase==='before') return `<div class="topbar"><div>오늘 시작 체크</div><div>${currentPosition()} / ${state.flow.length}</div></div>`;
  if(entry?.comparePhase==='after') return `<div class="topbar"><div>오늘 마지막 체크</div><div>${currentPosition()} / ${state.flow.length}</div></div>`;
  return baseTopbarV06(q);
};

const baseRenderSpanV06 = renderSpan;
renderSpan = function(q){
  baseRenderSpanV06(q);
  const entry=currentEntry();
  if(!entry?.comparePhase) return;
  const wrap=document.querySelector('.question-wrap');
  if(!wrap) return;
  const badge=document.createElement('div');
  badge.className=`phase-badge ${entry.comparePhase==='after'?'after':''}`;
  badge.textContent=entry.comparePhase==='before'?'시작 상태 확인 · 정답을 몰라도 괜찮습니다':'마지막 확인 · 처음과 같은 원리';
  wrap.insertBefore(badge, wrap.firstElementChild);
};

const baseRecordResultV06 = recordResult;
recordResult = function(q,correct,submittedAnswer,correctAnswer){
  baseRecordResultV06(q,correct,submittedAnswer,correctAnswer);
  const entry=currentEntry();
  const last=state.results.at(-1);
  if(last && entry?.comparePhase) last.comparePhase=entry.comparePhase;
};

function compareSummary(results){
  const before=results.find(r=>r.comparePhase==='before');
  const after=results.find(r=>r.comparePhase==='after');
  if(!before || !after) return '';
  let message='같은 원리를 시작과 마지막에 비교했습니다.';
  let cls='';
  if(!before.correct && after.correct){message='처음에는 놓쳤지만, 마지막에는 도움 없이 정확히 찾았습니다.';cls='gained';}
  else if(before.correct && after.correct){message='시작부터 알던 구조를 마지막까지 안정적으로 유지했습니다.';cls='gained';}
  else if(before.correct && !after.correct){message='시작에서는 맞혔지만 마지막 문장에서 흔들렸습니다. 내일 다시 꺼냅니다.';cls='review';}
  else {message='아직 같은 구조가 안정되지 않았습니다. 내일 복습에서 다시 확인합니다.';cls='review';}
  return `<div class="compare-card"><span>BEFORE → AFTER</span><div class="compare-flow"><div class="compare-point"><span>시작</span><strong>${before.correct?'정답':'오답'}</strong></div><div class="compare-arrow">→</div><div class="compare-point"><span>마지막</span><strong>${after.correct?'정답':'오답'}</strong></div></div><p class="compare-message ${cls}">${escapeHtml(message)}</p></div>`;
}

const baseRenderReportV06 = renderReport;
renderReport = function(){
  const compareHtml = state.runMode==='learn' ? compareSummary(state.results) : '';
  baseRenderReportV06();
  const label=document.querySelector('.date-label');
  if(label && state.runMode==='learn') label.textContent=`오늘 학습 완료 · v${COMPARE_VERSION}`;
  if(!compareHtml) return;
  const target=document.querySelector('.growth-win');
  if(target) target.insertAdjacentHTML('afterend',compareHtml);
};
