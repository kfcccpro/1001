const CLOUD_DIAGNOSTIC_VERSION = '0.9.1';
state.cloud.lastDiagnostic = null;

async function runCloudDiagnostic(){
  const startedAt = Date.now();
  const rows = [];
  const add = (name, ok, detail) => rows.push({name, ok, detail});
  try {
    await waitForCloud(6000);
    add('Firebase SDK', Boolean(state.cloud.api && state.cloud.db), state.cloud.api ? '로드 완료' : '로드 실패');
    add('익명 인증', Boolean(state.cloud.auth?.currentUser), state.cloud.auth?.currentUser ? '인증 완료' : '인증되지 않음');
    if (!state.cloud.ready || !state.cloud.db || !state.cloud.api) throw new Error(state.cloud.error || 'Firebase 연결이 준비되지 않았습니다.');

    const {doc, setDoc, getDoc, deleteDoc} = state.cloud.api;
    const token = `diag-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const stateRef = doc(state.cloud.db, CLOUD_COLLECTION, CLOUD_STATE_DOC);
    await setDoc(stateRef, {diagnostic:{token, version:CLOUD_DIAGNOSTIC_VERSION, at:new Date().toISOString(), device:deviceInfo()}}, {merge:true});
    const stateSnap = await getDoc(stateRef);
    const stateOk = stateSnap.exists() && stateSnap.data()?.diagnostic?.token === token;
    add('진도 문서 읽기·쓰기', stateOk, stateOk ? 'chunilmun1001/state 정상' : '쓰기 후 읽기 검증 실패');

    const diagId = `_diag_${Date.now()}`;
    const sessionRef = doc(state.cloud.db, CLOUD_SESSION_COLLECTION, diagId);
    await setDoc(sessionRef, {diagnostic:true, token, date:new Date().toISOString(), device:deviceInfo()});
    const sessionSnap = await getDoc(sessionRef);
    const sessionOk = sessionSnap.exists() && sessionSnap.data()?.token === token;
    add('세션 문서 읽기·쓰기', sessionOk, sessionOk ? 'chunilmun1001_sessions 정상' : '세션 검증 실패');
    try { await deleteDoc(sessionRef); } catch {}

    const allOk = rows.every(r => r.ok);
    state.cloud.status = allOk ? 'online' : 'error';
    state.cloud.lastDiagnostic = {ok:allOk, rows, at:new Date().toISOString(), elapsedMs:Date.now()-startedAt};
    return state.cloud.lastDiagnostic;
  } catch(err){
    add('Firestore 규칙', false, String(err?.message || err));
    state.cloud.status = navigator.onLine ? 'error' : 'offline';
    state.cloud.lastDiagnostic = {ok:false, rows, at:new Date().toISOString(), elapsedMs:Date.now()-startedAt, error:String(err?.message || err)};
    return state.cloud.lastDiagnostic;
  }
}

function renderCloudDiagnosticResult(result){
  const rows = (result?.rows || []).map(r => `<div class="diag-row ${r.ok?'pass':'fail'}"><div><strong>${r.ok?'PASS':'FAIL'} · ${escapeHtml(r.name)}</strong><span>${escapeHtml(r.detail || '')}</span></div></div>`).join('');
  return `<div class="diag-summary ${result?.ok?'pass':'fail'}"><strong>${result?.ok?'클라우드 연결 정상':'클라우드 연결 확인 필요'}</strong><span>${result?.ok?'이 기기에서 진도·세션 읽기/쓰기가 모두 통과했습니다.':'실패 항목의 내용을 확인하세요.'}</span></div><div class="diag-list">${rows}</div>`;
}

function renderCloudDiagnostic(){
  app.innerHTML = `<section class="screen"><div class="center"><div class="home-card cloud-admin-card"><div class="home-header"><div><div class="date-label">ADMIN · CLOUD TEST</div><div class="home-title">기기간 동기화 진단</div></div><div class="cloud-pill ${cloudStatusClass()}">${escapeHtml(cloudStatusText())}</div></div><p class="lead">Firestore 규칙 게시 후 실제 읽기·쓰기를 검사합니다. 학습 진도에는 영향을 주지 않습니다.</p><div id="diagBody"><div class="diag-running"><div class="cloud-loader"></div><strong>연결을 확인하고 있습니다.</strong></div></div><div class="action-row"><button class="secondary" id="diagBack">감독자 홈</button></div></div></div></section>`;
  document.getElementById('diagBack').onclick = renderAdmin;
  runCloudDiagnostic().then(result => {
    const body = document.getElementById('diagBody');
    if (body) body.innerHTML = renderCloudDiagnosticResult(result);
    refreshCloudStatusIfVisible();
  });
}

const baseRenderAdminV091 = renderAdmin;
renderAdmin = function(){
  baseRenderAdminV091();
  const actions = document.querySelector('.admin-actions');
  if (actions && !document.getElementById('cloudDiagnostic')) {
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.id = 'cloudDiagnostic';
    btn.textContent = '클라우드 연결 진단';
    btn.onclick = renderCloudDiagnostic;
    const historyBtn = document.getElementById('cloudHistory');
    if (historyBtn?.nextSibling) actions.insertBefore(btn, historyBtn.nextSibling);
    else actions.appendChild(btn);
  }
};
