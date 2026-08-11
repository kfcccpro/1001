const GROWTH_VERSION = '0.6.0';

const baseRenderReportV05 = renderReport;

function itemInteraction(result) {
  return state.itemMap.get(result.id)?.interaction || '';
}

function pct(n, d) {
  return d ? Math.round((n / d) * 100) : null;
}

function sessionMetrics(results = []) {
  const total = results.length;
  const correct = results.filter(r => r.correct).length;
  const structure = results.filter(r => ['span','pairSpan'].includes(itemInteraction(r)));
  const application = results.filter(r => ['choice','text'].includes(itemInteraction(r)));
  const reviews = results.filter(r => r.context === 'review');
  const reviewCorrect = reviews.filter(r => r.correct).length;
  const newItems = results.filter(r => r.context === 'new');
  const newCorrect = newItems.filter(r => r.correct).length;
  return {
    total,
    correct,
    independent: pct(correct, total),
    structure: pct(structure.filter(r => r.correct).length, structure.length),
    structureN: structure.length,
    application: pct(application.filter(r => r.correct).length, application.length),
    applicationN: application.length,
    review: pct(reviewCorrect, reviews.length),
    reviewN: reviews.length,
    reviewCorrect,
    newRate: pct(newCorrect, newItems.length),
    newN: newItems.length
  };
}

function wordCountForResult(result) {
  const sentence = state.itemMap.get(result.id)?.sentence || '';
  return (sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)?/g) || []).length;
}

function comparableDelta(current, previous, key, nKey) {
  if (!previous || current[key] == null || previous[key] == null) return null;
  if ((current[nKey] || 0) < 3 || (previous[nKey] || 0) < 3) return null;
  return current[key] - previous[key];
}

function metricRow(label, value, delta, evidenceLabel) {
  if (value == null) {
    return `<div class="growth-row"><div class="growth-label">${escapeHtml(label)}</div><div class="growth-track"><div class="growth-fill" style="--value:0%"></div></div><div class="growth-value delta-flat">근거 부족<small>${escapeHtml(evidenceLabel)}</small></div></div>`;
  }
  const deltaHtml = delta == null
    ? `<small>${escapeHtml(evidenceLabel)}</small>`
    : `<small class="${delta > 0 ? 'delta-up' : 'delta-flat'}">${delta > 0 ? '+' : ''}${delta}%p · 이전 대비</small>`;
  return `<div class="growth-row"><div class="growth-label">${escapeHtml(label)}</div><div class="growth-track"><div class="growth-fill" style="--value:${Math.max(0, Math.min(100, value))}%"></div></div><div class="growth-value">${value}%${deltaHtml}</div></div>`;
}

function verifiedWins(results) {
  const labels = {
    'U01-Q01-2':'the number의 중심어를 보고 수일치를 판단함',
    'U01-Q02-1':'동명사구 주어를 하나의 행위로 판단함',
    'U01-Q04-1':'that절 전체를 주어 범위로 묶음',
    'U01-Q05-1':'what절 전체를 주어 범위로 묶음',
    'U01-Q06-1':'두 의문사절이 연결된 긴 주어를 묶음',
    'U01-Q07-1':'하나의 주어에 연결된 두 술어를 구분함',
    'U01-Q07-2':'전치사+관계대명사절의 수식 범위를 찾음'
  };
  return results.filter(r => r.correct && labels[r.id]).map(r => labels[r.id]).slice(0,3);
}

function latestLearningSnapshot() {
  const last = learningHistory().at(-1);
  if (!last?.results?.length) return '';
  const m = sessionMetrics(last.results);
  const parts = [];
  if (m.structure != null) parts.push(`구조 ${m.structure}%`);
  if (m.independent != null) parts.push(`직접 해결 ${m.independent}%`);
  if (m.reviewN) parts.push(`복습 ${m.reviewCorrect}/${m.reviewN}`);
  if (!parts.length) return '';
  return `<div class="latest-snapshot">최근 학습 · <b>${parts.join(' · ')}</b></div>`;
}

renderStudentHome = function() {
  const due = dueReviews().length;
  const doneToday = isUnitDoneToday();
  const streak = streakCount();
  const unitCount = unitLearningIds().length;
  const primaryLabel = doneToday && due === 0 ? '오늘 학습 다시 보기' : '오늘 학습 시작';
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘도 한 번 더.</div></div><div class="daily-badge">매일학습</div></div>
    <p class="lead">길게 한 번보다 <b>짧게라도 매일 다시 꺼내는 것</b>을 우선합니다.</p>
    <div class="today-plan"><div><span>오늘 복습</span><strong>${due}</strong></div><div><span>Unit 01</span><strong>${doneToday ? '완료' : unitCount}</strong></div><div><span>연속 학습</span><strong>${streak}일</strong></div></div>
    ${latestLearningSnapshot()}
    ${renderWeekStrip()}
    <div class="action-row"><button class="primary" id="start">${primaryLabel}</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick = () => startLearningSession({force: doneToday && due === 0});
  document.getElementById('logout').onclick = renderLogin;
};

renderReport = function() {
  if (state.runMode === 'validation') return baseRenderReportV05();

  persistLearningSession();
  const total = state.results.length;
  const correct = state.results.filter(r => r.correct).length;
  const reviewDone = state.results.filter(r => r.context === 'review').length;
  const newDone = state.results.filter(r => r.context === 'new').length;
  const tomorrow = state.demo ? unitLearningIds().length : reviewQueue().filter(r => !r.done && r.due === localDate(1)).length;

  const history = learningHistory();
  const previousSession = state.demo ? null : history.at(-2);
  const current = sessionMetrics(state.results);
  const previous = previousSession ? sessionMetrics(previousSession.results || []) : null;
  const structureDelta = comparableDelta(current, previous, 'structure', 'structureN');
  const independentDelta = comparableDelta(current, previous, 'independent', 'total');
  const applicationDelta = comparableDelta(current, previous, 'application', 'applicationN');

  const longest = state.results.filter(r => r.correct).reduce((max, r) => Math.max(max, wordCountForResult(r)), 0);
  const wins = verifiedWins(state.results);
  const rewardTitle = current.reviewN && current.review === 100
    ? `복습 ${current.reviewN}문항을 모두 기억했습니다.`
    : longest
      ? `${longest}단어 문장까지 직접 해결했습니다.`
      : '오늘의 학습 흔적을 남겼습니다.';
  const rewardText = structureDelta > 0
    ? `구조 찾기 정확도가 이전 비교 가능 학습보다 ${structureDelta}%p 올라갔습니다.`
    : current.reviewN
      ? `오늘 복습 ${current.reviewCorrect}/${current.reviewN}개를 다시 꺼냈습니다.`
      : '첫 기록부터 쌓습니다. 다음 학습부터 같은 기준으로 변화를 비교합니다.';

  const winHtml = wins.length
    ? `<div class="stable-list">${wins.map(x => `<div class="stable-item"><span class="stable-dot"></span><span>${escapeHtml(x)}</span></div>`).join('')}</div>`
    : '';

  app.innerHTML = `<section class="screen"><div class="center"><div class="report-card growth-report">
    <div class="date-label">오늘 학습 완료 · v${GROWTH_VERSION}</div>
    <div class="reward-kicker">TODAY'S GROWTH</div>
    <h1>오늘의 변화가<br>기록됐습니다.</h1>
    ${state.demo ? '<div class="preview-tag">관리자 미리보기 · 기록 저장 안 함</div>' : ''}
    <div class="growth-win"><span>오늘 가장 분명한 성과</span><strong>${escapeHtml(rewardTitle)}</strong><p>${escapeHtml(rewardText)}</p></div>
    <div class="growth-board">
      ${metricRow('구조 찾기', current.structure, structureDelta, `${current.structureN}문항 근거`)}
      ${metricRow('직접 해결', current.independent, independentDelta, `${current.total}문항 근거`)}
      ${metricRow('어법·의미 적용', current.application, applicationDelta, `${current.applicationN}문항 근거`)}
      ${metricRow('복습 기억', current.review, null, current.reviewN ? `${current.reviewCorrect}/${current.reviewN} 성공` : '오늘 복습 없음')}
    </div>
    ${winHtml}
    <div class="today-plan"><div><span>오늘 정답</span><strong>${correct}/${total}</strong></div><div><span>오늘 새 학습</span><strong>${newDone}</strong></div><div><span>내일 다시</span><strong>${tomorrow}</strong></div></div>
    <p class="growth-note">점수는 비교할 근거가 있을 때만 이전 기록과 비교합니다. 근거가 부족한 영역은 억지로 상승시키지 않습니다.</p>
    ${renderWeekStrip()}
    <div class="action-row"><button class="primary" id="home">학생 홈</button>${state.demo ? '<button class="secondary" id="admin">관리자 홈</button>' : ''}</div>
  </div></div></section>`;
  document.getElementById('home').onclick = renderStudentHome;
  if (state.demo) document.getElementById('admin').onclick = renderAdmin;
};

renderAdmin = function() {
  const vh = getJSON(STORAGE.validation, []);
  const lh = learningHistory();
  const last = lh.at(-1);
  const m = last ? sessionMetrics(last.results || []) : null;
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card">
    <div class="brand">ADMIN · 2007</div><h1>천일문 개발·관찰</h1>
    <p class="lead">학생 화면은 단순하게 유지하고, 관리자에서 학습·검증·성장 보상 흐름을 확인합니다.</p>
    <div class="home-metrics"><div class="metric"><strong>${lh.length}</strong><span>학습 세션</span></div><div class="metric"><strong>${m?.independent != null ? `${m.independent}%` : '-'}</strong><span>최근 직접 해결</span></div><div class="metric"><strong>${vh.length}</strong><span>검증 세션</span></div></div>
    <div class="admin-actions"><button class="primary" id="preview">학습 모드 미리보기</button><button class="secondary" id="validate">문제 검증 모드</button><button class="secondary" id="student">학생 홈</button><button class="ghost-danger" id="clear">학습 기록 초기화</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('preview').onclick = () => startLearningSession({force:true,demo:true});
  document.getElementById('validate').onclick = startValidationSession;
  document.getElementById('student').onclick = () => { state.mode='student'; state.demo=false; renderStudentHome(); };
  document.getElementById('clear').onclick = clearLearningData;
  document.getElementById('logout').onclick = renderLogin;
};