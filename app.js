const app = document.getElementById('app');
const toast = document.getElementById('toast');

const APP_VERSION = '0.3.1';
const VALIDATION_MODE = true;

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
  setTimeout(() => toast.classList.remove('show'), 900);
}

async function loadUnit() {
  const res = await fetch(`./data/unit01.json?v=${APP_VERSION}`, {cache:'no-store'});
  if (!res.ok) throw new Error('unit01.json load failed');
  state.unit = await res.json();
  state.itemMap = new Map(state.unit.items.map(item => [item.id, item]));
  buildFlow();
}

function buildFlow() {
  const raw = state.unit.dailyFlow || [];
  state.flow = raw.filter(id => !(VALIDATION_MODE && id === 'BREAK'));
}

function interactiveIds() {
  return state.flow.filter(id => id !== 'BREAK' && id !== 'REPORT');
}

function currentInteractivePosition() {
  const currentId = state.flow[state.flowIndex];
  const ids = interactiveIds();
  return Math.max(1, ids.indexOf(currentId) + 1);
}

function renderLogin() {
  app.innerHTML = `<section class="screen"><div class="center"><div class="login-card">
    <div class="brand">CHUNILMUN · PFAL</div>
    <h1>오늘도 한 문장씩<br>구조를 분명하게.</h1>
    <p class="lead">PIN을 입력하세요.</p>
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
    renderHome();
  } else if (pin === '2007') {
    state.mode = 'admin';
    renderAdmin();
  } else {
    showToast('PIN을 확인하세요.');
  }
}

function getValidationHistory() {
  return JSON.parse(localStorage.getItem('chunilmun_validation_history') || '[]');
}

function renderHome() {
  const total = interactiveIds().length;
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">Unit 01 확인</div></div><div class="daily-badge">검증 모드</div></div>
    <p class="lead">지금은 학습 로직을 검증하는 단계입니다. <b>맞거나 틀려도 한 번 제출한 뒤 다음 문제로 계속 진행</b>합니다.</p>
    <div class="home-metrics"><div class="metric"><strong>${total}</strong><span>확인 문항</span></div><div class="metric"><strong>1회</strong><span>문항별 제출</span></div><div class="metric"><strong>중단 없음</strong><span>오답도 다음 문제 진행</span></div></div>
    <div class="action-row"><button class="primary" id="start">검증 시작</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick = startSession;
  document.getElementById('logout').onclick = renderLogin;
}

function startSession() {
  state.flowIndex = 0;
  state.results = [];
  state.selectedRange = null;
  state.selectedChoice = null;
  state.pairRanges = [];
  state.submitted = false;
  state.sessionStartedAt = Date.now();
  renderFlow();
}

function topbar(stage, item) {
  const pos = currentInteractivePosition();
  const total = interactiveIds().length;
  return `<div class="topbar"><div>${stage}${item ? ` · ${item}` : ''}</div><div>${pos} / ${total}</div></div>`;
}

function renderFlow() {
  const flowId = state.flow[state.flowIndex];
  if (!flowId || flowId === 'REPORT') return renderReport();
  if (flowId === 'BREAK') return nextFlow();
  const q = state.itemMap.get(flowId);
  if (!q) return nextFlow();

  resetItemState();
  if (q.interaction === 'choice') return renderChoice(q);
  if (q.interaction === 'span') return renderSpan(q);
  if (q.interaction === 'pairSpan') return renderPairSpan(q);
  return nextFlow();
}

function resetItemState() {
  state.selectedRange = null;
  state.selectedChoice = null;
  state.pairRanges = [];
  state.submitted = false;
}

function nextFlow() {
  state.flowIndex += 1;
  renderFlow();
}

function isLastInteractive() {
  const currentId = state.flow[state.flowIndex];
  const ids = interactiveIds();
  return ids.indexOf(currentId) === ids.length - 1;
}

function nextButtonLabel() {
  return isLastInteractive() ? '결과 보기' : '다음 문제';
}

function renderChoice(q) {
  app.innerHTML = `<section class="screen">${topbar(q.stage, displayItem(q))}<div class="learning-area"><div class="question-wrap">
    <div class="sentence">${escapeHtml(q.sentence)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    <div class="guide-strip">선택 → <b>답안 제출</b> → 결과 확인 → 다음 문제</div>
    <div class="choices">${q.choices.map(c => `<button class="choice" data-choice="${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('')}</div>
    <div class="submit-row"><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
  </div></div></section>`;

  const buttons = [...document.querySelectorAll('.choice')];
  const submit = document.getElementById('submit');
  buttons.forEach(btn => {
    btn.onclick = () => {
      if (state.submitted) return;
      state.selectedChoice = btn.dataset.choice;
      buttons.forEach(b => b.classList.toggle('choice-selected', b === btn));
      submit.disabled = false;
    };
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

function tokenise(sentence) {
  return sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)?|\d+(?:,\d+)*|[^\sA-Za-z\d]/g) || [];
}

function tokensToText(tokens, start, end) {
  if (start == null || end == null) return '';
  return tokens.slice(Math.min(start, end), Math.max(start, end) + 1)
    .join(' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([‘“])\s+/g, '$1')
    .replace(/\s+([’”])/g, '$1');
}

function findTextRange(tokens, target) {
  const wanted = normalize(target);
  for (let s = 0; s < tokens.length; s++) {
    for (let e = s; e < tokens.length; e++) {
      if (normalize(tokensToText(tokens, s, e)) === wanted) return [s, e];
    }
  }
  return null;
}

function bindRangeSelector(el, spans, onChange) {
  let dragging = false;
  let start = null;
  let end = null;
  let activePointerId = null;

  const paint = () => {
    spans.forEach((span, i) => {
      const selected = start != null && end != null && i >= Math.min(start, end) && i <= Math.max(start, end);
      span.classList.toggle('selected', selected);
    });
    onChange(start, end);
  };

  const indexFromPoint = (x, y) => {
    const p = document.elementFromPoint(x, y);
    const token = p?.closest?.('.token');
    if (!token || !el.contains(token)) return null;
    return Number(token.dataset.i);
  };

  const begin = e => {
    if (state.submitted) return;
    const token = e.target.closest?.('.token');
    if (!token) return;
    e.preventDefault();
    dragging = true;
    activePointerId = e.pointerId;
    start = end = Number(token.dataset.i);
    paint();
  };

  const move = e => {
    if (!dragging || e.pointerId !== activePointerId) return;
    const idx = indexFromPoint(e.clientX, e.clientY);
    if (idx == null) return;
    e.preventDefault();
    end = idx;
    paint();
  };

  const finish = e => {
    if (!dragging || (activePointerId != null && e.pointerId !== activePointerId)) return;
    dragging = false;
    activePointerId = null;
  };

  el.addEventListener('pointerdown', begin);
  document.addEventListener('pointermove', move, {passive:false});
  document.addEventListener('pointerup', finish, {passive:true});
  document.addEventListener('pointercancel', finish, {passive:true});

  return {
    reset() {
      start = end = null;
      spans.forEach(s => s.classList.remove('selected'));
      onChange(null, null);
    }
  };
}

function renderSpan(q) {
  const tokens = tokenise(q.sentence);
  app.innerHTML = `<section class="screen">${topbar(q.stage, displayItem(q))}<div class="learning-area"><div class="question-wrap">
    <div class="token-sentence" id="tokenSentence">${renderTokens(tokens)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    <div class="guide-strip">드래그로 답 범위 선택 → <b>답안 제출</b> → 결과 확인 → 다음 문제</div>
    <div class="selection-preview" id="preview">선택한 답: <span>없음</span></div>
    <div class="submit-row"><button class="secondary" id="reset">다시 선택</button><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
  </div></div></section>`;

  const el = document.getElementById('tokenSentence');
  const spans = [...el.querySelectorAll('.token')];
  const preview = document.getElementById('preview');
  const submit = document.getElementById('submit');

  const selector = bindRangeSelector(el, spans, (start, end) => {
    state.selectedRange = start == null ? null : [start, end];
    const text = state.selectedRange ? tokensToText(tokens, start, end) : '없음';
    preview.innerHTML = `선택한 답: <span>${escapeHtml(text)}</span>`;
    submit.disabled = !state.selectedRange;
  });

  document.getElementById('reset').onclick = () => {
    if (!state.submitted) selector.reset();
  };

  submit.onclick = () => {
    if (!state.selectedRange || state.submitted) return;
    state.submitted = true;
    const [s, e] = state.selectedRange;
    const selectedText = tokensToText(tokens, s, e);
    const accepted = q.accepted?.length ? q.accepted : [q.answer];
    const correct = accepted.some(ans => normalize(ans) === normalize(selectedText));

    spans.forEach((span, i) => {
      span.classList.remove('selected');
      if (i >= Math.min(s, e) && i <= Math.max(s, e)) span.classList.add(correct ? 'correct-span' : 'wrong-span');
    });
    const answerRange = findTextRange(tokens, q.answer);
    if (answerRange) spans.forEach((span, i) => {
      if (i >= answerRange[0] && i <= answerRange[1]) span.classList.add('answer-span');
    });

    document.getElementById('reset').disabled = true;
    submit.remove();
    recordResult(q, correct, selectedText, q.answer);
    renderResultPanel(q, correct, q.answer);
  };
}

function renderPairSpan(q) {
  const tokens = tokenise(q.sentence);
  app.innerHTML = `<section class="screen">${topbar(q.stage, displayItem(q))}<div class="learning-area"><div class="question-wrap">
    <div class="token-sentence" id="tokenSentence">${renderTokens(tokens)}</div>
    <div class="prompt">${escapeHtml(q.prompt)}</div>
    <div class="guide-strip">① 첫 범위 드래그 → 선택 저장　② 둘째 범위 드래그 → 선택 저장　③ 답안 제출</div>
    <div class="pair-slots" id="slots"></div>
    <div class="submit-row"><button class="secondary" id="reset">전체 지우기</button><button class="secondary" id="add">선택 저장</button><button class="primary submit-answer" id="submit" disabled>답안 제출</button></div>
    <div id="result"></div>
  </div></div></section>`;

  const el = document.getElementById('tokenSentence');
  const spans = [...el.querySelectorAll('.token')];
  const submit = document.getElementById('submit');
  const add = document.getElementById('add');
  const slots = document.getElementById('slots');
  let pendingRange = null;

  const selector = bindRangeSelector(el, spans, (start, end) => {
    pendingRange = start == null ? null : [start, end];
    add.disabled = !pendingRange || state.pairRanges.length >= 2;
  });

  function refreshSlots() {
    slots.innerHTML = [0,1].map(i => {
      const r = state.pairRanges[i];
      const text = r ? tokensToText(tokens, r[0], r[1]) : '미선택';
      return `<div class="pair-slot">${i+1} <span>${escapeHtml(text)}</span></div>`;
    }).join('');
    submit.disabled = state.pairRanges.length !== 2;
  }

  add.onclick = () => {
    if (!pendingRange || state.pairRanges.length >= 2 || state.submitted) return;
    state.pairRanges.push([...pendingRange]);
    selector.reset();
    pendingRange = null;
    refreshSlots();
  };

  document.getElementById('reset').onclick = () => {
    if (state.submitted) return;
    state.pairRanges = [];
    selector.reset();
    refreshSlots();
  };

  submit.onclick = () => {
    if (state.pairRanges.length !== 2 || state.submitted) return;
    state.submitted = true;
    const selectedTexts = state.pairRanges.map(r => tokensToText(tokens, r[0], r[1]));
    const correct = selectedTexts.length === q.answers.length && selectedTexts.every((text, i) => normalize(text) === normalize(q.answers[i]));

    state.pairRanges.forEach(r => spans.forEach((span, i) => {
      if (i >= Math.min(r[0], r[1]) && i <= Math.max(r[0], r[1])) span.classList.add(correct ? 'correct-span' : 'wrong-span');
    }));
    q.answers.forEach(ans => {
      const r = findTextRange(tokens, ans);
      if (r) spans.forEach((span, i) => {
        if (i >= r[0] && i <= r[1]) span.classList.add('answer-span');
      });
    });

    add.disabled = true;
    document.getElementById('reset').disabled = true;
    submit.remove();
    recordResult(q, correct, selectedTexts.join(' / '), q.answers.join(' / '));
    renderResultPanel(q, correct, q.answers.join(' / '));
  };

  refreshSlots();
}

function renderResultPanel(q, correct, correctAnswer) {
  const result = document.getElementById('result');
  const explanation = q.hint || '정답 범위와 문장 구조를 확인하세요.';
  const rule = q.ruleHtml ? `<div class="memory-point">기억 포인트 · ${q.ruleHtml}</div>` : '';
  result.innerHTML = `<div class="result-panel ${correct ? 'is-correct' : 'is-wrong'}">
    <div class="result-title">${correct ? '정답입니다.' : '오답입니다.'}</div>
    ${correct ? '' : `<div class="answer-line"><span>정답</span><b>${escapeHtml(correctAnswer)}</b></div>`}
    <div class="explanation"><span>풀이 핵심</span>${escapeHtml(explanation)}</div>
    ${rule}
    <button class="primary next-question" id="next">${nextButtonLabel()}</button>
  </div>`;
  document.getElementById('next').onclick = nextFlow;
  result.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function recordResult(q, correct, submittedAnswer, correctAnswer) {
  state.results.push({id:q.id, key:q.key, stage:q.stage, correct, submittedAnswer, correctAnswer, at:new Date().toISOString()});
}

function saveValidationSession() {
  const history = getValidationHistory();
  history.push({version:APP_VERSION, date:new Date().toISOString(), durationSec:state.sessionStartedAt ? Math.round((Date.now() - state.sessionStartedAt) / 1000) : null, results:state.results});
  localStorage.setItem('chunilmun_validation_history', JSON.stringify(history.slice(-20)));
}

function renderReport() {
  saveValidationSession();
  const total = state.results.length;
  const correct = state.results.filter(r => r.correct).length;
  const wrong = total - correct;
  const wrongIds = state.results.filter(r => !r.correct).map(r => r.id);
  app.innerHTML = `<section class="screen"><div class="center"><div class="report-card">
    <div class="date-label">검증 완료 · v${APP_VERSION}</div><h1>${total}문항을<br>끝까지 확인했습니다.</h1>
    <div class="home-metrics"><div class="metric"><strong>${correct}</strong><span>정답</span></div><div class="metric"><strong>${wrong}</strong><span>오답</span></div><div class="metric"><strong>${total}</strong><span>제출 완료</span></div></div>
    <p class="lead">오답이 있어도 멈추지 않고 다음 문제로 진행했습니다.${wrongIds.length ? `<br><b>오답 문항:</b> ${wrongIds.join(', ')}` : ''}</p>
    <div class="action-row"><button class="primary" id="again">처음부터 다시</button><button class="secondary" id="home">학생 홈</button></div>
  </div></div></section>`;
  document.getElementById('again').onclick = startSession;
  document.getElementById('home').onclick = renderHome;
}

function renderAdmin() {
  const history = getValidationHistory();
  const last = history.at(-1);
  const total = last?.results?.length || 0;
  const correct = last?.results?.filter(r => r.correct).length || 0;
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="brand">ADMIN · 2007</div><h1>학습 관찰</h1>
    <p class="lead">현재는 Unit 01 검증 모드입니다. 학생은 각 문항을 한 번 제출하고 결과를 확인한 뒤 계속 진행합니다.</p>
    <div class="home-metrics"><div class="metric"><strong>${history.length}</strong><span>검증 세션</span></div><div class="metric"><strong>${total ? `${correct}/${total}` : '-'}</strong><span>최근 정답</span></div><div class="metric"><strong>v${APP_VERSION}</strong><span>현재 버전</span></div></div>
    <div class="action-row"><button class="primary" id="student">학생 화면</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('student').onclick = () => { state.mode = 'student'; renderHome(); };
  document.getElementById('logout').onclick = renderLogin;
}

function displayItem(q) {
  if (q.publisherItemId) return q.publisherItemId.split('-').at(-1);
  if (q.id?.startsWith('PFAL-U01-BEFORE')) return 'BEFORE';
  if (q.id?.startsWith('PFAL-U01-AFTER')) return 'AFTER';
  if (q.id?.startsWith('PFAL-U01-T01')) return 'TRANSFER';
  return q.id || '';
}

function renderTokens(tokens) {
  return tokens.map((t, i) => `<span class="token" data-i="${i}">${escapeHtml(t)}</span>${/^[,.;:!?]$/.test(t) ? '' : ' '}`).join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

loadUnit().then(renderLogin).catch(() => {
  app.innerHTML = `<section class="screen"><div class="center"><div class="login-card"><h1>학습 데이터를 불러오지 못했습니다.</h1><p class="lead">새로고침 후 다시 확인해 주세요.</p></div></div></section>`;
});
