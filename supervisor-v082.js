const SUPERVISOR_VERSION = '0.8.2';

state.supervisorMode = false;
state.supervisorIndex = 0;
state.supervisorShowAnswer = false;

function supervisorIds(){
  return validationIds();
}

function startSupervisorReview(index = 0){
  state.mode = 'admin';
  state.supervisorMode = true;
  state.supervisorIndex = Math.max(0, Math.min(index, supervisorIds().length - 1));
  state.supervisorShowAnswer = false;
  renderSupervisorItem();
}

function supervisorAnswerText(q){
  if (Array.isArray(q.answers)) return q.answers.join(' / ');
  return q.answer || '-';
}

function supervisorInteractionPreview(q){
  if (q.interaction === 'choice') {
    return `<div class="choices supervisor-choices">${(q.choices || []).map(c => `<button class="choice" type="button">${escapeHtml(c)}</button>`).join('')}</div>`;
  }
  if (q.interaction === 'text') {
    return `<div class="text-answer-row supervisor-input"><input class="text-answer" placeholder="학생 답 입력 영역" disabled><button class="primary submit-answer" disabled>답안 제출</button></div>`;
  }
  if (q.interaction === 'pairSpan') {
    return `<div class="supervisor-guide">학생 화면에서는 두 범위를 차례로 드래그하여 선택합니다.</div><div class="pair-slots"><div class="pair-slot"><b>1</b><span>첫 번째 선택 범위</span></div><div class="pair-slot"><b>2</b><span>두 번째 선택 범위</span></div></div>`;
  }
  return `<div class="supervisor-guide">학생 화면에서는 문장에서 답 범위를 드래그하여 선택합니다.</div>`;
}

function renderSupervisorItem(){
  const ids = supervisorIds();
  if (!ids.length) return renderAdmin();
  const id = ids[state.supervisorIndex];
  const q = state.itemMap.get(id);
  if (!q) {
    state.supervisorIndex += 1;
    if (state.supervisorIndex >= ids.length) state.supervisorIndex = 0;
    return renderSupervisorItem();
  }

  const pos = state.supervisorIndex + 1;
  const total = ids.length;
  const answer = supervisorAnswerText(q);
  const details = state.supervisorShowAnswer
    ? `<div class="supervisor-answer">
        <div class="supervisor-answer-label">정답</div>
        <div class="supervisor-answer-main">${escapeHtml(answer)}</div>
        ${q.explanation ? `<div class="supervisor-explanation"><b>해설</b>${escapeHtml(q.explanation)}</div>` : ''}
        ${q.structure ? `<div class="supervisor-structure"><b>구조</b>${escapeHtml(q.structure)}</div>` : ''}
        ${q.memory ? `<div class="supervisor-memory"><b>기억할 한 가지</b>${escapeHtml(q.memory)}</div>` : ''}
      </div>`
    : '';

  app.innerHTML = `<section class="screen supervisor-screen">
    <div class="topbar supervisor-topbar"><div>감독형 전체보기 · ${escapeHtml(q.display || q.id)}</div><div>${pos} / ${total}</div></div>
    <div class="learning-area supervisor-learning"><div class="question-wrap">
      <div class="supervisor-badge">감독형 · 기록 저장 안 함 · 정답 없이도 이동 가능</div>
      <div class="sentence supervisor-sentence">${escapeHtml(q.sentence)}</div>
      <div class="prompt supervisor-prompt">${escapeHtml(q.prompt)}</div>
      ${supervisorInteractionPreview(q)}
      ${details}
      <div class="supervisor-actions">
        <button class="secondary" id="supervisorPrev" ${pos === 1 ? 'disabled' : ''}>← 이전</button>
        <button class="secondary" id="supervisorAnswer">${state.supervisorShowAnswer ? '정답·해설 닫기' : '정답·해설 보기'}</button>
        <button class="primary" id="supervisorNext">${pos === total ? '처음으로 ↺' : '다음 →'}</button>
      </div>
      <div class="supervisor-jump"><span>바로 이동</span><select id="supervisorJump">${ids.map((itemId,i) => { const item = state.itemMap.get(itemId); return `<option value="${i}" ${i===state.supervisorIndex?'selected':''}>${i+1}. ${escapeHtml(item?.display || itemId)}</option>`; }).join('')}</select><button class="secondary" id="supervisorAdmin">관리자 홈</button></div>
    </div></div>
  </section>`;

  document.getElementById('supervisorPrev').onclick = () => { state.supervisorIndex -= 1; state.supervisorShowAnswer = false; renderSupervisorItem(); };
  document.getElementById('supervisorNext').onclick = () => { state.supervisorIndex = pos === total ? 0 : state.supervisorIndex + 1; state.supervisorShowAnswer = false; renderSupervisorItem(); };
  document.getElementById('supervisorAnswer').onclick = () => { state.supervisorShowAnswer = !state.supervisorShowAnswer; renderSupervisorItem(); };
  document.getElementById('supervisorJump').onchange = e => { state.supervisorIndex = Number(e.target.value); state.supervisorShowAnswer = false; renderSupervisorItem(); };
  document.getElementById('supervisorAdmin').onclick = () => { state.supervisorMode = false; renderAdmin(); };
}

const renderAdminBeforeSupervisor = renderAdmin;
renderAdmin = function(){
  state.supervisorMode = false;
  const vh = getJSON(STORAGE.validation, []);
  const lh = learningHistory();
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="brand">ADMIN · 2007</div>
    <h1>감독형 검수</h1>
    <p class="lead"><b>문제를 풀지 않아도 됩니다.</b> 진도·학습기록을 저장하지 않고 이전/다음으로 전체 문항을 빠르게 확인합니다.</p>
    <div class="supervisor-admin-note"><strong>현재 기본 검수 방식</strong><span>문제 보기 → 필요하면 정답·해설 보기 → 바로 다음 문제</span></div>
    <div class="admin-actions">
      <button class="primary" id="supervisorStart">감독형 전체보기 시작</button>
      <button class="secondary" id="student">학생 실제 화면</button>
      <button class="secondary" id="legacyAdmin">기존 관리자 화면</button>
      <button class="secondary" id="logout">PIN 화면</button>
    </div>
    <div class="supervisor-mini-stats"><span>전체 검수 문항 <b>${supervisorIds().length}</b></span><span>기존 학습 세션 <b>${lh.length}</b></span><span>기존 검증 세션 <b>${vh.length}</b></span></div>
  </div></div></section>`;
  document.getElementById('supervisorStart').onclick = () => startSupervisorReview(0);
  document.getElementById('student').onclick = () => { state.mode='student'; state.demo=false; renderStudentHome(); };
  document.getElementById('legacyAdmin').onclick = renderAdminBeforeSupervisor;
  document.getElementById('logout').onclick = renderLogin;
};
