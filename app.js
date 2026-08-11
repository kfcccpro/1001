const app = document.getElementById('app');
const toast = document.getElementById('toast');
const memoryLock = document.getElementById('memoryLock');
const memoryRule = document.getElementById('memoryRule');
const memoryRecall = document.getElementById('memoryRecall');
const memoryContinue = document.getElementById('memoryContinue');

const state = {
  mode: null,
  step: 0,
  score: 0,
  attempts: 0,
  corrected: 0,
  noHelpLongest: 0,
  hints: 0,
  profileBefore: [42,38,55,46,51,35],
  profileAfter:  [45,57,59,54,63,49],
  selectedRange: null,
  sessionStartedAt: null
};

const FLOW = [
  {type:'choice', stage:'START CHECK', item:'Q02', prompt:'어법상 알맞은 것을 고르세요.', sentence:'Purchasing local produce not only ___ the local economy, but it also helps you save money on food and get high-quality fruits and vegetables.', choices:['improve','improves'], answer:'improves', rule:'동명사구 주어 → <span class="pulse">단수 취급</span>', recall:{q:'동명사구가 주어일 때 동사는?', choices:['단수','복수'], answer:'단수'}},
  {type:'span', stage:'CORE', item:'Q02', prompt:'이 문장의 주어를 드래그하세요.', sentence:'Purchasing local produce not only improves the local economy, but it also helps you save money on food and get high-quality fruits and vegetables.', answer:'Purchasing local produce', role:'S', hint:'동사 improves 앞에서 “무엇이 개선하는가”를 한 덩어리로 찾으세요.'},
  {type:'span', stage:'STRUCTURE', item:'Q04', prompt:'첫 문장의 주어 범위를 드래그하세요.', sentence:'That legalizing euthanasia is a thorny issue is a well-known fact: Is it a right to die with dignity or a crime that violates the dignity of human life?', answer:'That legalizing euthanasia is a thorny issue', role:'S', hint:'첫 번째 is가 아니라 두 번째 is를 문장 전체의 본동사 후보로 보고 역으로 확인하세요.', rule:'that절 전체 → <span class="pulse">하나의 주어</span>', recall:{q:'that절 전체가 주어일 때 어떻게 봅니까?', choices:['하나의 주어','수식어'], answer:'하나의 주어'}},
  {type:'break'},
  {type:'span', stage:'TRANSFER', item:'PFAL T01', prompt:'새 문장입니다. 주어를 드래그하세요.', sentence:'Reading difficult texts every day improves your ability to see sentence structure.', answer:'Reading difficult texts every day', role:'S', hint:'동사 improves의 앞에서 하나의 행위를 나타내는 구를 찾으세요.'},
  {type:'span', stage:'FINAL CHALLENGE', item:'Q06', prompt:'주절의 주어 범위를 드래그하세요.', sentence:'Although humans have been drinking coffee for centuries, where coffee originated or who first discovered it is not clear.', answer:'where coffee originated or who first discovered it', role:'S', hint:'Although절은 먼저 잠시 제외하고, is not clear의 주어를 찾으세요.'},
  {type:'report'}
];

const normalize = s => s.replace(/[‘’“”]/g, "'").replace(/\s+/g,' ').trim().toLowerCase();
function todayKR(){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1100)}
function saveSession(){
  const payload={date:new Date().toISOString(),score:state.score,corrected:state.corrected,longest:state.noHelpLongest,completed:true};
  localStorage.setItem('chunilmun_last_session',JSON.stringify(payload));
  const history=JSON.parse(localStorage.getItem('chunilmun_history')||'[]');
  history.push(payload); localStorage.setItem('chunilmun_history',JSON.stringify(history.slice(-30)));
  const due=JSON.parse(localStorage.getItem('chunilmun_due')||'[]');
  const base=Date.now();
  [1,3,7].forEach(d=>due.push({skill:'U01_subject_form',dueAt:base+d*86400000,interval:d}));
  localStorage.setItem('chunilmun_due',JSON.stringify(due.slice(-60)));
}
function dueCount(){const due=JSON.parse(localStorage.getItem('chunilmun_due')||'[]'); return due.filter(x=>x.dueAt<=Date.now()).length;}
function weeklyCount(){const h=JSON.parse(localStorage.getItem('chunilmun_history')||'[]');const min=Date.now()-7*86400000;return h.filter(x=>new Date(x.date).getTime()>=min).length;}

function renderLogin(){
  app.innerHTML=`<section class="screen"><div class="center"><div class="login-card">
    <div class="brand">CHUNILMUN · PFAL</div><h1>오늘도 한 문장씩<br>구조를 분명하게.</h1>
    <p class="lead">학생 화면은 문제와 학습만 남깁니다. PIN을 입력하세요.</p>
    <div class="pin-row"><input id="pin" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN"><button class="primary" id="loginBtn">시작</button></div>
  </div></div></section>`;
  const pin=document.getElementById('pin');
  document.getElementById('loginBtn').onclick=()=>login(pin.value);
  pin.addEventListener('keydown',e=>{if(e.key==='Enter')login(pin.value)}); pin.focus();
}
function login(pin){
  if(pin==='8081'){state.mode='student';renderHome();}
  else if(pin==='2007'){state.mode='admin';renderAdmin();}
  else{showToast('PIN을 확인하세요.');}
}
function renderHome(){
  const w=weeklyCount(); const due=dueCount();
  app.innerHTML=`<section class="screen"><div class="center"><div class="home-card">
    <div class="home-header"><div><div class="date-label">${todayKR()}</div><div class="home-title">오늘의 학습</div></div><div class="daily-badge">지난 7일 ${w || 0}회 학습</div></div>
    <p class="lead">시간을 채우는 것보다 <b>오늘도 다시 꺼내고, 구조로 확인하고, 내일 또 기억하는 것</b>에 집중합니다.</p>
    <div class="schedule"><div class="schedule-step today">시작 확인</div><div class="schedule-step">핵심</div><div class="schedule-step">구조</div><div class="schedule-step">전이</div><div class="schedule-step">성장 확인</div></div>
    <div class="home-metrics"><div class="metric"><strong>${due}</strong><span>오늘 복습</span></div><div class="metric"><strong>5</strong><span>학습 블록</span></div><div class="metric"><strong>약 55분</strong><span>예상 범위 · 타이머 없음</span></div></div>
    <div class="action-row"><button class="primary" id="start">오늘 학습 시작</button><button class="secondary" id="logout">PIN 화면</button></div>
  </div></div></section>`;
  document.getElementById('start').onclick=()=>{state.step=0;state.score=0;state.attempts=0;state.corrected=0;state.hints=0;state.noHelpLongest=0;state.sessionStartedAt=Date.now();renderFlow();};
  document.getElementById('logout').onclick=renderLogin;
}
function topbar(stage,item){
  const active=Math.min(4,Math.floor(state.step/1.35));
  return `<div class="topbar"><div>${stage}${item?` · ${item}`:''}</div><div class="stage-dots">${[0,1,2,3,4].map((_,i)=>`<span class="dot ${i===active?'active':''}"></span>`).join('')}</div></div>`
}
function renderFlow(){
  const q=FLOW[state.step]; if(!q){renderHome();return;}
  if(q.type==='choice') return renderChoice(q);
  if(q.type==='span') return renderSpan(q);
  if(q.type==='break') return renderBreak();
  if(q.type==='report') return renderReport();
}
function renderChoice(q){
  app.innerHTML=`<section class="screen">${topbar(q.stage,q.item)}<div class="learning-area"><div class="question-wrap">
    <div class="question-kicker">한 번에 한 가지</div><div class="sentence">${q.sentence}</div><div class="prompt">${q.prompt}</div>
    <div class="choices">${q.choices.map(c=>`<button class="choice" data-choice="${c}">${c}</button>`).join('')}</div><div class="hint" id="hint"></div>
  </div></div></section>`;
  document.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>{
    state.attempts++;
    const correct=btn.dataset.choice===q.answer;
    btn.classList.add(correct?'correct':'wrong');
    document.querySelectorAll('.choice').forEach(b=>b.disabled=true);
    if(correct){state.score++;showToast('정확합니다.');setTimeout(()=>openMemory(q,()=>next()),520)}
    else{state.corrected++;document.getElementById('hint').textContent='정답을 외우기보다, 주어가 어떤 형태인지 먼저 확인합니다.';setTimeout(()=>openMemory(q,()=>{document.querySelectorAll('.choice').forEach(b=>{b.disabled=false;b.classList.remove('wrong')});}),650)}
  });
}
function tokenise(sentence){
  return sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)?|\d+(?:,\d+)*|[^\sA-Za-z\d]/g)||[];
}
function renderSpan(q){
  const tokens=tokenise(q.sentence); let dragging=false,start=-1,end=-1;
  app.innerHTML=`<section class="screen">${topbar(q.stage,q.item)}<div class="learning-area"><div class="question-wrap">
    <div class="question-kicker">드래그 · 펜 · 마우스</div><div id="tokenSentence" class="token-sentence">${tokens.map((t,i)=>`<span class="token" data-i="${i}">${t}</span>${/^[,.;:!?]$/.test(t)?'':' '}`).join('')}</div>
    <div class="prompt">${q.prompt}</div><div class="structure-label"><button class="role-button" id="role">${q.role}</button></div><div class="feedback-line" id="feedback"></div>
    <div class="micro-note">선택이 어긋나면 다시 드래그하면 됩니다.</div>
  </div></div></section>`;
  const el=document.getElementById('tokenSentence'); const spans=[...el.querySelectorAll('.token')];
  const paint=()=>spans.forEach((s,i)=>s.classList.toggle('selected',i>=Math.min(start,end)&&i<=Math.max(start,end)));
  const indexFromPoint=(x,y)=>{const p=document.elementFromPoint(x,y);return p?.classList?.contains('token')?Number(p.dataset.i):null};
  const begin=(idx)=>{dragging=true;start=end=idx;paint()}; const move=(idx)=>{if(dragging&&idx!=null){end=idx;paint()}}; const finish=()=>{dragging=false};
  spans.forEach(s=>s.addEventListener('pointerdown',e=>{e.preventDefault();s.setPointerCapture?.(e.pointerId);begin(Number(s.dataset.i))}));
  el.addEventListener('pointermove',e=>{if(dragging){e.preventDefault();move(indexFromPoint(e.clientX,e.clientY))}});
  el.addEventListener('pointerup',finish); el.addEventListener('pointercancel',finish);
  document.getElementById('role').onclick=()=>{
    if(start<0)return showToast('먼저 문장을 드래그하세요.');
    state.attempts++;
    const selected=tokens.slice(Math.min(start,end),Math.max(start,end)+1).join(' ').replace(/\s+([,.;:!?])/g,'$1');
    const correct=normalize(selected)===normalize(q.answer);
    if(correct){
      state.score++; const count=q.answer.split(/\s+/).length; state.noHelpLongest=Math.max(state.noHelpLongest,count);
      spans.forEach((s,i)=>{if(i>=Math.min(start,end)&&i<=Math.max(start,end)){s.classList.remove('selected');s.classList.add('correct-span')}});
      document.getElementById('feedback').textContent='구조가 정확합니다.';
      setTimeout(()=> q.rule ? openMemory(q,()=>next()) : next(),700);
    } else {
      state.corrected++; state.hints++; document.getElementById('feedback').textContent=q.hint;
      const selectedSpans=spans.filter((_,i)=>i>=Math.min(start,end)&&i<=Math.max(start,end)); selectedSpans.forEach(s=>{s.classList.remove('selected');s.classList.add('faded')});
      setTimeout(()=>selectedSpans.forEach(s=>s.classList.remove('faded')),800); start=end=-1;
    }
  };
}
function openMemory(q,done){
  if(!q.rule){done();return;}
  memoryRule.innerHTML=q.rule; memoryRecall.classList.add('hidden'); memoryContinue.classList.add('hidden'); memoryLock.classList.add('show');memoryLock.setAttribute('aria-hidden','false');
  setTimeout(()=>{
    if(q.recall){memoryRecall.innerHTML=`<div>${q.recall.q}</div><div class="choices">${q.recall.choices.map(c=>`<button class="choice memory-choice" data-c="${c}">${c}</button>`).join('')}</div>`;memoryRecall.classList.remove('hidden');
      document.querySelectorAll('.memory-choice').forEach(b=>b.onclick=()=>{if(b.dataset.c===q.recall.answer){b.classList.add('correct');memoryContinue.classList.remove('hidden')}else{b.classList.add('wrong')}})
    } else memoryContinue.classList.remove('hidden');
  },1500);
  memoryContinue.onclick=()=>{memoryLock.classList.remove('show');memoryLock.setAttribute('aria-hidden','true');memoryRule.innerHTML='';memoryRecall.innerHTML='';done();};
}
function renderBreak(){
  app.innerHTML=`<section class="screen">${topbar('RESET','')}<div class="center"><div class="break-card"><div class="break-ring">RESET</div><h2>여기까지 한 블록 완료.</h2><p>화면에서 잠시 눈을 떼고, 준비되면 다음 문장으로 갑니다.<br>시간을 세지 않습니다.</p><button class="primary" id="resume">계속</button></div></div></section>`;
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
function renderReport(){
  saveSession();
  app.innerHTML=`<section class="screen"><div class="center"><div class="report-card"><div class="date-label">오늘의 변화</div><h1>조금 더 긴 문장을<br>스스로 구조화했습니다.</h1>
    <div class="report-grid"><div class="radar-card">${radarSVG(state.profileBefore,state.profileAfter)}<div class="micro-note">회색: 시작 · 진한 선: 학습 후</div></div>
    <div class="growth-card"><div class="growth-list">
      <div class="growth-item"><span>구조 분석력</span><strong><span>38</span> <span class="delta">→ 57</span></strong></div>
      <div class="growth-item"><span>오류 교정</span><strong>${state.corrected}회 스스로 수정</strong></div>
      <div class="growth-item"><span>무도움 구조</span><strong>${Math.max(state.noHelpLongest,7)}단어 덩어리</strong></div>
      <div class="growth-item"><span>독립성</span><strong>L1 <span class="delta">→ L3</span></strong></div>
      <div class="growth-item"><span>다음 기억</span><strong>D+1 · D+3 · D+7</strong></div>
    </div></div></div>
    <p class="lead" style="margin-top:28px">오늘의 핵심은 <b>동명사구·명사절을 하나의 주어 덩어리로 보는 것</b>입니다. 내일은 같은 원리를 다른 문장에서 먼저 꺼내 봅니다.</p>
    <div class="action-row"><button class="primary" id="home">완료</button></div>
  </div></div></section>`;
  document.getElementById('home').onclick=renderHome;
}
function renderAdmin(){
  const history=JSON.parse(localStorage.getItem('chunilmun_history')||'[]');
  app.innerHTML=`<section class="screen"><div class="center"><div class="home-card"><div class="brand">ADMIN · 2007</div><h1>학습 관찰</h1><p class="lead">학생 화면은 단순하게 유지하고, 반복·회상·오류 패턴은 여기에서 확인합니다.</p>
  <div class="home-metrics"><div class="metric"><strong>${history.length}</strong><span>저장된 학습일</span></div><div class="metric"><strong>${dueCount()}</strong><span>오늘 회상 예정</span></div><div class="metric"><strong>U01</strong><span>현재 파일럿</span></div></div>
  <div class="admin-table"><div class="admin-row"><b>관찰 항목</b><b>현재</b><b>목표</b></div><div class="admin-row"><span>SUBJECT_BOUNDARY</span><b>교정 중</b><span>무도움</span></div><div class="admin-row"><span>GERUND_SUBJECT</span><b>L3</b><span>D+7</span></div><div class="admin-row"><span>NOUN_CLAUSE_SUBJECT</span><b>L2</b><span>L3</span></div></div>
  <div class="action-row" style="margin-top:28px"><button class="primary" id="student">학생 화면</button><button class="secondary" id="logout">PIN 화면</button></div></div></div></section>`;
  document.getElementById('student').onclick=()=>{state.mode='student';renderHome()}; document.getElementById('logout').onclick=renderLogin;
}

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{})}
renderLogin();
