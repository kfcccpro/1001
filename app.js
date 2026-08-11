const app = document.getElementById('app');
const toast = document.getElementById('toast');
const memoryLock = document.getElementById('memoryLock');
const memoryRule = document.getElementById('memoryRule');
const memoryRecall = document.getElementById('memoryRecall');
const memoryContinue = document.getElementById('memoryContinue');

const STORAGE = {
  history: 'chunilmun_history_v03',
  due: 'chunilmun_due_v03',
  last: 'chunilmun_last_session_v03'
};

const state = {
  mode: null,
  step: 0,
  flow: [],
  score: 0,
  attempts: 0,
  corrected: 0,
  noHelpLongest: 0,
  hints: 0,
  masteredKeys: new Set(),
  beforeResult: null,
  afterResult: null,
  sessionStartedAt: null
};

const ITEMS = {
  before: {
    type: 'choice', stage: 'START CHECK', item: 'BEFORE', sourceType: 'pfal_generated', key: 'what-clause-agreement',
    prompt: '어법상 알맞은 것을 고르세요.',
    sentence: 'What makes a long sentence difficult ___ often not vocabulary but its hidden structure.',
    choices: ['is', 'are'], answer: 'is', track: 'before',
    rule: 'what절 전체 → <span class="pulse">하나의 주어</span>',
    recall: { q: 'what절 전체가 주어일 때 어떻게 봅니까?', choices: ['하나의 주어', '수식어'], answer: '하나의 주어' }
  },
  q01Subject: {
    type: 'span', stage: 'CORE', item: 'Q01', sourceType: 'publisher', key: 'q01-subject',
    prompt: '첫 번째 was의 주어 범위를 드래그하세요.', role: 'S',
    sentence: 'In 2015, the number of Chinese people mostly buying Korean cosmetics brands was greater than that of Chinese people mostly buying Chinese brands, and “Good word of mouth” was the biggest decision factor for those who purchased Korean brands.',
    answer: 'the number of Chinese people mostly buying Korean cosmetics brands',
    accepted: [
      'the number of Chinese people mostly buying Korean cosmetics brands',
      'the number of Chinese people'
    ],
    hint: '첫 번째 was 앞에서 무엇이 더 컸는지 찾습니다. 핵심은 the number입니다.',
    rule: 'the number of + 복수명사 → 핵심은 <span class="pulse">number</span>',
    recall: { q: 'the number of people의 수를 결정하는 핵심어는?', choices: ['number', 'people'], answer: 'number' }
  },
  q01Modifier: {
    type: 'span', stage: 'CORE', item: 'Q01', sourceType: 'publisher', key: 'q01-modifier',
    prompt: 'people을 꾸미는 현재분사 수식어구를 드래그하세요.', role: 'MOD',
    sentence: 'In 2015, the number of Chinese people mostly buying Korean cosmetics brands was greater than that of Chinese people mostly buying Chinese brands.',
    answer: 'mostly buying Korean cosmetics brands',
    hint: 'people 뒤에서 “어떤 사람들인가”를 덧붙이는 부분만 묶어 보세요.'
  },
  q02Choice: {
    type: 'choice', stage: 'CORE', item: 'Q02', sourceType: 'publisher', key: 'q02-agreement',
    prompt: '어법상 알맞은 것을 고르세요.',
    sentence: 'Purchasing local produce not only ___ the local economy, but it also helps you save money on food and get high-quality fruits and vegetables.',
    choices: ['improve', 'improves'], answer: 'improves',
    rule: '동명사구 주어 → <span class="pulse">단수 취급</span>',
    recall: { q: '동명사구가 주어일 때 동사는?', choices: ['단수', '복수'], answer: '단수' }
  },
  q02Subject: {
    type: 'span', stage: 'CORE', item: 'Q02', sourceType: 'publisher', key: 'q02-subject',
    prompt: '이 문장의 첫 번째 주어를 드래그하세요.', role: 'S',
    sentence: 'Purchasing local produce not only improves the local economy, but it also helps you save money on food and get high-quality fruits and vegetables.',
    answer: 'Purchasing local produce',
    hint: 'improves 앞에서 “무엇이 개선하는가”를 하나의 행동 덩어리로 찾으세요.'
  },
  q03Subject1: {
    type: 'span', stage: 'CORE', item: 'Q03', sourceType: 'publisher', key: 'q03-subject-1',
    prompt: '세미콜론 앞 절의 주어를 드래그하세요.', role: 'S',
    sentence: 'Europe’s first Homo Sapiens lived primarily on large game, particularly reindeer; however, even under ideal circumstances, to hunt these fast animals only with spear or bow and arrow was an uncertain task for them.',
    answer: 'Europe’s first Homo Sapiens',
    hint: '첫 번째 동사 lived의 앞에서 주어를 찾으세요.'
  },
  q03Subject2: {
    type: 'span', stage: 'CORE', item: 'Q03', sourceType: 'publisher', key: 'q03-subject-2',
    prompt: 'was의 주어가 되는 to부정사구 전체를 드래그하세요.', role: 'S',
    sentence: 'Even under ideal circumstances, to hunt these fast animals only with spear or bow and arrow was an uncertain task for them.',
    answer: 'to hunt these fast animals only with spear or bow and arrow',
    hint: '문장 앞의 부사구는 잠시 제외하고, was 앞의 행동 덩어리를 찾으세요.',
    rule: 'to부정사구 주어 → <span class="pulse">하나의 행위</span>',
    recall: { q: 'to부정사구 전체가 주어이면?', choices: ['하나의 행위', '복수 주어'], answer: '하나의 행위' }
  },
  q04Subject: {
    type: 'span', stage: 'STRUCTURE', item: 'Q04', sourceType: 'publisher', key: 'q04-subject',
    prompt: '첫 문장의 주어 범위를 드래그하세요.', role: 'S',
    sentence: 'That legalizing euthanasia is a thorny issue is a well-known fact: Is it a right to die with dignity or a crime that violates the dignity of human life?',
    answer: 'That legalizing euthanasia is a thorny issue',
    hint: '문장 전체의 본동사는 두 번째 is입니다. 그 앞의 that절 전체를 묶어 보세요.',
    rule: 'that절 전체 → <span class="pulse">하나의 주어</span>',
    recall: { q: 'that절 전체가 주어일 때?', choices: ['하나의 주어', '부사구'], answer: '하나의 주어' }
  },
  q05Subject: {
    type: 'span', stage: 'STRUCTURE', item: 'Q05', sourceType: 'publisher', key: 'q05-subject',
    prompt: '문장 전체의 주어가 되는 what절을 드래그하세요.', role: 'S',
    sentence: 'What distinguishes humans from animals is that the former make tools and, as civilization progresses, these tools gradually turn into machines.',
    answer: 'What distinguishes humans from animals',
    hint: '문장 전체의 본동사 is를 먼저 찾고, 그 앞의 명사절을 하나로 묶으세요.'
  },
  q06Subject: {
    type: 'span', stage: 'STRUCTURE', item: 'Q06', sourceType: 'publisher', key: 'q06-subject',
    prompt: 'is not clear의 주어 범위를 드래그하세요.', role: 'S',
    sentence: 'Although humans have been drinking coffee for centuries, where coffee originated or who first discovered it is not clear.',
    answer: 'where coffee originated or who first discovered it',
    hint: 'Although절은 잠시 제외하고, 두 의문사절이 or로 연결된 전체 범위를 찾으세요.',
    rule: '의문사절 + or + 의문사절 → <span class="pulse">하나의 주어 덩어리</span>',
    recall: { q: '여기서 or가 연결하는 것은?', choices: ['두 의문사절', '두 동사'], answer: '두 의문사절' }
  },
  q07Subject: {
    type: 'span', stage: 'INTEGRATION', item: 'Q07', sourceType: 'publisher', key: 'q07-subject',
    prompt: '문장 전체의 주어를 드래그하세요.', role: 'S',
    sentence: 'Whoever has a high sense of self-efficiency tends to pursue challenging goals and may be more willing to step outside the culturally prescribed behaviors to attempt tasks or goals for which success is viewed as improbable by the majority of people in a setting.',
    answer: 'Whoever has a high sense of self-efficiency',
    hint: '첫 번째 본동사 tends 앞의 복합관계대명사절 전체를 묶으세요.'
  },
  q07Parallel: {
    type: 'pairSpan', stage: 'INTEGRATION', item: 'Q07', sourceType: 'publisher', key: 'q07-parallel',
    prompt: 'and가 연결하는 두 술어의 중심을 차례로 드래그하세요.', role: 'PAR',
    sentence: 'Whoever has a high sense of self-efficiency tends to pursue challenging goals and may be more willing to step outside the culturally prescribed behaviors.',
    answers: ['tends', 'may be'],
    hint: '주어 뒤에서 첫 번째 술어 중심과 and 뒤의 두 번째 술어 중심을 찾으세요.',
    rule: 'tends … and may be … → <span class="pulse">병렬 술어</span>',
    recall: { q: 'and가 여기서 연결하는 것은?', choices: ['두 술어', '두 주어'], answer: '두 술어' }
  },
  q07Relative: {
    type: 'span', stage: 'INTEGRATION', item: 'Q07', sourceType: 'publisher', key: 'q07-relative',
    prompt: 'tasks or goals를 꾸미는 관계사절을 드래그하세요.', role: 'CLAUSE',
    sentence: 'Whoever has a high sense of self-efficiency tends to pursue challenging goals and may be more willing to step outside the culturally prescribed behaviors to attempt tasks or goals for which success is viewed as improbable by the majority of people in a setting.',
    answer: 'for which success is viewed as improbable by the majority of people in a setting',
    hint: 'tasks or goals 바로 뒤의 for which부터 문장 끝까지 묶으세요.'
  },
  transfer: {
    type: 'span', stage: 'TRANSFER', item: 'PFAL T01', sourceType: 'pfal_generated', key: 'transfer-gerund',
    prompt: '새 문장입니다. 주어를 드래그하세요.', role: 'S',
    sentence: 'Reading difficult texts every day improves your ability to see sentence structure.',
    answer: 'Reading difficult texts every day',
    hint: 'improves 앞의 하나의 행동 덩어리를 찾으세요.'
  },
  after: {
    type: 'choice', stage: 'FINAL CHALLENGE', item: 'AFTER', sourceType: 'pfal_generated', key: 'what-clause-agreement',
    prompt: '처음과 같은 원리입니다. 어법상 알맞은 것을 고르세요.',
    sentence: 'What matters most when a sentence becomes long ___ finding its main structure first.',
    choices: ['is', 'are'], answer: 'is', track: 'after'
  }
};

const BASE_FLOW = [
  ITEMS.before,
  ITEMS.q01Subject,
  ITEMS.q01Modifier,
  ITEMS.q02Choice,
  ITEMS.q02Subject,
  ITEMS.q03Subject1,
  ITEMS.q03Subject2,
  { type: 'break', stage: 'RESET' },
  ITEMS.q04Subject,
  ITEMS.q05Subject,
  ITEMS.q06Subject,
  { type: 'break', stage: 'RESET' },
  ITEMS.q07Subject,
  ITEMS.q07Parallel,
  ITEMS.q07Relative,
  ITEMS.transfer,
  ITEMS.after,
  { type: 'report' }
];

const REVIEW_REGISTRY = {
  'q02-subject': ITEMS.q02Subject,
  'q04-subject': ITEMS.q04Subject,
  'q06-subject': ITEMS.q06Subject,
  'q07-subject': ITEMS.q07Subject,
  'q07-parallel': ITEMS.q07Parallel,
  'q07-relative': ITEMS.q07Relative,
  'what-clause-agreement': ITEMS.after
};

const normalize = s => s.replace(/[‘’“”]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
const clone = obj => JSON.parse(JSON.stringify(obj));
function todayKR(){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1000)}
function loadJSON(key, fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}}
function uniqueDayCount(days=7){
  const history=loadJSON(STORAGE.history,[]); const min=Date.now()-(days-1)*86400000;
  return new Set(history.filter(x=>new Date(x.date).getTime()>=min).map(x=>x.date.slice(0,10))).size;
}
function dueRecords(){return loadJSON(STORAGE.due,[]).filter(x=>!x.completed && x.dueAt<=Date.now()).sort((a,b)=>a.dueAt-b.dueAt)}
function dueCount(){return dueRecords().length}
function markDueDone(id){
  if(!id)return;
  const due=loadJSON(STORAGE.due,[]); const hit=due.find(x=>x.id===id); if(hit)hit.completed=true;
  localStorage.setItem(STORAGE.due,JSON.stringify(due.slice(-120)));
}
function scheduleMastered(){
  const due=loadJSON(STORAGE.due,[]); const now=Date.now();
  [...state.masteredKeys].filter(key=>REVIEW_REGISTRY[key]).forEach(key=>{
    [1,3,7].forEach(interval=>{
      const exists=due.some(x=>x.key===key && x.interval===interval && !x.completed && x.dueAt>now-3600000);
      if(!exists) due.push({id:`${key}-${interval}-${now}`,key,interval,dueAt:now+interval*86400000,completed:false});
    });
  });
  localStorage.setItem(STORAGE.due,JSON.stringify(due.slice(-120)));
}
function saveSession(){
  scheduleMastered();
  const payload={
    date:new Date().toISOString(), score:state.score, attempts:state.attempts, corrected:state.corrected,
    longest:state.noHelpLongest, hints:state.hints, before:state.beforeResult, after:state.afterResult, completed:true
  };
  localStorage.setItem(STORAGE.last,JSON.stringify(payload));
  const history=loadJSON(STORAGE.history,[]); history.push(payload);
  localStorage.setItem(STORAGE.history,JSON.stringify(history.slice(-60)));
}
function weekDots(){
  const h=loadJSON(STORAGE.history,[]); const days=new Set(h.map(x=>x.date.slice(0,10))); const out=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const iso=d.toISOString().slice(0,10);out.push(`<span class="day-dot ${days.has(iso)?'done':''}"></span>`)}
  return out.join('');
}
function buildFlow(){
  const reviews=dueRecords().slice(0,3).map(r=>{
    const q=clone(REVIEW_REGISTRY[r.key]);
    q.stage=`D+${r.interval} RECALL`; q.item='REVIEW'; q.reviewDueId=r.id; q.isReview=true;
    return q;
  });
  return reviews.length ? [...reviews,{type:'reviewDivider'},...BASE_FLOW] : [...BASE_FLOW];
}
function resetSession(){
  state.step=0; state.score=0; state.attempts=0; state.corrected=0; state.hints=0; state.noHelpLongest=0;
  state.masteredKeys=new Set(); state.beforeResult=null; state.afterResult=null; state.sessionStartedAt=Date.now(); state.flow=buildFlow();
}

function renderLogin(){
  app.innerHTML=`<section class="screen"><div class="center"><div class="login-card">
    <div class="brand">CHUNILMUN · PFAL</div><h1>오늘도 한 문장씩<br>구조를 분명하게.</h1>
    <p class="lead">PIN만 입력하면 바로 이어집니다.</p>
    <div class="pin-row"><input id="pin" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN"><button class="primary" id="loginBtn">시작</button></div>
  </div></div></section>`;
  const pin=document.getElementById('pin');
  document.getElementById('loginBtn').onclick=()=>login(pin.value);
  pin.addEventListener('keydown',e=>{if(e.key==='Enter')login(pin.value)}); pin.focus();
}
function login(pin){
  if(pin==='8081'){state.mode='student';renderHome();}
  else if(pin==='2007'){state.mode='admin';renderAdmin();}
  else showToast('PIN을 확인하세요.');
}
function renderHome(){
  const days=uniqueDayCount(); const due=dueCount();
  app.innerHTML=`<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘의 학습</div></div><div class="daily-badge">최근 7일 ${days}일</div></div>
    <p class="lead">매일 조금씩. <b>다시 꺼내고 → 구조로 확인하고 → 며칠 뒤 다시 기억합니다.</b></p>
    <div class="week-strip" aria-label="최근 7일 학습">${weekDots()}</div>
    <div class="schedule"><div class="schedule-step today">회상</div><div class="schedule-step">핵심</div><div class="schedule-step">구조</div><div class="schedule-step">전이</div><div class="schedule-step">성장</div></div>
    <div class="home-metrics"><div class="metric"><strong>${due}</strong><span>오늘 다시 꺼낼 것</span></div><div class="metric"><strong>U01</strong><span>주어의 형태</span></div><div class="metric"><strong>매일</strong><span>시간보다 반복</span></div></div>
    <div class="action-row"><button class="primary" id="start">오늘 학습 시작</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick=()=>{resetSession();renderFlow();};
  document.getElementById('logout').onclick=renderLogin;
}
function progressInfo(){
  const learning=state.flow.filter(x=>!['break','report','reviewDivider'].includes(x.type));
  const current=state.flow.slice(0,state.step+1).filter(x=>!['break','report','reviewDivider'].includes(x.type)).length;
  return {current:Math.min(current,learning.length),total:learning.length};
}
function topbar(stage,item){
  const p=progressInfo();
  return `<div class="topbar"><div>${stage}${item?` · ${item}`:''}</div><div class="quiet-progress">${p.current} / ${p.total}</div></div>`;
}
function renderFlow(){
  const q=state.flow[state.step]; if(!q){renderHome();return;}
  if(q.type==='choice') return renderChoice(q);
  if(q.type==='span') return renderSpan(q);
  if(q.type==='pairSpan') return renderPairSpan(q);
  if(q.type==='break') return renderBreak();
  if(q.type==='reviewDivider') return renderReviewDivider();
  if(q.type==='report') return renderReport();
}
function recordSuccess(q, firstTry=true){
  state.score++;
  if(q.key)state.masteredKeys.add(q.key);
  if(q.reviewDueId)markDueDone(q.reviewDueId);
  if(q.track==='before')state.beforeResult={correct:true,firstTry};
  if(q.track==='after')state.afterResult={correct:true,firstTry};
}
function recordFailure(q){
  state.corrected++;
  if(q.track==='before' && !state.beforeResult)state.beforeResult={correct:false,firstTry:false};
  if(q.track==='after' && !state.afterResult)state.afterResult={correct:false,firstTry:false};
}
function renderChoice(q){
  let failed=false;
  app.innerHTML=`<section class="screen">${topbar(q.stage,q.item)}<div class="learning-area"><div class="question-wrap">
    <div class="sentence">${q.sentence}</div><div class="prompt">${q.prompt}</div>
    <div class="choices">${q.choices.map(c=>`<button class="choice" data-choice="${c}">${c}</button>`).join('')}</div><div class="hint" id="hint"></div>
  </div></div></section>`;
  document.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>{
    state.attempts++;
    const correct=btn.dataset.choice===q.answer;
    btn.classList.add(correct?'correct':'wrong');
    document.querySelectorAll('.choice').forEach(b=>b.disabled=true);
    if(correct){
      recordSuccess(q,!failed); showToast(q.isReview?'기억했습니다.':'정확합니다.');
      setTimeout(()=>openMemory(q,()=>next()),520);
    } else {
      failed=true; recordFailure(q); document.getElementById('hint').textContent='주어의 형태와 범위를 먼저 확인해 보세요.';
      setTimeout(()=>openMemory(q,()=>{document.querySelectorAll('.choice').forEach(b=>{b.disabled=false;b.classList.remove('wrong')});}),650);
    }
  });
}
function tokenise(sentence){
  return sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)?|\d+(?:,\d+)*|[^\sA-Za-z\d]/g)||[];
}
function renderTokenSentence(tokens){
  return tokens.map((t,i)=>`<span class="token" data-i="${i}">${t}</span>${/^[,.;:!?]$/.test(t)?'':' '}`).join('');
}
function selectedText(tokens,a,b){return tokens.slice(Math.min(a,b),Math.max(a,b)+1).join(' ').replace(/\s+([,.;:!?])/g,'$1')}
function acceptedSpan(q,text){return (q.accepted||[q.answer]).some(a=>normalize(a)===normalize(text))}
function attachDrag(el,spans,onChange){
  let dragging=false,start=-1,end=-1;
  const paint=()=>{spans.forEach((s,i)=>s.classList.toggle('selected',start>=0&&i>=Math.min(start,end)&&i<=Math.max(start,end)));onChange(start,end)};
  const indexFromPoint=(x,y)=>{const p=document.elementFromPoint(x,y);return p?.classList?.contains('token')?Number(p.dataset.i):null};
  spans.forEach(s=>s.addEventListener('pointerdown',e=>{e.preventDefault();dragging=true;start=end=Number(s.dataset.i);paint()}));
  el.addEventListener('pointermove',e=>{if(!dragging)return;const idx=indexFromPoint(e.clientX,e.clientY);if(idx!=null){e.preventDefault();end=idx;paint()}});
  const finish=()=>{dragging=false}; el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);
  return {get:()=>[start,end],reset:()=>{start=end=-1;paint()}};
}
function roleClass(role){return role==='MOD'?'modifier-span':role==='CLAUSE'?'clause-span':role==='PAR'?'parallel-span':'correct-span'}
function renderSpan(q){
  const tokens=tokenise(q.sentence); let failed=false; let range=[-1,-1];
  app.innerHTML=`<section class="screen">${topbar(q.stage,q.item)}<div class="learning-area"><div class="question-wrap">
    <div id="tokenSentence" class="token-sentence">${renderTokenSentence(tokens)}</div>
    <div class="prompt">${q.prompt}</div><div class="structure-label"><button class="role-button role-${q.role.toLowerCase()}" id="role">${q.role}</button></div><div class="feedback-line" id="feedback"></div>
  </div></div></section>`;
  const el=document.getElementById('tokenSentence'); const spans=[...el.querySelectorAll('.token')];
  const drag=attachDrag(el,spans,(a,b)=>range=[a,b]);
  document.getElementById('role').onclick=()=>{
    if(range[0]<0)return showToast('먼저 문장을 드래그하세요.');
    state.attempts++;
    const text=selectedText(tokens,...range); const correct=acceptedSpan(q,text);
    if(correct){
      recordSuccess(q,!failed); const count=text.split(/\s+/).length; state.noHelpLongest=Math.max(state.noHelpLongest,count);
      spans.forEach((s,i)=>{if(i>=Math.min(...range)&&i<=Math.max(...range)){s.classList.remove('selected');s.classList.add(roleClass(q.role))}});
      document.getElementById('feedback').textContent=q.isReview?'기억에서 다시 꺼냈습니다.':'구조가 정확합니다.';
      setTimeout(()=>openMemory(q,()=>next()),720);
    } else {
      failed=true; recordFailure(q); state.hints++; document.getElementById('feedback').textContent=q.hint;
      const selected=spans.filter((_,i)=>i>=Math.min(...range)&&i<=Math.max(...range)); selected.forEach(s=>{s.classList.remove('selected');s.classList.add('faded')});
      setTimeout(()=>selected.forEach(s=>s.classList.remove('faded')),720); drag.reset();
    }
  };
}
function renderPairSpan(q){
  const tokens=tokenise(q.sentence); let range=[-1,-1],failed=false; const saved=[];
  app.innerHTML=`<section class="screen">${topbar(q.stage,q.item)}<div class="learning-area"><div class="question-wrap">
    <div id="tokenSentence" class="token-sentence">${renderTokenSentence(tokens)}</div>
    <div class="prompt">${q.prompt}</div>
    <div class="pair-status"><span class="pair-chip active" id="pair1">1</span><span class="pair-line"></span><span class="pair-chip" id="pair2">2</span></div>
    <div class="structure-label"><button class="role-button role-par" id="savePair">첫 술어 저장</button></div><div class="feedback-line" id="feedback"></div>
  </div></div></section>`;
  const el=document.getElementById('tokenSentence'); const spans=[...el.querySelectorAll('.token')];
  const drag=attachDrag(el,spans,(a,b)=>range=[a,b]);
  document.getElementById('savePair').onclick=()=>{
    if(range[0]<0)return showToast('먼저 술어를 드래그하세요.');
    const text=selectedText(tokens,...range); saved.push({text,range:[...range]});
    spans.forEach((s,i)=>{if(i>=Math.min(...range)&&i<=Math.max(...range)){s.classList.remove('selected');s.classList.add('pair-saved')}});
    drag.reset();
    if(saved.length===1){document.getElementById('pair1').classList.remove('active');document.getElementById('pair1').classList.add('done');document.getElementById('pair2').classList.add('active');document.getElementById('savePair').textContent='둘째 술어 저장';return;}
    state.attempts++;
    const got=saved.map(x=>normalize(x.text)); const expected=q.answers.map(normalize);
    const correct=expected.every(x=>got.includes(x)) && got.length===2;
    if(correct){
      recordSuccess(q,!failed); document.getElementById('pair2').classList.remove('active');document.getElementById('pair2').classList.add('done');
      spans.forEach(s=>{if(s.classList.contains('pair-saved')){s.classList.remove('pair-saved');s.classList.add('parallel-span')}});
      document.getElementById('feedback').textContent='두 술어가 병렬로 연결됩니다.';setTimeout(()=>openMemory(q,()=>next()),760);
    } else {
      failed=true;recordFailure(q);state.hints++;document.getElementById('feedback').textContent=q.hint;
      setTimeout(()=>renderPairSpan(q),950);
    }
  };
}
function openMemory(q,done){
  if(!q.rule){done();return;}
  memoryRule.innerHTML=q.rule; memoryRecall.classList.add('hidden'); memoryContinue.classList.add('hidden'); memoryLock.classList.add('show');memoryLock.setAttribute('aria-hidden','false');
  setTimeout(()=>{
    if(q.recall){
      memoryRecall.innerHTML=`<div>${q.recall.q}</div><div class="choices">${q.recall.choices.map(c=>`<button class="choice memory-choice" data-c="${c}">${c}</button>`).join('')}</div>`;memoryRecall.classList.remove('hidden');
      document.querySelectorAll('.memory-choice').forEach(b=>b.onclick=()=>{
        if(b.dataset.c===q.recall.answer){b.classList.add('correct');memoryContinue.classList.remove('hidden')}
        else b.classList.add('wrong');
      });
    } else memoryContinue.classList.remove('hidden');
  },1200);
  memoryContinue.onclick=()=>{memoryLock.classList.remove('show');memoryLock.setAttribute('aria-hidden','true');memoryRule.innerHTML='';memoryRecall.innerHTML='';done();};
}
function renderBreak(){
  app.innerHTML=`<section class="screen">${topbar('RESET','')}<div class="center"><div class="break-card"><div class="break-ring">RESET</div><h2>한 블록 완료.</h2><p>잠깐 화면에서 눈을 떼고, 준비되면 다음 문장으로 갑니다.</p><button class="primary" id="resume">계속</button></div></div></section>`;
  document.getElementById('resume').onclick=next;
}
function renderReviewDivider(){
  app.innerHTML=`<section class="screen">${topbar('RECALL COMPLETE','')}<div class="center"><div class="break-card"><div class="break-ring">✓</div><h2>오늘의 복습 완료.</h2><p>이제 새 학습으로 이어갑니다.</p><button class="primary" id="resume">계속</button></div></div></section>`;
  document.getElementById('resume').onclick=next;
}
function next(){state.step++;renderFlow()}
function radarSVG(before,after){
  const labels=['개념 인출','구조 분석','규칙 적용','정답 생성','오류 교정','유형 전이'];
  const cx=160,cy=150,R=110;
  const pts=arr=>arr.map((v,i)=>{const a=-Math.PI/2+i*Math.PI/3;const r=R*(v/100);return `${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`}).join(' ');
  const axes=labels.map((l,i)=>{const a=-Math.PI/2+i*Math.PI/3;const x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;const tx=cx+Math.cos(a)*(R+24),ty=cy+Math.sin(a)*(R+24);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#dfe2df"/><text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#727773">${l}</text>`}).join('');
  return `<svg class="radar" viewBox="0 0 320 300" role="img" aria-label="학습 전후 6축 변화"><polygon points="${[0,1,2,3,4,5].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/3;return `${cx+Math.cos(a)*R},${cy+Math.sin(a)*R}`}).join(' ')}" fill="none" stroke="#e0e3e0"/>${axes}<polygon points="${pts(before)}" fill="rgba(120,125,122,.06)" stroke="#9da29e" stroke-width="1.5"/><polygon points="${pts(after)}" fill="rgba(49,93,82,.13)" stroke="#315d52" stroke-width="2.5"/></svg>`;
}
function sessionProfiles(){
  const correctionBoost=Math.min(12,state.corrected*2); const accuracy=state.attempts?state.score/state.attempts:0;
  const afterSuccess=state.afterResult?.correct?10:0; const beforeMiss=state.beforeResult?.correct?0:4;
  const before=[42,38,55,46,51,35];
  const after=[Math.min(100,42+6+afterSuccess),Math.min(100,38+10+Math.round(accuracy*10)),Math.min(100,55+7),Math.min(100,46+5+afterSuccess),Math.min(100,51+correctionBoost),Math.min(100,35+8+beforeMiss+afterSuccess)];
  return {before,after};
}
function renderReport(){
  saveSession(); const p=sessionProfiles(); const beforeMiss=state.beforeResult && !state.beforeResult.correct; const afterOk=state.afterResult?.correct;
  const changeText=beforeMiss&&afterOk?'시작 때 놓친 원리를 마지막에는 스스로 적용했습니다.':'오늘 배운 구조를 마지막 문제까지 연결했습니다.';
  app.innerHTML=`<section class="screen"><div class="center"><div class="report-card"><div class="date-label">오늘의 변화</div><h1>${changeText}</h1>
    <div class="report-grid"><div class="radar-card">${radarSVG(p.before,p.after)}<div class="micro-note">회색: 시작 · 진한 선: 학습 후</div></div>
    <div class="growth-card"><div class="growth-list">
      <div class="growth-item"><span>오늘 구조화</span><strong>${state.score}개 성공</strong></div>
      <div class="growth-item"><span>스스로 수정</span><strong>${state.corrected}회</strong></div>
      <div class="growth-item"><span>가장 긴 무도움 범위</span><strong>${state.noHelpLongest || 0}단어</strong></div>
      <div class="growth-item"><span>Before → After</span><strong>${beforeMiss&&afterOk?'<span class="delta">회복 성공</span>':afterOk?'유지 성공':'다음 회상에서 재도전'}</strong></div>
      <div class="growth-item"><span>다음 기억</span><strong>D+1 · D+3 · D+7</strong></div>
    </div></div></div>
    <p class="lead" style="margin-top:28px">오늘은 <b>긴 주어에서 수식어를 걷어내고, 명사절·to부정사구·복합관계사절을 하나의 주어 덩어리로 보는 연습</b>을 했습니다.</p>
    <div class="action-row"><button class="primary" id="home">완료</button></div>
  </div></div></section>`;
  document.getElementById('home').onclick=renderHome;
}
function renderAdmin(){
  const history=loadJSON(STORAGE.history,[]); const last=history.at(-1);
  app.innerHTML=`<section class="screen"><div class="center"><div class="home-card"><div class="brand">ADMIN · 2007</div><h1>학습 관찰</h1><p class="lead">학생 화면에는 학습만 남기고, 반복·회상·교정은 여기에서 확인합니다.</p>
  <div class="home-metrics"><div class="metric"><strong>${uniqueDayCount()}</strong><span>최근 7일 학습일</span></div><div class="metric"><strong>${dueCount()}</strong><span>오늘 회상 예정</span></div><div class="metric"><strong>${last?.corrected||0}</strong><span>최근 자기교정</span></div></div>
  <div class="admin-table"><div class="admin-row"><b>관찰 항목</b><b>현재</b><b>다음</b></div><div class="admin-row"><span>SUBJECT_BOUNDARY</span><b>U01 훈련</b><span>D+1/3/7</span></div><div class="admin-row"><span>MODIFIER_SCOPE</span><b>Q01</b><span>장문 전이</span></div><div class="admin-row"><span>PARALLEL_PREDICATE</span><b>Q07</b><span>혼합 전이</span></div></div>
  <div class="action-row" style="margin-top:28px"><button class="primary" id="student">학생 화면</button><button class="secondary" id="logout">PIN 화면</button></div></div></div></section>`;
  document.getElementById('student').onclick=()=>{state.mode='student';renderHome()}; document.getElementById('logout').onclick=renderLogin;
}

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{})}
renderLogin();
