// v0.9.2 PFAL guided repair layer
// Student learning mode only: first wrong answer -> one small clue + one concept -> retry or reveal.
(() => {
  const baseRenderResultPanel = renderResultPanel;
  const repairAttempts = new Map();

  function repairKey(q) {
    const entry = typeof currentEntry === 'function' ? currentEntry() : null;
    return `${state.flowIndex}|${entry?.reviewId || entry?.id || q.id}`;
  }

  function guideFor(q) {
    return (window.PFAL_REPAIR_GUIDES && window.PFAL_REPAIR_GUIDES[q.id]) || {
      cue: '정답 전체를 찾으려 하지 말고, 문장에서 가장 먼저 확인해야 할 한 부분만 다시 찾아보세요.',
      term: '문장 구조',
      concept: '긴 문장도 작은 역할 덩어리로 나누면 판단하기 쉬워집니다.'
    };
  }

  function clearPrematureAnswerReveal() {
    document.querySelectorAll('.answer-choice').forEach(el => el.classList.remove('answer-choice'));
    document.querySelectorAll('.answer-span').forEach(el => el.classList.remove('answer-span'));
  }

  function revealCorrectAnswer(q) {
    if (q.interaction === 'choice') {
      document.querySelectorAll('.choice').forEach(btn => {
        if (normalize(btn.dataset.choice) === normalize(q.answer)) btn.classList.add('answer-choice');
      });
      return;
    }
    if (q.interaction === 'span' || q.interaction === 'pairSpan') {
      const sentenceEl = document.getElementById('tokenSentence');
      if (!sentenceEl) return;
      const spans = [...sentenceEl.querySelectorAll('.token')];
      const tokens = tokenise(q.sentence);
      const answers = q.answers || [q.answer];
      answers.forEach(ans => {
        const range = findTextRange(tokens, ans);
        if (!range) return;
        spans.forEach((span, i) => {
          if (i >= range[0] && i <= range[1]) span.classList.add('answer-span');
        });
      });
    }
  }

  function renderRepairStep(q, correctAnswer) {
    const result = document.getElementById('result');
    if (!result) return;
    const g = guideFor(q);
    result.innerHTML = `<div class="repair-panel">
      <div class="repair-eyebrow">한 번 더 생각</div>
      <div class="repair-title">정답을 보기 전에<br>이 한 가지만 다시 봅니다.</div>
      <div class="repair-cue"><span>생각 힌트</span><strong>${escapeHtml(g.cue)}</strong></div>
      <div class="repair-concept"><span>개념 한 줄 · ${escapeHtml(g.term)}</span><p>${escapeHtml(g.concept)}</p></div>
      <div class="repair-actions">
        <button class="primary" id="repairRetry">다시 풀어보기</button>
        <button class="secondary" id="repairReveal">정답·해설 보기</button>
      </div>
    </div>`;

    document.getElementById('repairRetry').onclick = () => {
      showToast('같은 문제를 한 번만 더 봅니다.');
      renderFlow();
    };
    document.getElementById('repairReveal').onclick = () => {
      revealCorrectAnswer(q);
      baseRenderResultPanel(q, false, correctAnswer);
    };
    result.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  renderResultPanel = function(q, correct, correctAnswer) {
    const key = repairKey(q);
    const studentRepairMode = !correct && state.runMode === 'learn' && !state.demo && !state.supervisorMode;

    if (studentRepairMode) {
      const attempts = repairAttempts.get(key) || 0;
      if (attempts === 0) {
        repairAttempts.set(key, 1);
        clearPrematureAnswerReveal();
        renderRepairStep(q, correctAnswer);
        return;
      }
      repairAttempts.delete(key);
      return baseRenderResultPanel(q, correct, correctAnswer);
    }

    repairAttempts.delete(key);
    return baseRenderResultPanel(q, correct, correctAnswer);
  };

  const baseStartLearningSessionV092 = startLearningSession;
  startLearningSession = function(options = {}) {
    repairAttempts.clear();
    return baseStartLearningSessionV092(options);
  };
})();
