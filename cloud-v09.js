const CLOUD_VERSION = '0.9.0';
const CLOUD_STATE_KEY = 'state';
const CLOUD_COLLECTION = 'chunilmun1001';
const CLOUD_SESSION_COLLECTION = 'chunilmun1001_sessions';
const ACTIVE_GRACE_MS = 120000;
const ACTIVE_TICK_MS = 5000;
const CLOUD_CHECKPOINT_MS = 30000;

state.cloud = {
  status: 'connecting',
  ready: false,
  error: null,
  db: null,
  auth: null,
  api: null,
  uid: null,
  activeSession: null,
  cloudActiveResults: [],
  tracker: null,
  lastCheckpointAt: 0
};

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDRUvXsYS6GvpcKVNTP8RkspBa1bwyw3LE',
  authDomain: 'moonma-f6dbe.firebaseapp.com',
  projectId: 'moonma-f6dbe',
  storageBucket: 'moonma-f6dbe.firebasestorage.app',
  messagingSenderId: '137418713716',
  appId: '1:137418713716:web:d2761d833ba288e9f27f21'
};

function cloudStatusText(){
  if (state.cloud.status === 'online') return '기기간 동기화 연결됨';
  if (state.cloud.status === 'offline') return '오프라인 · 이 기기에 임시 저장';
  if (state.cloud.status === 'error') return '동기화 지연 · 이 기기에 안전 저장';
  return '기기간 기록 연결 중';
}

function cloudStatusClass(){
  return state.cloud.status === 'online' ? 'online' : (state.cloud.status === 'connecting' ? 'connecting' : 'offline');
}

function uniqueBy(list, keyFn){
  const map = new Map();
  (list || []).forEach(item => {
    const key = keyFn(item);
    if (!key) return;
    const old = map.get(key);
    if (!old) map.set(key, item);
    else map.set(key, {...old, ...item, done: Boolean(old.done || item.done)});
  });
  return [...map.values()];
}

function mergeCompletedDays(local, remote){
  return uniqueBy([...(local || []), ...(remote || [])], x => `${x.date || ''}|${x.unit || ''}`)
    .sort((a,b) => String(a.date).localeCompare(String(b.date)))
    .slice(-365);
}

function mergeReviews(local, remote){
  return uniqueBy([...(local || []), ...(remote || [])], x => x.key || x.id)
    .sort((a,b) => String(a.due || '').localeCompare(String(b.due || '')))
    .slice(-700);
}

function sessionKey(session){
  return session.sessionId || `${session.date || ''}|${session.unit || ''}|${session.durationSec || ''}`;
}

function mergeSessions(local, remote){
  return uniqueBy([...(local || []), ...(remote || [])], sessionKey)
    .sort((a,b) => new Date(a.date || 0) - new Date(b.date || 0))
    .slice(-120);
}

function deviceInfo(){
  const ua = navigator.userAgent || '';
  let type = 'PC';
  if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) type = 'iPad';
  else if (/Android/i.test(ua) && !/Mobile/i.test(ua)) type = 'Android Tablet';
  else if (/Android|iPhone|Mobile/i.test(ua)) type = 'Mobile';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : /Firefox\//.test(ua) ? 'Firefox' : 'Browser';
  return {type, browser, label:`${type} · ${browser}`, width:screen.width, height:screen.height};
}

function activeSessionIsFresh(session){
  if (!session?.updatedAt) return false;
  return Date.now() - new Date(session.updatedAt).getTime() < 24 * 60 * 60 * 1000;
}

async function initCloud(){
  try {
    const base = 'https://www.gstatic.com/firebasejs/12.16.0/';
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`${base}firebase-app.js`),
      import(`${base}firebase-auth.js`),
      import(`${base}firebase-firestore.js`)
    ]);
    const firebaseApp = appMod.initializeApp(FIREBASE_CONFIG, 'chunilmun1001');
    const auth = authMod.getAuth(firebaseApp);
    if (!auth.currentUser) await authMod.signInAnonymously(auth);
    const db = fsMod.getFirestore(firebaseApp);
    state.cloud.api = fsMod;
    state.cloud.auth = auth;
    state.cloud.db = db;
    state.cloud.uid = auth.currentUser?.uid || null;
    state.cloud.ready = true;
    state.cloud.status = navigator.onLine ? 'online' : 'offline';
    await syncFromCloud();
    return true;
  } catch (err) {
    console.warn('[Chunilmun cloud] startup failed; local fallback active', err);
    state.cloud.error = String(err?.message || err);
    state.cloud.ready = false;
    state.cloud.status = navigator.onLine ? 'error' : 'offline';
    return false;
  }
}

const cloudReadyPromise = initCloud();
window.addEventListener('online', async () => {
  state.cloud.status = 'connecting';
  if (!state.cloud.ready) await initCloud();
  else await syncFromCloud();
  refreshCloudStatusIfVisible();
});
window.addEventListener('offline', () => {
  state.cloud.status = 'offline';
  refreshCloudStatusIfVisible();
});

async function waitForCloud(maxMs = 4500){
  await Promise.race([cloudReadyPromise, new Promise(resolve => setTimeout(resolve, maxMs))]);
}

async function syncFromCloud(){
  if (!state.cloud.ready || !state.cloud.db) return false;
  const {doc, getDoc, collection, getDocs, query, orderBy, limit} = state.cloud.api;
  try {
    const snap = await getDoc(doc(state.cloud.db, CLOUD_COLLECTION, CLOUD_STATE_KEY));
    const remoteState = snap.exists() ? snap.data() : {};
    const q = query(collection(state.cloud.db, CLOUD_SESSION_COLLECTION), orderBy('date','desc'), limit(120));
    const sessionSnap = await getDocs(q);
    const remoteSessions = sessionSnap.docs.map(d => d.data());

    const mergedDays = mergeCompletedDays(completedDays(), remoteState.completedDays || []);
    const mergedReviews = mergeReviews(reviewQueue(), remoteState.reviews || []);
    const mergedHistory = mergeSessions(learningHistory(), remoteSessions);
    setJSON(STORAGE.completed, mergedDays);
    setJSON(STORAGE.reviews, mergedReviews);
    setJSON(STORAGE.learning, mergedHistory);

    if (activeSessionIsFresh(remoteState.activeSession)) {
      state.cloud.activeSession = remoteState.activeSession;
      state.cloud.cloudActiveResults = remoteState.activeSession.results || [];
    } else {
      state.cloud.activeSession = null;
      state.cloud.cloudActiveResults = [];
    }

    state.cloud.status = navigator.onLine ? 'online' : 'offline';
    await pushSharedState();
    return true;
  } catch (err) {
    console.warn('[Chunilmun cloud] sync down failed', err);
    state.cloud.error = String(err?.message || err);
    state.cloud.status = navigator.onLine ? 'error' : 'offline';
    return false;
  }
}

async function pushSharedState(activeOverride){
  if (!state.cloud.ready || !state.cloud.db || !navigator.onLine) return false;
  const {doc, setDoc} = state.cloud.api;
  const payload = {
    schemaVersion: CLOUD_VERSION,
    completedDays: completedDays(),
    reviews: reviewQueue(),
    activeSession: activeOverride === undefined ? (state.cloud.activeSession || null) : activeOverride,
    lastDevice: deviceInfo(),
    updatedAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(state.cloud.db, CLOUD_COLLECTION, CLOUD_STATE_KEY), payload, {merge:true});
    state.cloud.status = 'online';
    return true;
  } catch (err) {
    console.warn('[Chunilmun cloud] shared state write failed', err);
    state.cloud.status = 'error';
    return false;
  }
}

async function saveCloudSession(session){
  if (!state.cloud.ready || !state.cloud.db || !navigator.onLine || !session?.sessionId) return false;
  const {doc, setDoc} = state.cloud.api;
  try {
    await setDoc(doc(state.cloud.db, CLOUD_SESSION_COLLECTION, session.sessionId), session, {merge:true});
    return true;
  } catch (err) {
    console.warn('[Chunilmun cloud] session write failed', err);
    state.cloud.status = 'error';
    return false;
  }
}

function markActivity(){
  const t = state.cloud.tracker;
  if (t?.running) t.lastActivityAt = Date.now();
}
['pointerdown','keydown','input','touchstart','wheel'].forEach(evt => document.addEventListener(evt, markActivity, {passive:true}));

function startActiveTracker(){
  stopActiveTracker(false);
  const now = Date.now();
  state.cloud.tracker = {
    running: true,
    sessionId: `s-${now}-${Math.random().toString(36).slice(2,8)}`,
    startedAt: now,
    lastTickAt: now,
    lastActivityAt: now,
    activeMs: 0,
    interval: null
  };
  state.cloud.cloudActiveResults = [];
  state.cloud.tracker.interval = setInterval(activeTimeTick, ACTIVE_TICK_MS);
  checkpointActiveSession(true);
}

function activeTimeTick(){
  const t = state.cloud.tracker;
  if (!t?.running) return;
  const now = Date.now();
  const delta = Math.min(now - t.lastTickAt, ACTIVE_TICK_MS * 2);
  t.lastTickAt = now;
  const visible = document.visibilityState === 'visible' && document.hasFocus();
  const recentlyActive = now - t.lastActivityAt <= ACTIVE_GRACE_MS;
  if (visible && recentlyActive) t.activeMs += Math.max(0, delta);
  if (now - state.cloud.lastCheckpointAt >= CLOUD_CHECKPOINT_MS) checkpointActiveSession();
}

function stopActiveTracker(clear = true){
  const t = state.cloud.tracker;
  if (!t) return;
  if (t.interval) clearInterval(t.interval);
  t.running = false;
  if (clear) state.cloud.tracker = null;
}

function currentActiveSeconds(){
  return Math.round((state.cloud.tracker?.activeMs || 0) / 1000);
}

function checkpointLearningSideEffects(result){
  if (!result || state.demo || state.supervisorMode || state.runMode !== 'learn') return;
  const queue = reviewQueue();
  if (result.reviewId) {
    const hit = queue.find(x => x.id === result.reviewId);
    if (hit) hit.done = true;
    if (!result.correct) addReview(queue, result.id, 1, 'D+1 재확인');
  } else if (result.context === 'new') {
    addReview(queue, result.id, 1, 'D+1');
    if (!result.correct) addReview(queue, result.id, 3, 'D+3');
    if (!result.correct || result.memory) addReview(queue, result.id, 7, 'D+7');
  }
  setJSON(STORAGE.reviews, queue.slice(-700));
}

let checkpointTimer = null;
function checkpointActiveSession(immediate = false){
  if (state.demo || state.supervisorMode || state.runMode !== 'learn') return;
  const t = state.cloud.tracker;
  if (!t) return;
  const doSave = async () => {
    state.cloud.lastCheckpointAt = Date.now();
    const entry = typeof currentEntry === 'function' ? currentEntry() : null;
    const active = {
      sessionId: t.sessionId,
      unit: state.unit?.meta?.unit || 1,
      startedAt: new Date(t.startedAt).toISOString(),
      updatedAt: new Date().toISOString(),
      currentItemId: entry?.id || null,
      activeSec: currentActiveSeconds(),
      wallSec: Math.round((Date.now() - t.startedAt) / 1000),
      device: deviceInfo(),
      results: state.results.slice(-80)
    };
    state.cloud.activeSession = active;
    state.cloud.cloudActiveResults = active.results;
    await pushSharedState(active);
  };
  clearTimeout(checkpointTimer);
  if (immediate) doSave();
  else checkpointTimer = setTimeout(doSave, 700);
}

window.addEventListener('pagehide', () => checkpointActiveSession(true));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') checkpointActiveSession(true);
  else markActivity();
});

if (typeof completedNewIdsForUnit === 'function') {
  const baseCompletedNewIdsForUnitV09 = completedNewIdsForUnit;
  completedNewIdsForUnit = function(){
    const ids = baseCompletedNewIdsForUnitV09();
    const extra = [
      ...(state.cloud.cloudActiveResults || []),
      ...(state.runMode === 'learn' && !state.demo ? state.results : [])
    ];
    extra.forEach(r => { if (r?.context === 'new' && r.id) ids.add(r.id); });
    return ids;
  };
}

const baseLoginV09 = login;
login = async function(pin){
  if (pin !== '8081' && pin !== '2007') return baseLoginV09(pin);
  app.innerHTML = `<section class="screen"><div class="center"><div class="login-card sync-card"><div class="brand">CHUNILMUN · PFAL</div><h1>학습 기록을<br>불러오는 중입니다.</h1><p class="lead">PC·모바일·태블릿에서 같은 진도를 이어갑니다.</p><div class="cloud-loader"></div></div></div></section>`;
  await waitForCloud();
  baseLoginV09(pin);
  if (state.cloud.status === 'online') showToast('기기간 학습 기록을 동기화했습니다.');
};

const baseStartLearningSessionV09 = startLearningSession;
startLearningSession = function(options = {}){
  const demo = Boolean(options?.demo);
  baseStartLearningSessionV09(options);
  if (!demo && state.mode === 'student') startActiveTracker();
};

const baseRecordResultV09 = recordResult;
recordResult = function(q, correct, submittedAnswer, correctAnswer){
  markActivity();
  baseRecordResultV09(q, correct, submittedAnswer, correctAnswer);
  if (!state.demo && !state.supervisorMode && state.runMode === 'learn') {
    const result = state.results.at(-1);
    checkpointLearningSideEffects(result);
    checkpointActiveSession();
  }
};

const basePersistLearningSessionV09 = persistLearningSession;
persistLearningSession = function(){
  if (state.demo || state.supervisorMode) return basePersistLearningSessionV09();
  const t = state.cloud.tracker;
  const activeSec = currentActiveSeconds();
  const wallSec = t ? Math.round((Date.now() - t.startedAt) / 1000) : Math.round((Date.now() - state.sessionStartedAt) / 1000);
  const sessionId = t?.sessionId || `s-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  basePersistLearningSessionV09();
  const history = learningHistory();
  const last = history.at(-1);
  if (last) {
    last.sessionId = sessionId;
    last.activeSec = activeSec;
    last.wallSec = wallSec;
    last.device = deviceInfo();
    last.endedAt = new Date().toISOString();
    last.date = last.date || last.endedAt;
    setJSON(STORAGE.learning, history.slice(-120));
    saveCloudSession(last);
  }
  stopActiveTracker(true);
  state.cloud.activeSession = null;
  state.cloud.cloudActiveResults = [];
  pushSharedState(null);
};

function secondsForSession(s){
  return Number.isFinite(Number(s?.activeSec)) ? Number(s.activeSec) : Number(s?.durationSec || 0);
}

function sumActiveSince(days){
  const cutoff = Date.now() - (days - 1) * 86400000;
  return learningHistory().filter(s => new Date(s.date || 0).getTime() >= cutoff).reduce((sum,s) => sum + secondsForSession(s), 0);
}

function todayActiveSec(){
  const key = localDate();
  return learningHistory().filter(s => String(s.date || '').slice(0,10) === key).reduce((sum,s) => sum + secondsForSession(s), 0);
}

function formatDuration(sec){
  const s = Math.max(0, Math.round(Number(sec) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h}시간 ${m}분`;
  if (m) return `${m}분`;
  return `${s}초`;
}

function sessionRange(session){
  const start = new Date(session.date || session.startedAt || 0);
  const end = session.endedAt ? new Date(session.endedAt) : new Date(start.getTime() + Number(session.wallSec || session.durationSec || 0) * 1000);
  const f = d => Number.isNaN(d.getTime()) ? '-' : new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(d);
  return `${f(start)} ~ ${f(end)}`;
}

function renderCloudAdmin(){
  const sessions = [...learningHistory()].sort((a,b) => new Date(b.date || 0) - new Date(a.date || 0));
  const today = todayActiveSec();
  const week = sumActiveSince(7);
  const month = sumActiveSince(30);
  const progress = typeof unitProgress === 'function' ? unitProgress() : {done:0,total:unitLearningIds().length};
  const recentRows = sessions.slice(0,12).map(s => {
    const total = (s.results || []).length;
    const correct = (s.results || []).filter(r => r.correct).length;
    return `<div class="cloud-session-row"><div><strong>${escapeHtml(String(s.date || '').slice(0,10) || '-')}</strong><span>${escapeHtml(sessionRange(s))} · ${escapeHtml(s.device?.label || '기기 미기록')}</span></div><div><b>${formatDuration(secondsForSession(s))}</b><span>${total ? `${correct}/${total} 정답` : '학습 기록'}</span></div></div>`;
  }).join('') || '<div class="cloud-empty">아직 저장된 실제 학습 세션이 없습니다.</div>';

  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card cloud-admin-card">
    <div class="home-header"><div><div class="date-label">ADMIN · 학습 기록</div><div class="home-title">실제 학습시간</div></div><div class="cloud-pill ${cloudStatusClass()}">${escapeHtml(cloudStatusText())}</div></div>
    <div class="active-time-hero"><span>오늘 실제 학습</span><strong>${formatDuration(today)}</strong><p>앱을 켜둔 시간이 아니라, 화면이 보이고 최근 학습 행동이 있는 시간만 누적합니다.</p></div>
    <div class="cloud-metrics"><div><span>최근 7일</span><strong>${formatDuration(week)}</strong></div><div><span>최근 30일</span><strong>${formatDuration(month)}</strong></div><div><span>Unit 01 진도</span><strong>${progress.done}/${progress.total}</strong></div></div>
    <div class="cloud-section-title">최근 학습 세션</div><div class="cloud-session-list">${recentRows}</div>
    <div class="action-row"><button class="primary" id="cloudRefresh">기록 새로고침</button><button class="secondary" id="cloudBack">감독자 홈</button></div>
  </div></div></section>`;
  document.getElementById('cloudRefresh').onclick = async () => { showToast('기록을 동기화하는 중입니다.'); await syncFromCloud(); renderCloudAdmin(); };
  document.getElementById('cloudBack').onclick = renderAdmin;
}

const baseRenderAdminV09 = renderAdmin;
renderAdmin = function(){
  baseRenderAdminV09();
  const actions = document.querySelector('.admin-actions');
  if (actions && !document.getElementById('cloudHistory')) {
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.id = 'cloudHistory';
    btn.textContent = '학습시간·진도 기록';
    btn.onclick = renderCloudAdmin;
    const first = actions.firstElementChild;
    if (first?.nextSibling) actions.insertBefore(btn, first.nextSibling);
    else actions.appendChild(btn);
  }
  const note = document.querySelector('.supervisor-admin-note');
  if (note && !document.querySelector('.cloud-status-line')) note.insertAdjacentHTML('afterend', `<div class="cloud-status-line ${cloudStatusClass()}"><b>${escapeHtml(cloudStatusText())}</b><span>학생 모드만 기록 · 감독형 전체보기는 기록하지 않음</span></div>`);
};

const baseRenderStudentHomeV09 = renderStudentHome;
renderStudentHome = function(){
  baseRenderStudentHomeV09();
  const card = document.querySelector('.home-card');
  if (card && !card.querySelector('.student-cloud-line')) {
    const actions = card.querySelector('.action-row');
    actions?.insertAdjacentHTML('beforebegin', `<div class="student-cloud-line ${cloudStatusClass()}">${escapeHtml(cloudStatusText())}</div>`);
  }
};

function refreshCloudStatusIfVisible(){
  document.querySelectorAll('.cloud-pill,.cloud-status-line,.student-cloud-line').forEach(el => {
    el.classList.remove('online','offline','connecting');
    el.classList.add(cloudStatusClass());
    if (el.classList.contains('cloud-status-line')) el.innerHTML = `<b>${escapeHtml(cloudStatusText())}</b><span>학생 모드만 기록 · 감독형 전체보기는 기록하지 않음</span>`;
    else el.textContent = cloudStatusText();
  });
}
