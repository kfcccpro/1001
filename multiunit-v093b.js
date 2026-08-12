const MULTIUNIT_BATCH_VERSION = '0.9.3-batch6';
const MULTIUNIT_CATALOG_URL = './data/catalog.json';
const MULTIUNIT_SELECTED_KEY = 'chunilmun_selected_unit';

state.catalog = null;
state.unitCache = new Map();
state.batchSupervisorMode = false;
state.batchSupervisorIds = [];
state.batchSupervisorBackup = null;

function unitNoLabel(unitNo) { return `Unit ${String(unitNo).padStart(2, '0')}`; }
function catalogUnitsV093b() { return (state.catalog?.chapters || []).flatMap(ch => (ch.units || []).map(u => ({...u, chapter: ch.chapter, chapterTitle: ch.title}))); }
function catalogScopeV093b() {
  const units = catalogUnitsV093b();
  const chapters = state.catalog?.chapters || [];
  const maxUnit = units.reduce((m,u)=>Math.max(m,Number(u.unit)||0),0);
  const maxChapter = chapters.reduce((m,ch)=>Math.max(m,Number(ch.chapter)||0),0);
  return {maxUnit,maxChapter,unitLabel:`Unit 01~${String(maxUnit).padStart(2,'0')}`,chapterLabel:`Chapter 01~${String(maxChapter).padStart(2,'0')}`};
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
function savedUnitNoV093b() {
  const saved = Number(localStorage.getItem(MULTIUNIT_SELECTED_KEY));
  return Number.isInteger(saved) && saved > 0 ? saved : null;
}
function needsSelectedUnitRestoreV093b() {
  const saved = savedUnitNoV093b();
  if (!saved || !state.catalog) return false;
  return Number(state.unit?.meta?.unit || 1) !== saved && catalogUnitsV093b().some(u => Number(u.unit) === saved);
}
async function restoreSelectedUnitV093b() {
  await loadCatalogV093b();
  const saved = savedUnitNoV093b();
  if (!saved || !catalogUnitsV093b().some(u => Number(u.unit) === saved)) return;
  if (Number(state.unit?.meta?.unit || 1) !== saved) await selectUnitV093b(saved, {persist:false});
}
function restoreBatchSupervisorV093b() {
  if (!state.batchSupervisorMode) return;
  if (state.batchSupervisorBackup) { state.unit = state.batchSupervisorBackup.unit; state.itemMap = state.batchSupervisorBackup.itemMap; }
  state.batchSupervisorMode = false; state.batchSupervisorIds = []; state.batchSupervisorBackup = null;
}

// Span-selection reconstruction keeps hyphenated/numeric forms and quoted words intact.
tokenise = function(sentence) {
  return String(sentence || '').match(/[A-Za-z]+(?:[’'][A-Za-z]+)?|\d+(?:,\d+)*(?:[A-Za-z]+)?|[^\sA-Za-z\d]/g) || [];
};
tokensToText = function(tokens, start, end) {
  if (start == null || end == null) return '';
  return tokens.slice(Math.min(start,end), Math.max(start,end)+1).join(' ')
    .replace(/\s+([,.;:!?\)\]\}])/g,'$1')
    .replace(/([\(\[\{‘“])\s+/g,'$1')
    .replace(/\s*-\s*/g,'-')
    .replace(/'\s+([A-Za-z])/g,"'$1")
    .replace(/([A-Za-z])\s+'/g,"$1'")
    .replace(/\s+([’”])/g,'$1');
};
renderTokens = function(tokens) {
  return tokens.map((t,i) => {
    const next = tokens[i+1];
    const noSpaceAfter = /^[,.;:!?\)\]\}’”]$/.test(next || '') || t === '-' || next === '-' || t === "'" || next === "'";
    return `<span class="token" data-i="${i}">${escapeHtml(t)}</span>${noSpaceAfter?'':' '}`;
  }).join('');
};

const supervisorIdsBeforeMultiunitV093b = supervisorIds;
supervisorIds = function() { return state.batchSupervisorMode ? state.batchSupervisorIds : supervisorIdsBeforeMultiunitV093b(); };
async function startBatchSupervisorReviewV093b() {
  await loadCatalogV093b();
  const datasets = await Promise.all(catalogUnitsV093b().map(entry => fetchUnitDataV093b(entry.unit)));
  state.batchSupervisorBackup = {unit: state.unit, itemMap: state.itemMap};
  const combinedMap = new Map(); const combinedIds = [];
  datasets.forEach(data => {
    const label = unitNoLabel(data.meta.unit);
    (data.validationFlow || []).filter(id => id !== 'REPORT').forEach(id => {
      const item = data.items.find(x => x.id === id); if (!item) return;
      const clone = {...item, display: `${label} · ${item.display || item.id}`};
      combinedMap.set(clone.id, clone); combinedIds.push(clone.id);
    });
  });
  state.batchSupervisorMode = true; state.batchSupervisorIds = combinedIds; state.itemMap = combinedMap; startSupervisorReview(0);
}
function renderUnitCatalogV093b() {
  if (!state.catalog) return '<div class="multiunit-loading">단원 목록 불러오는 중…</div>';
  const current = Number(state.unit?.meta?.unit || 1);
  return (state.catalog.chapters || []).map(ch => {
    const chips = (ch.units || []).map(u => `<button class="unit-chip${Number(u.unit)===current?' active':''}" data-unit="${u.unit}" type="button"><span>${unitNoLabel(u.unit)}</span><b>${escapeHtml(u.title)}</b></button>`).join('');
    return `<div class="chapter-unit-group"><div class="chapter-unit-title"><span>CHAPTER ${String(ch.chapter).padStart(2,'0')}</span><b>${escapeHtml(ch.title)}</b></div><div class="unit-chip-grid">${chips}</div></div>`;
  }).join('');
}
function bindUnitCatalogButtonsV093b(container, afterSelect) {
  container?.querySelectorAll('[data-unit]').forEach(btn => {
    btn.onclick = async () => {
      btn.disabled = true;
      try { await selectUnitV093b(Number(btn.dataset.unit)); afterSelect(); }
      catch (err) { console.error(err); showToast('단원 데이터를 불러오지 못했습니다.'); btn.disabled = false; }
    };
  });
}
const renderStudentHomeBeforeMultiunitV093b = renderStudentHome;
renderStudentHome = function() {
  if (!state.catalog || needsSelectedUnitRestoreV093b()) {
    restoreSelectedUnitV093b().then(renderStudentHome).catch(err => { console.error(err); renderStudentHomeBeforeMultiunitV093b(); });
    return;
  }
  const due = dueReviews().length; const doneToday = isUnitDoneToday(); const streak = streakCount(); const unitCount = unitLearningIds().length;
  const meta = state.unit?.meta || {unit:1,chapter:1,title:'주어의 형태'};
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card multiunit-home">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘도 한 번 더.</div></div><div class="daily-badge">매일학습</div></div>
    <p class="lead">긴 시간보다 <b>매일 다시 꺼내는 것</b>을 우선합니다. 현재 선택한 단원만 학습 기록에 반영됩니다.</p>
    <div class="selected-unit-card"><span>CHAPTER ${String(meta.chapter).padStart(2,'0')} · ${unitNoLabel(meta.unit)}</span><strong>${escapeHtml(meta.title)}</strong></div>
    <div class="today-plan"><div><span>오늘 복습</span><strong>${due}</strong></div><div><span>${unitNoLabel(meta.unit)}</span><strong>${doneToday?'완료':unitCount}</strong></div><div><span>연속 학습</span><strong>${streak}일</strong></div></div>
    ${renderWeekStrip()}<div class="action-row"><button class="primary" id="start">${doneToday&&due===0?'이 단원 다시 보기':'이 단원 학습 시작'}</button><button class="secondary" id="logout">PIN 화면</button></div>
    <div class="student-unit-picker"><div class="picker-title">단원 선택</div>${renderUnitCatalogV093b()}</div></div></div></section>`;
  document.getElementById('start').onclick = () => startLearningSession({force: doneToday && due === 0});
  document.getElementById('logout').onclick = renderLogin;
  bindUnitCatalogButtonsV093b(document.querySelector('.student-unit-picker'), renderStudentHome);
};
const renderAdminBeforeMultiunitV093b = renderAdmin;
renderAdmin = function() {
  restoreBatchSupervisorV093b();
  if (!state.catalog || needsSelectedUnitRestoreV093b()) {
    restoreSelectedUnitV093b().then(renderAdmin).catch(err => { console.error(err); renderAdminBeforeMultiunitV093b(); });
    return;
  }
  renderAdminBeforeMultiunitV093b();
  const card=document.querySelector('.home-card'), actions=document.querySelector('.admin-actions');
  if(!card||!actions||document.getElementById('multiunitAdminCatalog')) return;
  const meta=state.unit?.meta||{unit:1,chapter:1,title:'주어의 형태'}, scope=catalogScopeV093b();
  const panel=document.createElement('div'); panel.id='multiunitAdminCatalog'; panel.className='multiunit-admin-catalog';
  panel.innerHTML=`<div class="multiunit-admin-head"><div><span>일괄 검수 범위</span><strong>${scope.chapterLabel} · ${scope.unitLabel}</strong></div><div class="selected-admin-unit">${unitNoLabel(meta.unit)} · ${escapeHtml(meta.title)}</div></div>${renderUnitCatalogV093b()}`;
  card.insertBefore(panel,actions);
  const supervisorStart=document.getElementById('supervisorStart'); if(supervisorStart) supervisorStart.textContent=`${unitNoLabel(meta.unit)}만 감독형 검수`;
  const batch=document.createElement('button'); batch.className='primary batch-supervisor-btn'; batch.id='batchSupervisorStart'; batch.textContent=`${scope.unitLabel} 한꺼번에 검수`;
  batch.onclick=async()=>{batch.disabled=true;batch.textContent='전체 단원 준비 중…';try{await startBatchSupervisorReviewV093b();}catch(err){console.error(err);showToast('일괄 검수 데이터를 준비하지 못했습니다.');batch.disabled=false;batch.textContent=`${scope.unitLabel} 한꺼번에 검수`;}};
  actions.insertBefore(batch,actions.firstChild); bindUnitCatalogButtonsV093b(panel,renderAdmin);
};
const renderReportBeforeMultiunitV093b = renderReport;
renderReport = function() {
  renderReportBeforeMultiunitV093b();
  const label=unitNoLabel(state.unit?.meta?.unit||1);
  if(state.runMode==='validation') {
    const h1=document.querySelector('.report-card h1');
    if(h1) h1.innerHTML=`${escapeHtml(label)}을<br>끝까지 확인했습니다.`;
    return;
  }
  const newDone=state.results.filter(r=>r.context==='new').length;
  const growthStrong=document.querySelector('.growth-card strong');
  if(growthStrong && newDone) growthStrong.textContent=`${label} ${newDone}문항 완료`;
  const planValues=[...document.querySelectorAll('.report-card .today-plan > div')];
  const tomorrowBox=planValues.find(box=>box.querySelector('span')?.textContent?.includes('내일 다시'));
  const tomorrowStrong=tomorrowBox?.querySelector('strong');
  if(tomorrowStrong && !state.demo) {
    const tomorrowForUnit=reviewQueue().filter(r=>!r.done && r.due===localDate(1) && state.itemMap.has(r.itemId)).length;
    tomorrowStrong.textContent=String(tomorrowForUnit);
  }
};
loadCatalogV093b().catch(err => console.error('multiunit catalog preload failed', err));
