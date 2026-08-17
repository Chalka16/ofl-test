const state={
  allQuestions:[],
  questions:[],
  mode:null,
  current:0,
  answers:[],
  displayedOptions:[],
  mistakes:new Set(JSON.parse(localStorage.getItem("a2_mistakes")||"[]")),
  examConfig:{questions:30,passPercentage:75,passingScore:23}
};

const $=id=>document.getElementById(id);
const screens=["homeScreen","setupScreen","quizScreen","resultScreen","errorScreen"];

function show(id){
  screens.forEach(s=>$(s).classList.toggle("hidden",s!==id));
  $("homeBtn").classList.toggle("hidden",id==="homeScreen");
  window.scrollTo({top:0,behavior:"instant"});
}

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function categoryLabel(c){
  return c==="meteorologie"?"Meteorologie":c==="uas_vykonnost"?"Provádění letů / UAS":"Zmírnění rizik";
}
function difficultyLabel(d){return d==="easy"?"Lehká":d==="medium"?"Střední":"Těžká";}

function saveMistakes(){
  localStorage.setItem("a2_mistakes",JSON.stringify([...state.mistakes]));
}

function openSetup(mode){
  state.mode=mode;
  $("setupEyebrow").textContent=mode==="exam"?"SIMULACE ZKOUŠKY":mode==="mistakes"?"OPAKOVÁNÍ CHYB":"VÝUKA";
  $("setupTitle").textContent=mode==="exam"?"Zkouška A2":mode==="mistakes"?"Moje chyby":"Učení";

  const cats=[...new Set(state.allQuestions.map(q=>q.category))];
  let pool=state.allQuestions;
  if(mode==="mistakes"){
    pool=pool.filter(q=>state.mistakes.has(q.id));
    if(!pool.length){
      $("setupContent").innerHTML="<h3>Nemáš žádné uložené chyby.</h3><p class='muted'>Jakmile v učení nebo zkoušce odpovíš špatně, otázka se sem uloží.</p>";
      $("startBtn").disabled=true;
      show("setupScreen");
      return;
    }
  }
  $("startBtn").disabled=false;
  $("setupContent").innerHTML=`
    <div class="setup-options">
      <label class="setup-option"><input type="radio" name="category" value="all" checked> Všechny oblasti</label>
      ${cats.map(c=>`<label class="setup-option"><input type="radio" name="category" value="${c}"> ${categoryLabel(c)}</label>`).join("")}
    </div>
    <p class="muted">${mode==="exam"
      ? `${state.examConfig.questions} otázek. Správné odpovědi a vysvětlení se zobrazí až po dokončení.`
      : mode==="mistakes"
      ? `${pool.length} uložených chybných otázek.`
      : "Po každé odpovědi se zobrazí výsledek a vysvětlení."}</p>`;
  show("setupScreen");
}

function startQuiz(){
  const cat=document.querySelector('input[name="category"]:checked')?.value||"all";
  let pool=state.allQuestions.filter(q=>cat==="all"||q.category===cat);

  if(state.mode==="mistakes") pool=pool.filter(q=>state.mistakes.has(q.id));
  pool=shuffle(pool);

  if(state.mode==="exam"){
    if(pool.length<state.examConfig.questions){
      $("setupContent").innerHTML=`<h3>Nedostatek otázek</h3><p class="muted">Pro zkoušku je potřeba ${state.examConfig.questions} otázek. Databáze jich má v tomto vzorku ${pool.length} pro zvolený filtr.</p>`;
      return;
    }
    pool=pool.slice(0,state.examConfig.questions);
  }

  state.questions=pool;
  state.current=0;
  state.answers=Array(pool.length).fill(null);
  state.displayedOptions=Array(pool.length).fill(null);
  $("startBtn").disabled=false;
  show("quizScreen");
  renderQuestion();
}

function renderQuestion(){
  const q=state.questions[state.current];
  if(!q)return;

  const total=state.questions.length;
  const answered=state.answers.filter(x=>x!==null).length;
  $("quizMode").textContent=state.mode==="exam"?"SIMULACE ZKOUŠKY":state.mode==="mistakes"?"MOJE CHYBY":"UČENÍ";
  $("progressText").textContent=`Otázka ${state.current+1} z ${total}`;
  $("answeredText").textContent=`${answered} zodpovězeno`;
  $("progressBar").style.width=`${((state.current+1)/total)*100}%`;
  $("questionNumber").textContent=String(state.current+1).padStart(2,"0");
  $("categoryTag").textContent=categoryLabel(q.category);
  $("difficultyTag").textContent=difficultyLabel(q.difficulty);
  $("questionText").textContent=q.question;

  if(!state.displayedOptions[state.current]){
    state.displayedOptions[state.current]=shuffle(q.options.map((text,index)=>({text,index})));
  }
  const displayed=state.displayedOptions[state.current];
  const selected=state.answers[state.current];

  $("answers").innerHTML="";
  displayed.forEach((opt,displayIndex)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="answer";
    b.dataset.originalIndex=opt.index;
    b.innerHTML=`<span class="answer-letter">${String.fromCharCode(65+displayIndex)}</span><span>${opt.text}</span>`;
    if(selected!==null && selected===opt.index)b.classList.add("selected");

    if(state.mode==="learn" && selected!==null){
      b.disabled=true;
      if(opt.index===q.correctAnswer)b.classList.add("correct");
      if(opt.index===selected && selected!==q.correctAnswer)b.classList.add("wrong");
    }

    b.addEventListener("click",()=>chooseAnswer(opt.index));
    $("answers").appendChild(b);
  });

  $("explanation").className="explanation hidden";
  $("explanation").innerHTML="";
  if((state.mode==="learn" || state.mode==="mistakes") && selected!==null) showExplanation(q,selected,false);

  $("prevBtn").disabled=state.current===0;
  $("nextBtn").textContent=state.current===total-1
    ? (state.mode==="exam"?"Dokončit test":"Dokončit")
    :"Další →";
}

function chooseAnswer(originalIndex){
  const q=state.questions[state.current];

  if((state.mode==="learn" || state.mode==="mistakes") && state.answers[state.current]!==null)return;

  state.answers[state.current]=originalIndex;

  if(originalIndex!==q.correctAnswer) state.mistakes.add(q.id);
  else state.mistakes.delete(q.id);
  saveMistakes();

  renderQuestion();

  if(state.mode==="learn" || state.mode==="mistakes"){
    showExplanation(q,originalIndex,true);
  }
}

function showExplanation(q,selected,scroll){
  const ok=selected===q.correctAnswer;
  const box=$("explanation");
  box.className=`explanation ${ok?"good":"bad"}`;
  box.innerHTML=`<strong>${ok?"✓ Správně":"✕ Špatně"}</strong><br>${q.explanation}`;
  box.classList.remove("hidden");

  [...$("answers").children].forEach(b=>{
    b.disabled=true;
    const idx=Number(b.dataset.originalIndex);
    if(idx===q.correctAnswer)b.classList.add("correct");
    if(idx===selected && selected!==q.correctAnswer)b.classList.add("wrong");
  });

  if(scroll){
    requestAnimationFrame(()=>box.scrollIntoView({behavior:"smooth",block:"center"}));
  }
}

function nextQuestion(){
  if(state.mode==="exam" && state.answers[state.current]===null){
    alert("Nejdříve vyber odpověď.");
    return;
  }
  if(state.current<state.questions.length-1){
    state.current++;
    renderQuestion();
    window.scrollTo({top:0,behavior:"smooth"});
  }else finishQuiz();
}

function prevQuestion(){
  if(state.current>0){
    state.current--;
    renderQuestion();
    window.scrollTo({top:0,behavior:"smooth"});
  }
}

function finishQuiz(){
  const results=state.questions.map((q,i)=>({
    q,answer:state.answers[i],correct:state.answers[i]!==null && state.answers[i]===q.correctAnswer
  }));
  results.forEach(r=>{
    if(r.correct)state.mistakes.delete(r.q.id);
    else state.mistakes.add(r.q.id);
  });
  saveMistakes();

  const correct=results.filter(r=>r.correct).length;
  const wrong=results.length-correct;
  const percent=Math.round(correct/results.length*100);
  const pass=state.mode==="exam"?correct>=state.examConfig.passingScore:null;
  const mistakes=results.filter(r=>!r.correct);

  $("resultHero").className=`result-hero ${pass===true?"pass":""}`;
  $("resultHero").innerHTML=state.mode==="exam"
    ? `<b>${pass?"ÚSPĚŠNĚ":"NEÚSPĚŠNĚ"}</b><span>${correct}/${results.length} • ${percent} %</span>`
    : `<b>Výsledek tréninku</b><span>${correct}/${results.length} • ${percent} %</span>`;

  $("resultStats").innerHTML=`
    <div><b>${correct}</b><span>správně</span></div>
    <div><b>${wrong}</b><span>chybně</span></div>
    <div><b>${percent} %</b><span>úspěšnost</span></div>`;

  $("mistakeCount").textContent=`${mistakes.length} ${mistakes.length===1?"otázka":"otázek"}`;

  $("resultList").innerHTML=mistakes.length
    ? mistakes.map((r,i)=>{
        const user=r.answer===null?"Bez odpovědi":r.q.options[r.answer];
        const right=r.q.options[r.q.correctAnswer];
        return `<div class="result-item">
          <strong>${i+1}. ${r.q.question}</strong>
          <small><span class="wrong">Tvoje odpověď:</span> ${user}</small>
          <small><span class="right">Správná odpověď:</span> ${right}</small>
        </div>`;
      }).join("")
    : "<p class='muted'>Bez chybných odpovědí.</p>";

  $("repeatMistakesBtn").classList.toggle("hidden",mistakes.length===0);
  $("repeatMistakesBtn").onclick=()=>startMistakeRun(mistakes.map(r=>r.q));

  show("resultScreen");
}

function startMistakeRun(list){
  state.mode="mistakes";
  state.questions=shuffle(list);
  state.current=0;
  state.answers=Array(state.questions.length).fill(null);
  state.displayedOptions=Array(state.questions.length).fill(null);
  show("quizScreen");
  renderQuestion();
}

function retry(){
  openSetup(state.mode==="exam"?"exam":"learn");
}

function goHome(){show("homeScreen");}

async function load(){
  try{
    const response=await fetch("data/questions.json");
    if(!response.ok)throw new Error("Databázi otázek se nepodařilo načíst.");
    const data=await response.json();
    state.allQuestions=data.questions.filter(q=>q.status!=="retired");
    if(data.exam){
      state.examConfig.questions=data.exam.questions??30;
      state.examConfig.passPercentage=data.exam.passPercentage??75;
      state.examConfig.passingScore=data.exam.passingScore??Math.ceil(state.examConfig.questions*state.examConfig.passPercentage/100);
    }
    $("examCount").textContent=state.examConfig.questions;
    $("passPercent").textContent=`${state.examConfig.passPercentage} %`;
    $("passingScore").textContent=`${state.examConfig.passingScore}/${state.examConfig.questions}`;
  }catch(err){
    $("errorScreen").innerHTML=`<div class="error-card"><h2>Chyba načtení databáze</h2><p>${err.message}</p><p>Spusť aplikaci přes lokální webový server nebo GitHub Pages.</p></div>`;
    show("errorScreen");
  }
}

$("homeBtn").onclick=goHome;
$("backBtn").onclick=goHome;
$("homeResultBtn").onclick=goHome;
$("startBtn").onclick=startQuiz;
$("nextBtn").onclick=nextQuestion;
$("prevBtn").onclick=prevQuestion;
$("retryBtn").onclick=retry;
document.querySelectorAll(".mode-card").forEach(b=>b.onclick=()=>openSetup(b.dataset.mode));

load();
