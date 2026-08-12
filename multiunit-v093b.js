const MULTIUNIT_BATCH_VERSION = '0.9.3-batch1';
const MULTIUNIT_CATALOG_URL = './data/catalog.json';
const MULTIUNIT_SELECTED_KEY = 'chunilmun_selected_unit';

state.catalog = null;
state.unitCache = new Map();
state.batchSupervisorMode = false;
state.batchSupervisorIds = [];
state.batchSupervisorBackup = null;

function unitNoLabel(unitNo) {
  return `Unit ${String(unitNo).padStart(2, '0')}`;
}

function catalogUnitsV093b() {
  return (state.catalog?.chapters || []).flatMap(ch => (ch.units || []).map(u => ({...u, chapter: ch.chapter, chapterTitle: ch.title})));
}

async function loadCatalogV093b() {
  if (state.catalog) return state.catalog;
  const res = await fetch(`${MULTIUNIT_CATALOG_URL}?v=${MULTIUNIT_BATCH_VERSION}`, {cache:'no-store'});
  if (!res.ok) throw new Error('catalog.json load failed');
  state.catalog = await res.json();
  if (state.unit?.meta?.unit) state.unitCache.set(Number(state.unit.meta.unit), state.unit);
  return state.catalog;
}

async function fetchUnitDataV093b(unitNo) {
  await loadCatalogV093b();
  const n = Number(unitNo);
  if (state.unitCache.has(n)) return state.unitCache.get(n);
  const entry = catalogUnitsV093b().find(u => Number(u.unit) === n);
  if (!entry) throw new Error(`Unit ${n} is not in catalog`);
  const res = await fetch(`./data/${entry.file}?v=${MULTIUNIT_BATCH_VERSION}`, {cache:'no-store'});
  if (!res.ok) throw new Error(`${entry.file} load failed`);
  const data = await res.json();
  state.unitCache.set(n, data);
  return data;
}

async function selectUnitV093b(unitNo, {persist = true} = {}) {
  const data = await fetchUnitDataV093b(unitNo);
  state.unit = data;
  state.itemMap = new Map(data.items.map(item => [item.id, item]));
  if (persist) localStorage.setItem(MULTIUNIT_SELECTED_KEY, String(data.meta.unit));
  return data;
}

function restoreBatchSupervisorV093b() {
  if (!state.batchSupervisorMode) return;
  if (state.batchSupervisorBackup) {
    state.unit = state.batchSupervisorBackup.unit;
    state.itemMap = state.batchSupervisorBackup.itemMap;
  }
  state.batchSupervisorMode = false;
  state.batchSupervisorIds = [];
  state.batchSupervisorBackup = null;
}

const supervisorIdsBeforeMultiunitV093b = supervisorIds;
supervisorIds = function() {
  return state.batchSupervisorMode ? state.batchSupervisorIds : supervisorIdsBeforeMultiunitV093b();
};

async function startBatchSupervisorReviewV093b() {
  await loadCatalogV093b();
  const entries = catalogUnitsV093b();
  const datasets = await Promise.all(entries.map(entry => fetchUnitDataV093b(entry.unit)));
  state.batchSupervisorBackup = {unit: state.unit, itemMap: state.itemMap};
  const combinedMap = new Map();
  const combinedIds = [];

  datasets.forEach(data => {
    const label = unitNoLabel(data.meta.unit);
    const flowIds = (data.validationFlow || []).filter(id => id !== 'REPORT');
    flowIds.forEach(id => {
      const item = data.items.find(x => x.id === id);
      if (!item) return;
      const clone = {...item, display: `${label} · ${item.display || item.id}`};
      combinedMap.set(clone.id, clone);
      combinedIds.push(clone.id);
    });
  });

  state.batchSupervisorMode = true;
  state.batchSupervisorIds = combinedIds;
  state.itemMap = combinedMap;
  startSupervisorReview(0);
}

function renderUnitCatalogV093b() {
  if (!state.catalog) return '<div class="multiunit-loading">단원 목록 불러오는 중…</div>';
  const current = Number(state.unit?.meta?.unit || 1);
  return (state.catalog.chapters || []).map(ch => {
    const chips = (ch.units || []).map(u => {
      const active = Number(u.unit) === current ? ' active' : '';
      return `<button class="unit-chip${active}" data-unit="${u.unit}" type="button"><span>${unitNoLabel(u.unit)}</span><b>${escapeHtml(u.title)}</b></button>`;
    }).join('');
    return `<div class="chapter-unit-group"><div class="chapter-unit-title"><span>CHAPTER ${String(ch.chapter).padStart(2,'0')}</span><b>${escapeHtml(ch.title)}</b></div><div class="unit-chip-grid">${chips}</div></div>`;
  }).join('');
}

function bindUnitCatalogButtonsV093b(container, afterSelect) {
  container?.querySelectorAll('[data-unit]').forEach(btn => {
    btn.onclick = async () => {
      btn.disabled = true;
      try {
        await selectUnitV093b(Number(btn.dataset.unit));
        afterSelect();
      } catch (err) {
        console.error(err);
        showToast('단원 데이터를 불러오지 못했습니다.');
        btn.disabled = false;
      }
    };
  });
}

const renderStudentHomeBeforeMultiunitV093b = renderStudentHome;
renderStudentHome = function() {
  if (!state.catalog) {
    loadCatalogV093b().then(renderStudentHome).catch(err => {
      console.error(err);
      renderStudentHomeBeforeMultiunitV093b();
    });
    return;
  }

  const due = dueReviews().length;
  const doneToday = isUnitDoneToday();
  const streak = streakCount();
  const unitCount = unitLearningIds().length;
  const meta = state.unit?.meta || {unit:1, chapter:1, title:'주어의 형태'};
  const primaryLabel = doneToday && due === 0 ? '이 단원 다시 보기' : '이 단원 학습 시작';

  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card multiunit-home">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘도 한 번 더.</div></div><div class="daily-badge">매일학습</div></div>
    <p class="lead">긴 시간보다 <b>매일 다시 꺼내는 것</b>을 우선합니다. 현재 선택한 단원만 학습 기록에 반영됩니다.</p>
    <div class="selected-unit-card"><span>CHAPTER ${String(meta.chapter).padStart(2,'0')} · ${unitNoLabel(meta.unit)}</span><strong>${escapeHtml(meta.title)}</strong></div>
    <div class="today-plan"><div><span>오늘 복습</span><strong>${due}</strong></div><div><span>${unitNoLabel(meta.unit)}</span><strong>${doneToday ? '완료' : unitCount}</strong></div><div><span>연속 학습</span><strong>${streak}일</strong></div></div>
    ${renderWeekStrip()}
    <div class="action-row"><button class="primary" id="start">${primaryLabel}</button><button class="secondary" id="logout">PIN 화면</button></div>
    <div class="student-unit-picker"><div class="picker-title">단원 선택</div>${renderUnitCatalogV093b()}</div>
  </div></div></section>`;

  document.getElementById('start').onclick = () => startLearningSession({force: doneToday && due === 0});
  document.getElementById('logout').onclick = renderLogin;
  bindUnitCatalogButtonsV093b(document.querySelector('.student-unit-picker'), renderStudentHome);
};

const renderAdminBeforeMultiunitV093b = renderAdmin;
renderAdmin = function() {
  restoreBatchSupervisorV093b();
  renderAdminBeforeMultiunitV093b();

  if (!state.catalog) {
    loadCatalogV093b().then(() => {
      if (state.mode === 'admin' && !state.supervisorMode) renderAdmin();
    }).catch(err => console.error(err));
    return;
  }

  const card = document.querySelector('.home-card');
  const actions = document.querySelector('.admin-actions');
  if (!card || !actions || document.getElementById('multiunitAdminCatalog')) return;

  const meta = state.unit?.meta || {unit:1, chapter:1, title:'주어의 형태'};
  const panel = document.createElement('div');
  panel.id = 'multiunitAdminCatalog';
  panel.className = 'multiunit-admin-catalog';
  panel.innerHTML = `<div class="multiunit-admin-head"><div><span>일괄 검수 범위</span><strong>Chapter 01~02 · Unit 01~08</strong></div><div class="selected-admin-unit">${unitNoLabel(meta.unit)} · ${escapeHtml(meta.title)}</div></div>${renderUnitCatalogV093b()}`;
  card.insertBefore(panel, actions);

  const supervisorStart = document.getElementById('supervisorStart');
  if (supervisorStart) supervisorStart.textContent = `${unitNoLabel(meta.unit)}만 감독형 검수`;

  const batch = document.createElement('button');
  batch.className = 'primary batch-supervisor-btn';
  batch.id = 'batchSupervisorStart';
  batch.textContent = 'Unit 01~08 한꺼번에 검수';
  batch.onclick = async () => {
    batch.disabled = true;
    batch.textContent = '전체 단원 준비 중…';
    try { await startBatchSupervisorReviewV093b(); }
    catch (err) {
      console.error(err);
      showToast('일괄 검수 데이터를 준비하지 못했습니다.');
      batch.disabled = false;
      batch.textContent = 'Unit 01~08 한꺼번에 검수';
    }
  };
  actions.insertBefore(batch, actions.firstChild);

  bindUnitCatalogButtonsV093b(panel, renderAdmin);
};

const renderReportBeforeMultiunitV093b = renderReport;
renderReport = function() {
  renderReportBeforeMultiunitV093b();
  const label = unitNoLabel(state.unit?.meta?.unit || 1);
  if (state.runMode === 'validation') {
    const h1 = document.querySelector('.report-card h1');
    if (h1) h1.innerHTML = `${escapeHtml(label)}을<br>끝까지 확인했습니다.`;
  } else {
    const growth = document.querySelector('.growth-card strong');
    if (growth && /^Unit 01 /.test(growth.textContent || '')) {
      growth.textContent = (growth.textContent || '').replace(/^Unit 01 /, `${label} `);
    }
  }
};

loadCatalogV093b().catch(err => console.error('multiunit catalog preload failed', err));
