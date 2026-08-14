const RUNTIME_FIX_VERSION = '0.9.4';

/* Cloud sync: reads may happen in any mode, shared-state writes only in real student learning. */
syncFromCloud = async function(){
  if(!state.cloud.ready||!state.cloud.db) return false;
  const {doc,getDoc,collection,getDocs,query,orderBy,limit}=state.cloud.api;
  try {
    const snap=await getDoc(doc(state.cloud.db,CLOUD_COLLECTION,CLOUD_STATE_DOC));
    const remote=snap.exists()?snap.data():{};
    const qs=await getDocs(query(collection(state.cloud.db,CLOUD_SESSION_COLLECTION),orderBy('date','desc'),limit(120)));
    setJSON(STORAGE.completed,mergeCompletedDays(completedDays(),remote.completedDays||[]));
    setJSON(STORAGE.reviews,mergeReviews(reviewQueue(),remote.reviews||[]));
    setJSON(STORAGE.learning,mergeSessions(learningHistory(),qs.docs.map(d=>d.data())));
    const active=newerActive(localActiveSession(),remote.activeSession);
    state.cloud.activeSession=active;
    state.cloud.cloudActiveResults=active?.results||[];
    setLocalActiveSession(active);
    state.cloud.status=navigator.onLine?'online':'offline';
    return true;
  } catch(err){
    console.warn('[Chunilmun cloud] read-only sync failed',err);
    state.cloud.error=String(err?.message||err);
    state.cloud.status=navigator.onLine?'error':'offline';
    return false;
  }
};

const pushSharedStateV094Base = pushSharedState;
pushSharedState = async function(activeOverride){
  const actualStudentRun = state.mode==='student' && !state.demo && !state.supervisorMode && state.runMode==='learn';
  const running = Boolean(state.cloud.tracker?.running);
  const finalClear = actualStudentRun && activeOverride===null;
  if(!(actualStudentRun && running) && !finalClear) return false;
  return pushSharedStateV094Base(activeOverride);
};

activeSessionIsFresh = function(s){
  return Boolean(s?.updatedAt && Date.now()-new Date(s.updatedAt).getTime()<2*60*60*1000);
};

/* Diagnostic writes are temporary and remove their marker after read-back. */
runCloudDiagnostic = async function(){
  const startedAt=Date.now(); const rows=[]; const add=(name,ok,detail)=>rows.push({name,ok,detail});
  try{
    await waitForCloud(6000);
    add('Firebase SDK',Boolean(state.cloud.api&&state.cloud.db),state.cloud.api?'로드 완료':'로드 실패');
    add('익명 인증',Boolean(state.cloud.auth?.currentUser),state.cloud.auth?.currentUser?'인증 완료':'인증되지 않음');
    if(!state.cloud.ready||!state.cloud.db||!state.cloud.api) throw new Error(state.cloud.error||'Firebase 연결이 준비되지 않았습니다.');
    const {doc,setDoc,getDoc,deleteDoc,updateDoc,deleteField}=state.cloud.api;
    const token=`diag-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const stateRef=doc(state.cloud.db,CLOUD_COLLECTION,CLOUD_STATE_DOC);
    await setDoc(stateRef,{diagnostic:{token,version:CLOUD_DIAGNOSTIC_VERSION,at:new Date().toISOString(),device:deviceInfo()}},{merge:true});
    const stateSnap=await getDoc(stateRef);
    const stateOk=stateSnap.exists()&&stateSnap.data()?.diagnostic?.token===token;
    add('진도 문서 읽기·쓰기',stateOk,stateOk?'chunilmun1001/state 정상':'쓰기 후 읽기 검증 실패');
    try{ if(updateDoc&&deleteField) await updateDoc(stateRef,{diagnostic:deleteField()}); }catch(cleanErr){ console.warn('[Chunilmun cloud] diagnostic cleanup failed',cleanErr); }
    const diagId=`_diag_${Date.now()}`; const sessionRef=doc(state.cloud.db,CLOUD_SESSION_COLLECTION,diagId);
    await setDoc(sessionRef,{diagnostic:true,token,date:new Date().toISOString(),device:deviceInfo()});
    const sessionSnap=await getDoc(sessionRef); const sessionOk=sessionSnap.exists()&&sessionSnap.data()?.token===token;
    add('세션 문서 읽기·쓰기',sessionOk,sessionOk?'chunilmun1001_sessions 정상':'세션 검증 실패');
    try{await deleteDoc(sessionRef);}catch{}
    const allOk=rows.every(r=>r.ok); state.cloud.status=allOk?'online':'error';
    state.cloud.lastDiagnostic={ok:allOk,rows,at:new Date().toISOString(),elapsedMs:Date.now()-startedAt};
    return state.cloud.lastDiagnostic;
  }catch(err){
    add('Firestore 규칙',false,String(err?.message||err)); state.cloud.status=navigator.onLine?'error':'offline';
    state.cloud.lastDiagnostic={ok:false,rows,at:new Date().toISOString(),elapsedMs:Date.now()-startedAt,error:String(err?.message||err)};
    return state.cloud.lastDiagnostic;
  }
};

/* Student/admin Unit navigation: show one chapter at a time, four units at most. */
state.catalogChapterFilter = null;
renderUnitCatalogV093b = function(){
  if(!state.catalog) return '<div class="multiunit-loading">단원 목록 불러오는 중…</div>';
  const chapters=state.catalog.chapters||[]; const currentUnit=Number(state.unit?.meta?.unit||1); const currentChapter=Number(state.unit?.meta?.chapter||1);
  const selected=Number(state.catalogChapterFilter||currentChapter); const chapter=chapters.find(ch=>Number(ch.chapter)===selected)||chapters[0];
  const tabs=`<div class="chapter-filter-tabs">${chapters.map(ch=>`<button type="button" class="chapter-filter-btn${Number(ch.chapter)===Number(chapter?.chapter)?' active':''}" data-chapter-filter="${ch.chapter}">CH ${String(ch.chapter).padStart(2,'0')}</button>`).join('')}</div>`;
  if(!chapter) return tabs;
  const chips=(chapter.units||[]).map(u=>`<button class="unit-chip${Number(u.unit)===currentUnit?' active':''}" data-unit="${u.unit}" type="button"><span>${unitNoLabel(u.unit)}</span><b>${escapeHtml(u.title)}</b></button>`).join('');
  return `${tabs}<div class="chapter-unit-group selected-chapter"><div class="chapter-unit-title"><span>CHAPTER ${String(chapter.chapter).padStart(2,'0')}</span><b>${escapeHtml(chapter.title)}</b></div><div class="unit-chip-grid">${chips}</div></div>`;
};

bindUnitCatalogButtonsV093b = function(container,afterSelect){
  container?.querySelectorAll('[data-chapter-filter]').forEach(btn=>{btn.onclick=()=>{state.catalogChapterFilter=Number(btn.dataset.chapterFilter);afterSelect();};});
  container?.querySelectorAll('[data-unit]').forEach(btn=>{btn.onclick=async()=>{btn.disabled=true;try{await selectUnitV093b(Number(btn.dataset.unit));state.catalogChapterFilter=Number(state.unit?.meta?.chapter||state.catalogChapterFilter);afterSelect();}catch(err){console.error(err);showToast('단원 데이터를 불러오지 못했습니다.');btn.disabled=false;}};});
};

/* Growth comparisons: only compare the same Unit. */
const sessionMetricsV094Base=sessionMetrics;
sessionMetrics=function(results=[]){
  const metrics=sessionMetricsV094Base(results); const id=(results||[]).find(r=>/^U\d{2}-/.test(String(r?.id||'')))?.id||''; const m=String(id).match(/^U(\d{2})-/); metrics.unit=m?Number(m[1]):null; return metrics;
};
const comparableDeltaV094Base=comparableDelta;
comparableDelta=function(current,previous,key,nKey){
  if(previous&&current?.unit&&previous?.unit&&current.unit!==previous.unit) return null;
  return comparableDeltaV094Base(current,previous,key,nKey);
};
latestLearningSnapshot=function(){
  const unitNo=Number(state.unit?.meta?.unit||1); const last=[...learningHistory()].reverse().find(s=>Number(s?.unit)===unitNo); if(!last?.results?.length)return '';
  const m=sessionMetrics(last.results); const parts=[]; if(m.structure!=null)parts.push(`구조 ${m.structure}%`); if(m.independent!=null)parts.push(`직접 해결 ${m.independent}%`); if(m.reviewN)parts.push(`복습 ${m.reviewCorrect}/${m.reviewN}`);
  return parts.length?`<div class="latest-snapshot">최근 ${escapeHtml(unitNoLabel(unitNo))} 학습 · <b>${parts.join(' · ')}</b></div>`:'';
};

const renderCloudAdminV094Base=renderCloudAdmin;
renderCloudAdmin=function(){
  renderCloudAdminV094Base(); const label=unitNoLabel(state.unit?.meta?.unit||1);
  document.querySelectorAll('.cloud-metrics > div').forEach(box=>{const span=box.querySelector('span');if(span?.textContent?.includes('Unit 01 진도'))span.textContent=`${label} 진도`;});
};
