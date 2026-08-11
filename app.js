const app = document.getElementById('app');
const toast = document.getElementById('toast');

const APP_VERSION = '0.5.0';
const STORAGE = {
  validation: 'chunilmun_validation_history',
  learning: 'chunilmun_learning_history',
  reviews: 'chunilmun_review_queue',
  completed: 'chunilmun_completed_days'
};

const state = {
  mode: null,
  runMode: 'learn',
  demo: false,
  flowIndex: 0,
  unit: null,
  itemMap: new Map(),
  flow: [],
  results: [],
  selectedRange: null,
  selectedChoice: null,
  pairRanges: [],
  submitted: false,
  sessionStartedAt: null
};

const normalize = s => String(s || '')
  .replace(/[‘’“”]/g, "'")
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

function localDate(offsetDays = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayKR() {
  return new Intl.DateTimeFormat('ko-KR', {month:'long', day:'numeric', weekday:'short'}).format(new Date());
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 850);
}

function getJSON(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function loadUnit() {
  const res = await fetch(`./data/unit01.json?v=${APP_VERSION}`, {cache:'no-store'});
  if (!res.ok) throw new Error('unit01.json load failed');
  state.unit = await res.json();
  state.itemMap = new Map(state.unit.items.map(item => [item.id, item]));
}

function unitLearningIds() {
  const raw = state.unit.learningFlow || state.unit.validationFlow || [];
  return raw.filter(id => id !== 'REPORT');
}

function validationIds() {
  return (state.unit.validationFlow || []).filter(id => id !== 'REPORT');
}

function renderLogin() {
  app.innerHTML = `<section class="screen"><div class="center"><div class="login-card">
    <div class="brand">CHUNILMUN · PFAL</div>
    <h1>천일문 매일학습</h1>
    <p class="lead">학생 8081 · 관리자 2007</p>
    <div class="pin-row"><input id="pin" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN"><button class="primary" id="loginBtn">시작</button></div>
  </div></div></section>`;
  const pin = document.getElementById('pin');
  document.getElementById('loginBtn').onclick = () => login(pin.value);
  pin.addEventListener('keydown', e => { if (e.key === 'Enter') login(pin.value); });
  pin.focus();
}

function login(pin) {
  if (pin === '8081') {
    state.mode = 'student';
    state.demo = false;
    renderStudentHome();
  } else if (pin === '2007') {
    state.mode = 'admin';
    state.demo = false;
    renderAdmin();
  } else showToast('PIN을 확인하세요.');
}

function completedDays() { return getJSON(STORAGE.completed, []); }
function learningHistory() { return getJSON(STORAGE.learning, []); }
function reviewQueue() { return getJSON(STORAGE.reviews, []); }

function isUnitDoneToday() {
  return completedDays().some(x => x.date === localDate() && x.unit === state.unit.meta.unit);
}

function dueReviews() {
  const today = localDate();
  return reviewQueue().filter(r => !r.done && r.due <= today && state.itemMap.has(r.itemId));
}

function streakCount() {
  const unique = [...new Set(completedDays().map(x => x.date))].sort().reverse();
  if (!unique.length) return 0;
  let streak = 0;
  for (let i = 0; i < 120; i++) {
    if (unique.includes(localDate(-i))) streak += 1;
    else break;
  }
  return streak;
}

function renderWeekStrip() {
  const done = new Set(completedDays().map(x => x.date));
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = localDate(-i);
    labels.push(`<div class="day-cell ${done.has(key) ? 'done' : ''}"><span>${['일','월','화','수','목','금','토'][d.getDay()]}</span><b>${d.getDate()}</b></div>`);
  }
  return `<div class="week-strip">${labels.join('')}</div>`;
}

function renderStudentHome() {
  const due = dueReviews().length;
  const doneToday = isUnitDoneToday();
  const streak = streakCount();
  const unitCount = unitLearningIds().length;
  const primaryLabel = doneToday && due === 0 ? '오늘 학습 다시 보기' : '오늘 학습 시작';
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘도 한 번 더.</div></div><div class="daily-badge">매일학습</div></div>
    <p class="lead">긴 시간보다 <b>매일 다시 꺼내는 것</b>을 우선합니다. 오늘 할 것만 보입니다.</p>
    <div class="today-plan"><div><span>오늘 복습</span><strong>${due}</strong></div><div><span>Unit 01</span><strong>${doneToday ? '완료' : unitCount}</strong></div><div><span>연속 학습</span><strong>${streak}일</strong></div></div>
    ${renderWeekStrip()}
    <div class="action-row"><button class="primary" id="start">${primaryLabel}</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick = () => startLearningSession({force: doneToday && due === 0});
  document.getElementById('logout').onclick = renderLogin;
}

function startLearningSession({force = false, demo = false} = {}) {
  state.runMode = 'learn';
  state.demo = demo;
  state.flowIndex = 0;
  state.results = [];
  state.sessionStartedAt = Date.now();
  const entries = [];
  if (!force) dueReviews().forEach(r => entries.push({id:r.itemId, context:'review', reviewId:r.id, reviewStage:r.stage}));
  if (force || !isUnitDoneToday() || demo) unitLearningIds().forEach(id => entries.push({id, context:'new'}));
  if (!entries.length) unitLearningIds().forEach(id => entries.push({id, context:'new'}));
  state.flow = entries;
  resetItemState();
  renderFlow();
}

function startValidationSession() {
  state.runMode = 'validation';
  state.demo = true;
  state.flowIndex = 0;
  state.results = [];
  state.sessionStartedAt = Date.now();
  state.flow = validationIds().map(id => ({id, context:'validation'}));
  resetItemState();
  renderFlow();
}

function resetItemState() {
  state.selectedRange = null;
  state.selectedChoice = null;
  state.pairRanges = [];
  state.submitted = false;
}

function currentEntry() { return state.flow[state.flowIndex]; }
function currentPosition() { return state.flowIndex + 1; }

function topbar(q) {
  const entry = currentEntry();
  const left = entry?.context === 'review' ? `${entry.reviewStage} 복습 · ${q.display || q.id}` : (q.display || q.id);
  return `<div class="topbar"><div>${escapeHtml(left)}</div><div>${currentPosition()} / ${state.flow.length}</div></div>`;
}

function renderFlow() {
  const entry = currentEntry();
  if (!entry) return renderReport();
  const q = state.itemMap.get(entry.id);
  if (!q) return nextFlow();
  resetItemState();
  if (q.interaction === 'choice') return renderChoice(q);
  if (q.interaction === 'span') return renderSpan(q);
  if (q.interaction === 'pairSpan') return renderPairSpan(q);
  if (q.interaction === 'text') return renderText(q);
  nextFlow();
}

function nextFlow() { state.flowIndex += 1; renderFlow(); }
function nextLabel() { return currentPosition() === state.flow.length ? '오늘 결과 보기' : '다음 문제'; }
function guide(text) { return `<div class="guide-strip">${text}</div>`; }

function renderChoice(q) {
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div class="sentence">${escapeHtml(q.sentence)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('선택 → <b>답안 제출</b> → 정답·해설 확인 → 다음 문제')}
    <div class="choices">${q.choices.map(c => `<button class="choice" data-choice="${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('')}</div>
    <div class="submit-row"><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div><div id="result"></div>
  </div></div></section>`;
  const buttons = [...document.querySelectorAll('.choice')];
  const submit = document.getElementById('submit');
  buttons.forEach(btn => btn.onclick = () => {
    if (state.submitted) return;
    state.selectedChoice = btn.dataset.choice;
    buttons.forEach(b => b.classList.toggle('choice-selected', b === btn));
    submit.disabled = false;
  });
  submit.onclick = () => {
    if (!state.selectedChoice || state.submitted) return;
    state.submitted = true;
    const correct = normalize(state.selectedChoice) === normalize(q.answer);
    buttons.forEach(btn => {
      btn.disabled = true;
      if (normalize(btn.dataset.choice) === normalize(q.answer)) btn.classList.add('answer-choice');
      if (btn.dataset.choice === state.selectedChoice && !correct) btn.classList.add('wrong-choice');
    });
    submit.remove(); recordResult(q, correct, state.selectedChoice, q.answer); renderResultPanel(q, correct, q.answer);
  };
}

function renderText(q) {
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div class="sentence">${escapeHtml(q.sentence)}</div><div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('답 입력 → <b>답안 제출</b> → 정답·해설 확인 → 다음 문제')}
    <div class="text-answer-row"><input id="textAnswer" class="text-answer" autocomplete="off" spellcheck="false" placeholder="답 입력"><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div><div id="result"></div>
  </div></div></section>`;
  const input = document.getElementById('textAnswer'); const submit = document.getElementById('submit');
  input.addEventListener('input', () => submit.disabled = !input.value.trim());
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !submit.disabled) submit.click(); });
  submit.onclick = () => {
    if (state.submitted || !input.value.trim()) return;
    state.submitted = true; input.disabled = true;
    const selected = input.value.trim(); const correct = normalize(selected) === normalize(q.answer);
    recordResult(q, correct, selected, q.answer); submit.remove(); renderResultPanel(q, correct, q.answer);
  }; input.focus();
}

function tokenise(sentence) { return sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)?|\d+(?:,\d+)*|[^\sA-Za-z\d]/g) || []; }
function tokensToText(tokens, start, end) {
  if (start == null || end == null) return '';
  return tokens.slice(Math.min(start,end), Math.max(start,end)+1).join(' ').replace(/\s+([,.;:!?])/g,'$1').replace(/([‘“])\s+/g,'$1').replace(/\s+([’”])/g,'$1');
}
function findTextRange(tokens, target) {
  const wanted = normalize(target);
  for (let s = 0; s < tokens.length; s++) for (let e = s; e < tokens.length; e++) if (normalize(tokensToText(tokens,s,e)) === wanted) return [s,e];
  return null;
}

function bindRangeSelector(el, spans, onChange) {
  let dragging = false, start = null, end = null, pointerId = null;
  const paint = () => { spans.forEach((span,i) => span.classList.toggle('selected', start != null && i >= Math.min(start,end) && i <= Math.max(start,end))); onChange(start,end); };
  const pointIndex = (x,y) => { const token = document.elementFromPoint(x,y)?.closest?.('.token'); return token && el.contains(token) ? Number(token.dataset.i) : null; };
  el.addEventListener('pointerdown', e => { if (state.submitted) return; const token = e.target.closest?.('.token'); if (!token) return; e.preventDefault(); dragging = true; pointerId = e.pointerId; start = end = Number(token.dataset.i); paint(); });
  document.addEventListener('pointermove', e => { if (!dragging || e.pointerId !== pointerId) return; const idx = pointIndex(e.clientX,e.clientY); if (idx == null) return; e.preventDefault(); end = idx; paint(); }, {passive:false});
  const finish = e => { if (dragging && e.pointerId === pointerId) { dragging = false; pointerId = null; } };
  document.addEventListener('pointerup', finish, {passive:true}); document.addEventListener('pointercancel', finish, {passive:true});
  return {reset(){start=end=null;spans.forEach(s=>s.classList.remove('selected'));onChange(null,null);}};
}

function renderSpan(q) {
  const tokens = tokenise(q.sentence);
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div id="tokenSentence" class="token-sentence">${renderTokens(tokens)}</div><div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('드래그로 범위 선택 → 선택 내용 확인 → <b>답안 제출</b>')}
    <div class="selection-preview" id="preview">선택한 답: <span>없음</span></div>
    <div class="submit-row"><button class="secondary" id="reset">다시 선택</button><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div><div id="result"></div>
  </div></div></section>`;
  const el = document.getElementById('tokenSentence'); const spans = [...el.querySelectorAll('.token')]; const preview = document.getElementById('preview'); const submit = document.getElementById('submit');
  const selector = bindRangeSelector(el, spans, (s,e) => { state.selectedRange = s == null ? null : [s,e]; const text = state.selectedRange ? tokensToText(tokens,s,e) : '없음'; preview.innerHTML = `선택한 답: <span>${escapeHtml(text)}</span>`; submit.disabled = !state.selectedRange; });
  document.getElementById('reset').onclick = () => { if (!state.submitted) selector.reset(); };
  submit.onclick = () => {
    if (!state.selectedRange || state.submitted) return; state.submitted = true;
    const [s,e] = state.selectedRange; const selected = tokensToText(tokens,s,e); const correct = normalize(selected) === normalize(q.answer);
    spans.forEach((span,i) => { span.classList.remove('selected'); if (i >= Math.min(s,e) && i <= Math.max(s,e)) span.classList.add(correct ? 'correct-span' : 'wrong-span'); });
    const answerRange = findTextRange(tokens,q.answer); if (answerRange) spans.forEach((span,i) => { if (i >= answerRange[0] && i <= answerRange[1]) span.classList.add('answer-span'); });
    document.getElementById('reset').disabled = true; submit.remove(); recordResult(q,correct,selected,q.answer); renderResultPanel(q,correct,q.answer);
  };
}

function renderPairSpan(q) {
  const tokens = tokenise(q.sentence);
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div id="tokenSentence" class="token-sentence">${renderTokens(tokens)}</div><div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('① 첫 범위 드래그 → <b>선택 저장</b>　② 둘째 범위 드래그 → <b>선택 저장</b>　③ 답안 제출')}
    <div class="pair-slots" id="slots"></div><div class="submit-row"><button class="secondary" id="reset">전체 지우기</button><button class="secondary" id="add" disabled>선택 저장</button><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div><div id="result"></div>
  </div></div></section>`;
  const el = document.getElementById('tokenSentence'); const spans = [...el.querySelectorAll('.token')]; const add = document.getElementById('add'); const submit = document.getElementById('submit'); let pending = null;
  const selector = bindRangeSelector(el, spans, (s,e) => { pending = s == null ? null : [s,e]; add.disabled = !pending || state.pairRanges.length >= 2; });
  const refresh = () => { document.getElementById('slots').innerHTML = [0,1].map(i => `<div class="pair-slot"><b>${i+1}</b><span>${state.pairRanges[i] ? escapeHtml(tokensToText(tokens,...state.pairRanges[i])) : '미선택'}</span></div>`).join(''); submit.disabled = state.pairRanges.length !== 2; };
  add.onclick = () => { if (!pending || state.submitted || state.pairRanges.length >= 2) return; state.pairRanges.push([...pending]); selector.reset(); pending = null; refresh(); };
  document.getElementById('reset').onclick = () => { if (!state.submitted) { state.pairRanges=[]; selector.reset(); refresh(); } };
  submit.onclick = () => {
    if (state.pairRanges.length !== 2 || state.submitted) return; state.submitted = true;
    const selected = state.pairRanges.map(r => tokensToText(tokens,...r)); const correct = selected.every((text,i) => normalize(text) === normalize(q.answers[i]));
    state.pairRanges.forEach(r => spans.forEach((span,i) => { if (i >= Math.min(...r) && i <= Math.max(...r)) span.classList.add(correct ? 'correct-span' : 'wrong-span'); }));
    q.answers.forEach(ans => { const r = findTextRange(tokens,ans); if (r) spans.forEach((span,i) => { if (i >= r[0] && i <= r[1]) span.classList.add('answer-span'); }); });
    add.disabled = true; document.getElementById('reset').disabled = true; submit.remove(); recordResult(q,correct,selected.join(' / '),q.answers.join(' / ')); renderResultPanel(q,correct,q.answers.join(' / '));
  }; refresh();
}

function renderResultPanel(q, correct, correctAnswer) {
  const result = document.getElementById('result');
  const structure = q.structure ? `<div class="structure-view"><span>구조 보기</span>${escapeHtml(q.structure)}</div>` : '';
  const memory = q.memory ? `<div class="memory-point ${state.runMode === 'learn' ? 'attention' : ''}"><span>기억할 한 가지</span><strong>${escapeHtml(q.memory)}</strong></div>` : '';
  result.innerHTML = `<div class="result-panel ${correct ? 'is-correct' : 'is-wrong'}"><div class="result-title">${correct ? '정답입니다.' : '오답입니다.'}</div>${correct ? '' : `<div class="answer-line"><span>정답</span><b>${escapeHtml(correctAnswer)}</b></div>`}<div class="explanation"><span>왜?</span>${escapeHtml(q.explanation || '')}</div>${structure}${memory}<button class="primary next-question" id="next">${nextLabel()}</button></div>`;
  const next = document.getElementById('next');
  if (state.runMode === 'learn' && q.memory) { next.disabled = true; const finalLabel = next.textContent; next.textContent = '기억 중…'; setTimeout(() => { next.disabled = false; next.textContent = finalLabel; }, 1100); }
  next.onclick = nextFlow; result.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function recordResult(q,correct,submittedAnswer,correctAnswer) {
  const entry = currentEntry();
  state.results.push({id:q.id,display:q.display,context:entry?.context || state.runMode,reviewId:entry?.reviewId || null,reviewStage:entry?.reviewStage || null,correct,memory:Boolean(q.memory),submittedAnswer,correctAnswer,at:new Date().toISOString()});
}

function addReview(queue, itemId, days, stage) {
  const due = localDate(days); const key = `${itemId}|${due}|${stage}`;
  if (queue.some(r => r.key === key && !r.done)) return;
  queue.push({id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,key,itemId,due,stage,done:false});
}

function persistLearningSession() {
  if (state.demo) return;
  const queue = reviewQueue();
  state.results.forEach(r => {
    if (r.reviewId) { const hit = queue.find(x => x.id === r.reviewId); if (hit) hit.done = true; if (!r.correct) addReview(queue, r.id, 1, 'D+1 재확인'); return; }
    if (r.context === 'new') { addReview(queue, r.id, 1, 'D+1'); if (!r.correct) addReview(queue, r.id, 3, 'D+3'); if (!r.correct || r.memory) addReview(queue, r.id, 7, 'D+7'); }
  });
  setJSON(STORAGE.reviews, queue.slice(-500));
  const hasNew = state.results.some(r => r.context === 'new');
  if (hasNew && !isUnitDoneToday()) { const days = completedDays(); days.push({date:localDate(),unit:state.unit.meta.unit}); setJSON(STORAGE.completed, days.slice(-365)); }
  const history = learningHistory(); history.push({version:APP_VERSION,date:new Date().toISOString(),unit:state.unit.meta.unit,durationSec:Math.round((Date.now()-state.sessionStartedAt)/1000),results:state.results}); setJSON(STORAGE.learning, history.slice(-120));
}

function persistValidationSession() {
  const history = getJSON(STORAGE.validation, []); history.push({version:APP_VERSION,date:new Date().toISOString(),durationSec:Math.round((Date.now()-state.sessionStartedAt)/1000),results:state.results}); setJSON(STORAGE.validation, history.slice(-30));
}

function renderReport() {
  if (state.runMode === 'validation') persistValidationSession(); else persistLearningSession();
  const total = state.results.length; const correct = state.results.filter(r=>r.correct).length; const wrong = total-correct; const reviewDone = state.results.filter(r=>r.context === 'review').length; const newDone = state.results.filter(r=>r.context === 'new').length;
  if (state.runMode === 'validation') {
    const rows = state.results.map(r => `<div class="report-row ${r.correct?'ok':'no'}"><span>${escapeHtml(r.display || r.id)}</span><b>${r.correct?'정답':'오답'}</b></div>`).join('');
    app.innerHTML = `<section class="screen"><div class="center"><div class="report-card"><div class="date-label">검증 완료 · v${APP_VERSION}</div><h1>Unit 01을<br>끝까지 확인했습니다.</h1><div class="home-metrics"><div class="metric"><strong>${correct}</strong><span>정답</span></div><div class="metric"><strong>${wrong}</strong><span>오답</span></div><div class="metric"><strong>${total}</strong><span>전체</span></div></div><div class="report-list">${rows}</div><div class="action-row"><button class="primary" id="again">다시 검증</button><button class="secondary" id="admin">관리자 홈</button></div></div></div></section>`;
    document.getElementById('again').onclick=startValidationSession; document.getElementById('admin').onclick=renderAdmin; return;
  }
  const tomorrow = state.demo ? unitLearningIds().length : reviewQueue().filter(r=>!r.done && r.due===localDate(1)).length; const remembered = state.results.filter(r=>r.correct && r.context==='review').length;
  app.innerHTML = `<section class="screen"><div class="center"><div class="report-card growth-report"><div class="date-label">오늘 학습 완료 · v${APP_VERSION}</div><h1>오늘 할 만큼<br>분명하게 봤습니다.</h1><div class="today-plan"><div><span>정답</span><strong>${correct}/${total}</strong></div><div><span>복습 성공</span><strong>${remembered}</strong></div><div><span>내일 다시</span><strong>${tomorrow}</strong></div></div><div class="growth-card"><span>오늘 쌓인 것</span><strong>${newDone ? `Unit 01 ${newDone}문항 완료` : `${reviewDone}문항 다시 꺼내기 완료`}</strong><p>틀린 문제도 오늘 끝내지 않고, 다시 만날 날짜를 잡아 둡니다.</p></div>${renderWeekStrip()}<div class="action-row"><button class="primary" id="home">학생 홈</button>${state.demo ? '<button class="secondary" id="admin">관리자 홈</button>' : ''}</div></div></div></section>`;
  document.getElementById('home').onclick=renderStudentHome; if (state.demo) document.getElementById('admin').onclick=renderAdmin;
}

function clearLearningData() {
  [STORAGE.learning, STORAGE.reviews, STORAGE.completed].forEach(k=>localStorage.removeItem(k)); showToast('학습 기록을 초기화했습니다.'); renderAdmin();
}

function renderAdmin() {
  const vh = getJSON(STORAGE.validation, []); const lh = learningHistory(); const last = lh.at(-1); const total = last?.results?.length || 0; const correct = last?.results?.filter(r=>r.correct).length || 0;
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card"><div class="brand">ADMIN · 2007</div><h1>천일문 개발·관찰</h1><p class="lead">학생 화면은 단순하게 유지하고, 관리자에서 <b>학습 모드</b>와 <b>문제 검증 모드</b>를 나눠 확인합니다.</p><div class="home-metrics"><div class="metric"><strong>${lh.length}</strong><span>학습 세션</span></div><div class="metric"><strong>${total ? `${correct}/${total}` : '-'}</strong><span>최근 학습</span></div><div class="metric"><strong>${vh.length}</strong><span>검증 세션</span></div></div><div class="admin-actions"><button class="primary" id="preview">학습 모드 미리보기</button><button class="secondary" id="validate">문제 검증 모드</button><button class="secondary" id="student">학생 홈</button><button class="ghost-danger" id="clear">학습 기록 초기화</button><button class="secondary" id="logout">PIN 화면</button></div></div></div></section>`;
  document.getElementById('preview').onclick=()=>startLearningSession({force:true,demo:true}); document.getElementById('validate').onclick=startValidationSession; document.getElementById('student').onclick=()=>{state.mode='student';state.demo=false;renderStudentHome();}; document.getElementById('clear').onclick=clearLearningData; document.getElementById('logout').onclick=renderLogin;
}

function renderTokens(tokens) { return tokens.map((t,i)=>`<span class="token" data-i="${i}">${escapeHtml(t)}</span>${/^[,.;:!?]$/.test(t)?'':' '}`).join(''); }
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escapeAttr(v){return escapeHtml(v).replace(/`/g,'&#96;');}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
loadUnit().then(renderLogin).catch(err=>{ console.error(err); app.innerHTML='<section class="screen"><div class="center"><div class="login-card"><h1>학습 데이터를 불러오지 못했습니다.</h1><p class="lead">새로고침 후 다시 확인해 주세요.</p></div></div></section>'; });
