const app = document.getElementById('app');
const toast = document.getElementById('toast');

const APP_VERSION = '0.4.0';

const state = {
  mode: null,
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

function todayKR() {
  return new Intl.DateTimeFormat('ko-KR', {month:'long', day:'numeric', weekday:'short'}).format(new Date());
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 850);
}

async function loadUnit() {
  const res = await fetch(`./data/unit01.json?v=${APP_VERSION}`, {cache:'no-store'});
  if (!res.ok) throw new Error('unit01.json load failed');
  state.unit = await res.json();
  state.itemMap = new Map(state.unit.items.map(item => [item.id, item]));
  state.flow = state.unit.validationFlow || [];
}

function interactiveIds() {
  return state.flow.filter(id => id !== 'REPORT');
}

function currentPosition() {
  return Math.max(1, interactiveIds().indexOf(state.flow[state.flowIndex]) + 1);
}

function renderLogin() {
  app.innerHTML = `<section class="screen"><div class="center"><div class="login-card">
    <div class="brand">CHUNILMUN · PFAL</div>
    <h1>천일문 Unit 01</h1>
    <p class="lead">학생 8081 · 관리자 2007</p>
    <div class="pin-row"><input id="pin" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN"><button class="primary" id="loginBtn">시작</button></div>
  </div></div></section>`;
  const pin = document.getElementById('pin');
  document.getElementById('loginBtn').onclick = () => login(pin.value);
  pin.addEventListener('keydown', e => { if (e.key === 'Enter') login(pin.value); });
  pin.focus();
}

function login(pin) {
  if (pin === '8081') { state.mode = 'student'; renderHome(); }
  else if (pin === '2007') { state.mode = 'admin'; renderAdmin(); }
  else showToast('PIN을 확인하세요.');
}

function getHistory() {
  return JSON.parse(localStorage.getItem('chunilmun_validation_history') || '[]');
}

function renderHome() {
  const total = interactiveIds().length;
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">Unit 01 · 주어의 형태</div></div><div class="daily-badge">v${APP_VERSION}</div></div>
    <p class="lead">현재는 <b>교재 원문 문제와 해설의 구현 검증</b> 단계입니다. 각 문제는 한 번 제출하고, 정답·오답과 풀이를 확인한 뒤 바로 다음 문제로 진행합니다.</p>
    <div class="home-metrics"><div class="metric"><strong>${total}</strong><span>검증 문항</span></div><div class="metric"><strong>1회</strong><span>문항별 제출</span></div><div class="metric"><strong>끝까지</strong><span>오답도 계속 진행</span></div></div>
    <div class="action-row"><button class="primary" id="start">Unit 01 검증 시작</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick = startSession;
  document.getElementById('logout').onclick = renderLogin;
}

function startSession() {
  state.flowIndex = 0;
  state.results = [];
  state.sessionStartedAt = Date.now();
  resetItemState();
  renderFlow();
}

function resetItemState() {
  state.selectedRange = null;
  state.selectedChoice = null;
  state.pairRanges = [];
  state.submitted = false;
}

function topbar(q) {
  return `<div class="topbar"><div>${escapeHtml(q.display || q.id)}</div><div>${currentPosition()} / ${interactiveIds().length}</div></div>`;
}

function renderFlow() {
  const id = state.flow[state.flowIndex];
  if (!id || id === 'REPORT') return renderReport();
  const q = state.itemMap.get(id);
  if (!q) return nextFlow();
  resetItemState();
  if (q.interaction === 'choice') return renderChoice(q);
  if (q.interaction === 'span') return renderSpan(q);
  if (q.interaction === 'pairSpan') return renderPairSpan(q);
  if (q.interaction === 'text') return renderText(q);
  nextFlow();
}

function nextFlow() {
  state.flowIndex += 1;
  renderFlow();
}

function nextLabel() {
  return currentPosition() === interactiveIds().length ? '결과 보기' : '다음 문제';
}

function guide(text) {
  return `<div class="guide-strip">${text}</div>`;
}

function renderChoice(q) {
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div class="sentence">${escapeHtml(q.sentence)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('선택 → <b>답안 제출</b> → 정답·해설 확인 → 다음 문제')}
    <div class="choices">${q.choices.map(c => `<button class="choice" data-choice="${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('')}</div>
    <div class="submit-row"><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
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
    submit.remove();
    recordResult(q, correct, state.selectedChoice, q.answer);
    renderResultPanel(q, correct, q.answer);
  };
}

function renderText(q) {
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div class="sentence">${escapeHtml(q.sentence)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('답 입력 → <b>답안 제출</b> → 정답·해설 확인 → 다음 문제')}
    <div class="text-answer-row"><input id="textAnswer" class="text-answer" autocomplete="off" spellcheck="false" placeholder="답 입력"><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
  </div></div></section>`;
  const input = document.getElementById('textAnswer');
  const submit = document.getElementById('submit');
  input.addEventListener('input', () => submit.disabled = !input.value.trim());
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !submit.disabled) submit.click(); });
  submit.onclick = () => {
    if (state.submitted || !input.value.trim()) return;
    state.submitted = true;
    input.disabled = true;
    const selected = input.value.trim();
    const correct = normalize(selected) === normalize(q.answer);
    recordResult(q, correct, selected, q.answer);
    submit.remove();
    renderResultPanel(q, correct, q.answer);
  };
  input.focus();
}

function tokenise(sentence) {
  return sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)?|\d+(?:,\d+)*|[^\sA-Za-z\d]/g) || [];
}

function tokensToText(tokens, start, end) {
  if (start == null || end == null) return '';
  return tokens.slice(Math.min(start,end), Math.max(start,end)+1).join(' ')
    .replace(/\s+([,.;:!?])/g,'$1')
    .replace(/([‘“])\s+/g,'$1')
    .replace(/\s+([’”])/g,'$1');
}

function findTextRange(tokens, target) {
  const wanted = normalize(target);
  for (let s = 0; s < tokens.length; s++) {
    for (let e = s; e < tokens.length; e++) {
      if (normalize(tokensToText(tokens,s,e)) === wanted) return [s,e];
    }
  }
  return null;
}

function bindRangeSelector(el, spans, onChange) {
  let dragging = false, start = null, end = null, pointerId = null;
  const paint = () => {
    spans.forEach((span,i) => span.classList.toggle('selected', start != null && i >= Math.min(start,end) && i <= Math.max(start,end)));
    onChange(start,end);
  };
  const pointIndex = (x,y) => {
    const token = document.elementFromPoint(x,y)?.closest?.('.token');
    return token && el.contains(token) ? Number(token.dataset.i) : null;
  };
  el.addEventListener('pointerdown', e => {
    if (state.submitted) return;
    const token = e.target.closest?.('.token');
    if (!token) return;
    e.preventDefault(); dragging = true; pointerId = e.pointerId; start = end = Number(token.dataset.i); paint();
  });
  document.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const idx = pointIndex(e.clientX,e.clientY);
    if (idx == null) return;
    e.preventDefault(); end = idx; paint();
  }, {passive:false});
  const finish = e => { if (dragging && e.pointerId === pointerId) { dragging = false; pointerId = null; } };
  document.addEventListener('pointerup', finish, {passive:true});
  document.addEventListener('pointercancel', finish, {passive:true});
  return {reset(){start=end=null;spans.forEach(s=>s.classList.remove('selected'));onChange(null,null);}};
}

function renderSpan(q) {
  const tokens = tokenise(q.sentence);
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div id="tokenSentence" class="token-sentence">${renderTokens(tokens)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('드래그로 범위 선택 → 선택 내용 확인 → <b>답안 제출</b>')}
    <div class="selection-preview" id="preview">선택한 답: <span>없음</span></div>
    <div class="submit-row"><button class="secondary" id="reset">다시 선택</button><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
  </div></div></section>`;
  const el = document.getElementById('tokenSentence');
  const spans = [...el.querySelectorAll('.token')];
  const preview = document.getElementById('preview');
  const submit = document.getElementById('submit');
  const selector = bindRangeSelector(el, spans, (s,e) => {
    state.selectedRange = s == null ? null : [s,e];
    const text = state.selectedRange ? tokensToText(tokens,s,e) : '없음';
    preview.innerHTML = `선택한 답: <span>${escapeHtml(text)}</span>`;
    submit.disabled = !state.selectedRange;
  });
  document.getElementById('reset').onclick = () => { if (!state.submitted) selector.reset(); };
  submit.onclick = () => {
    if (!state.selectedRange || state.submitted) return;
    state.submitted = true;
    const [s,e] = state.selectedRange;
    const selected = tokensToText(tokens,s,e);
    const correct = normalize(selected) === normalize(q.answer);
    spans.forEach((span,i) => {
      span.classList.remove('selected');
      if (i >= Math.min(s,e) && i <= Math.max(s,e)) span.classList.add(correct ? 'correct-span' : 'wrong-span');
    });
    const answerRange = findTextRange(tokens,q.answer);
    if (answerRange) spans.forEach((span,i) => { if (i >= answerRange[0] && i <= answerRange[1]) span.classList.add('answer-span'); });
    document.getElementById('reset').disabled = true;
    submit.remove();
    recordResult(q,correct,selected,q.answer);
    renderResultPanel(q,correct,q.answer);
  };
}

function renderPairSpan(q) {
  const tokens = tokenise(q.sentence);
  app.innerHTML = `<section class="screen">${topbar(q)}<div class="learning-area"><div class="question-wrap">
    <div id="tokenSentence" class="token-sentence">${renderTokens(tokens)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    ${guide('① 첫 범위 드래그 → <b>선택 저장</b>　② 둘째 범위 드래그 → <b>선택 저장</b>　③ 답안 제출')}
    <div class="pair-slots" id="slots"></div>
    <div class="submit-row"><button class="secondary" id="reset">전체 지우기</button><button class="secondary" id="add" disabled>선택 저장</button><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
  </div></div></section>`;
  const el = document.getElementById('tokenSentence');
  const spans = [...el.querySelectorAll('.token')];
  const add = document.getElementById('add');
  const submit = document.getElementById('submit');
  let pending = null;
  const selector = bindRangeSelector(el, spans, (s,e) => { pending = s == null ? null : [s,e]; add.disabled = !pending || state.pairRanges.length >= 2; });
  const refresh = () => {
    document.getElementById('slots').innerHTML = [0,1].map(i => `<div class="pair-slot"><b>${i+1}</b><span>${state.pairRanges[i] ? escapeHtml(tokensToText(tokens,...state.pairRanges[i])) : '미선택'}</span></div>`).join('');
    submit.disabled = state.pairRanges.length !== 2;
  };
  add.onclick = () => {
    if (!pending || state.submitted || state.pairRanges.length >= 2) return;
    state.pairRanges.push([...pending]);
    selector.reset(); pending = null; refresh();
  };
  document.getElementById('reset').onclick = () => { if (!state.submitted) { state.pairRanges=[]; selector.reset(); refresh(); } };
  submit.onclick = () => {
    if (state.pairRanges.length !== 2 || state.submitted) return;
    state.submitted = true;
    const selected = state.pairRanges.map(r => tokensToText(tokens,...r));
    const correct = selected.every((text,i) => normalize(text) === normalize(q.answers[i]));
    state.pairRanges.forEach(r => spans.forEach((span,i) => { if (i >= Math.min(...r) && i <= Math.max(...r)) span.classList.add(correct ? 'correct-span' : 'wrong-span'); }));
    q.answers.forEach(ans => {
      const r = findTextRange(tokens,ans);
      if (r) spans.forEach((span,i) => { if (i >= r[0] && i <= r[1]) span.classList.add('answer-span'); });
    });
    add.disabled = true; document.getElementById('reset').disabled = true; submit.remove();
    recordResult(q,correct,selected.join(' / '),q.answers.join(' / '));
    renderResultPanel(q,correct,q.answers.join(' / '));
  };
  refresh();
}

function renderResultPanel(q, correct, correctAnswer) {
  const result = document.getElementById('result');
  const structure = q.structure ? `<div class="structure-view"><span>구조 보기</span>${escapeHtml(q.structure)}</div>` : '';
  const memory = q.memory ? `<div class="memory-point"><span>기억할 한 가지</span><strong>${escapeHtml(q.memory)}</strong></div>` : '';
  result.innerHTML = `<div class="result-panel ${correct ? 'is-correct' : 'is-wrong'}">
    <div class="result-title">${correct ? '정답입니다.' : '오답입니다.'}</div>
    ${correct ? '' : `<div class="answer-line"><span>정답</span><b>${escapeHtml(correctAnswer)}</b></div>`}
    <div class="explanation"><span>왜?</span>${escapeHtml(q.explanation || '')}</div>
    ${structure}${memory}
    <button class="primary next-question" id="next">${nextLabel()}</button>
  </div>`;
  document.getElementById('next').onclick = nextFlow;
  result.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function recordResult(q,correct,submittedAnswer,correctAnswer) {
  state.results.push({id:q.id,display:q.display,correct,submittedAnswer,correctAnswer,at:new Date().toISOString()});
}

function saveSession() {
  const history = getHistory();
  history.push({version:APP_VERSION,date:new Date().toISOString(),durationSec:Math.round((Date.now()-state.sessionStartedAt)/1000),results:state.results});
  localStorage.setItem('chunilmun_validation_history',JSON.stringify(history.slice(-20)));
}

function renderReport() {
  saveSession();
  const total = state.results.length;
  const correct = state.results.filter(r=>r.correct).length;
  const wrong = total-correct;
  const rows = state.results.map(r => `<div class="report-row ${r.correct?'ok':'no'}"><span>${escapeHtml(r.display || r.id)}</span><b>${r.correct?'정답':'오답'}</b></div>`).join('');
  app.innerHTML = `<section class="screen"><div class="center"><div class="report-card">
    <div class="date-label">Unit 01 검증 완료 · v${APP_VERSION}</div><h1>교재 문항을<br>끝까지 확인했습니다.</h1>
    <div class="home-metrics"><div class="metric"><strong>${correct}</strong><span>정답</span></div><div class="metric"><strong>${wrong}</strong><span>오답</span></div><div class="metric"><strong>${total}</strong><span>전체</span></div></div>
    <div class="report-list">${rows}</div>
    <div class="action-row"><button class="primary" id="again">다시 검증</button><button class="secondary" id="home">학생 홈</button></div>
  </div></div></section>`;
  document.getElementById('again').onclick=startSession;
  document.getElementById('home').onclick=renderHome;
}

function renderAdmin() {
  const history = getHistory();
  const last = history.at(-1);
  const total = last?.results?.length || 0;
  const correct = last?.results?.filter(r=>r.correct).length || 0;
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="brand">ADMIN · 2007</div><h1>Unit 01 검증 현황</h1>
    <p class="lead">현재 단계에서는 교재 원문 문제 → 답안 제출 → 정답·오답 → 해설 → 다음 문제의 흐름을 검증합니다.</p>
    <div class="home-metrics"><div class="metric"><strong>${history.length}</strong><span>검증 세션</span></div><div class="metric"><strong>${total ? `${correct}/${total}` : '-'}</strong><span>최근 정답</span></div><div class="metric"><strong>v${APP_VERSION}</strong><span>현재 버전</span></div></div>
    <div class="action-row"><button class="primary" id="student">학생 화면</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('student').onclick=()=>{state.mode='student';renderHome();};
  document.getElementById('logout').onclick=renderLogin;
}

function renderTokens(tokens) {
  return tokens.map((t,i)=>`<span class="token" data-i="${i}">${escapeHtml(t)}</span>${/^[,.;:!?]$/.test(t)?'':' '}`).join('');
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escapeAttr(v){return escapeHtml(v).replace(/`/g,'&#96;');}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
loadUnit().then(renderLogin).catch(err=>{
  console.error(err);
  app.innerHTML='<section class="screen"><div class="center"><div class="login-card"><h1>학습 데이터를 불러오지 못했습니다.</h1><p class="lead">새로고침 후 다시 확인해 주세요.</p></div></div></section>';
});
