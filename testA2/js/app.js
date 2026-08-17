const state = {
  questions: [],
  mode: null,
  pool: [],
  current: 0,
  answers: [],
  locked: false,
  mistakes: JSON.parse(localStorage.getItem("a2_mistakes") || "[]")
};

const $ = id => document.getElementById(id);
const screens = ["homeScreen","setupScreen","quizScreen","resultScreen"];

function show(id){
  screens.forEach(s => $(s).classList.toggle("hidden", s !== id));
  $("homeBtn").classList.toggle("hidden", id === "homeScreen");
  window.scrollTo({top:0, behavior:"instant"});
}

async function loadQuestions(){
  const res = await fetch("data/questions.json");
  if(!res.ok) throw new Error("Databázi otázek se nepodařilo načíst.");
  const data = await res.json();
  state.questions = data.questions.filter(q => q.status !== "retired");
}

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function categoryLabel(cat){
  return ({
    meteorologie:"Meteorologie",
    uas_vykonnost:"Provádění letů / výkonnost UAS",
    zmírnění_rizik:"Zmírnění rizik na zemi"
  })[cat] || cat;
}

function difficultyLabel(d){
  return ({easy:"Lehká",medium:"Střední",hard:"Těžká"})[d] || d;
}

function openSetup(mode){
  state.mode = mode;
  $("setupEyebrow").textContent = mode === "exam" ? "SIMULACE ZKOUŠKY" : mode === "mistakes" ? "OPAKOVÁNÍ" : "VÝUKA";
  $("setupTitle").textContent = mode === "exam" ? "Zkouška A2" : mode === "mistakes" ? "Moje chyby" : "Učím se";
  const cats = [...new Set(state.questions.map(q=>q.category))];
  $("setupContent").innerHTML = `
    <div class="setup-options">
      <label class="setup-option selected"><input type="radio" name="cat" value="all" checked> Všechny oblasti</label>
      ${cats.map(c=>`<label class="setup-option"><input type="radio" name="cat" value="${c}"> ${categoryLabel(c)}</label>`).join("")}
    </div>
    <p style="color:#64748b;font-size:13px;margin:18px 0 0">
      ${mode==="exam" ? "30 otázek. Správné odpovědi a vysvětlení se zobrazí až po dokončení." : mode==="mistakes" ? "Procvičíš otázky, ve kterých jsi v této aplikaci dříve chyboval." : "Po každé odpovědi dostaneš okamžitou zpětnou vazbu a vysvětlení."}
    </p>`;
  show("setupScreen");
}

function startQuiz(){
  const selected = document.querySelector('input[name="cat"]:checked')?.value || "all";
  let pool = state.questions.filter(q => selected === "all" || q.category === selected);
  if(state.mode === "mistakes"){
    const ids = new Set(state.mistakes);
    pool = pool.filter(q => ids.has(q.id));
    if(!pool.length){
      $("setupContent").innerHTML = `<div><h3>Žádné chyby</h3><p style="color:#64748b">Zatím nemáš uložené žádné chybné odpovědi v této oblasti.</p></div>`;
      return;
    }
  }
  pool = shuffle(pool);
  if(state.mode === "exam") pool = pool.slice(0, Math.min(30, pool.length));
  state.pool = pool;
  state.current = 0;
  state.answers = Array(pool.length).fill(null);
  state.locked = false;
  show("quizScreen");
  renderQuestion();
}

function renderQuestion(){
  const q = state.pool[state.current];
  if(!q) return;
  $("progressText").textContent = `${state.current+1} / ${state.pool.length}`;
  const answered = state.answers.filter(a=>a!==null).length;
  $("scoreText").textContent = state.mode==="exam" ? `${answered} zodpovězeno` : "";
  $("progressBar").style.width = `${((state.current+1)/state.pool.length)*100}%`;
  $("categoryTag").textContent = categoryLabel(q.category);
  $("difficultyTag").textContent = difficultyLabel(q.difficulty);
  $("questionText").textContent = q.question;
  $("explanation").classList.add("hidden");
  $("explanation").innerHTML = "";
  $("answers").innerHTML = "";

  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = `${String.fromCharCode(65+i)}. ${text}`;
    const saved = state.answers[state.current];
    if(saved !== null){
      btn.classList.toggle("selected", saved === i);
      if(state.mode === "learn"){
        btn.disabled = true;
        if(i === q.correctAnswer) btn.classList.add("correct");
        if(saved === i && saved !== q.correctAnswer) btn.classList.add("wrong");
      }
    }
    btn.addEventListener("click", () => chooseAnswer(i));
    $("answers").appendChild(btn);
  });

  if(state.mode==="learn" && state.answers[state.current] !== null){
    showExplanation(q, state.answers[state.current]);
  }

  $("prevBtn").disabled = state.current === 0;
  $("nextBtn").textContent = state.current === state.pool.length-1
    ? (state.mode==="exam" ? "Dokončit test" : "Dokončit")
    : "Další →";
}

function chooseAnswer(index){
  const q = state.pool[state.current];
  if(state.mode === "learn" && state.answers[state.current] !== null) return;
  state.answers[state.current] = index;
  if(state.mode === "learn") showExplanation(q,index);
  renderQuestion();
  if(state.mode === "learn") showExplanation(q,index);
}

function showExplanation(q, selected){
  $("explanation").classList.remove("hidden");
  const ok = selected === q.correctAnswer;
  $("explanation").innerHTML = `<strong>${ok ? "✓ Správně" : "✕ Špatně"}</strong><br>${q.explanation}`;
  [...$("answers").children].forEach((btn,i)=>{
    btn.disabled = true;
    if(i === q.correctAnswer) btn.classList.add("correct");
    if(i === selected && selected !== q.correctAnswer) btn.classList.add("wrong");
  });
}

function nextQuestion(){
  if(state.mode === "exam" && state.answers[state.current] === null){
    alert("Nejdřív vyber odpověď.");
    return;
  }
  if(state.current < state.pool.length-1){
    state.current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion(){
  if(state.current > 0){
    state.current--;
    renderQuestion();
  }
}

function finishQuiz(){
  const results = state.pool.map((q,i)=>({q, answer:state.answers[i], correct:state.answers[i]===q.correctAnswer}));
  results.filter(r=>!r.correct).forEach(r=>{
    if(!state.mistakes.includes(r.q.id)) state.mistakes.push(r.q.id);
  });
  results.filter(r=>r.correct).forEach(r=>{
    // Keep mistake history until the user gets the question right twice is unnecessary
    // for V1; remove it immediately after a correct answer.
    state.mistakes = state.mistakes.filter(id=>id!==r.q.id);
  });
  localStorage.setItem("a2_mistakes", JSON.stringify(state.mistakes));

  const correct = results.filter(r=>r.correct).length;
  const total = results.length;
  const percent = Math.round(correct/total*100);
  const pass = state.mode === "exam" ? correct >= 23 : null;

  $("resultHero").className = `result-hero ${pass===true?"pass":pass===false?"fail":""}`;
  $("resultHero").innerHTML = state.mode==="exam"
    ? `<h2>${pass ? "ÚSPĚŠNĚ" : "NEÚSPĚŠNĚ"}</h2><p>${correct} / ${total} správně • ${percent} %</p>`
    : `<h2>Výsledek tréninku</h2><p>${correct} / ${total} správně • ${percent} %</p>`;

  $("resultStats").innerHTML = `
    <div><b>${correct}</b><span>správně</span></div>
    <div><b>${total-correct}</b><span>chybně</span></div>
    <div><b>${percent} %</b><span>úspěšnost</span></div>`;

  $("resultList").innerHTML = results.map((r,i)=>{
    const user = r.answer === null ? "Bez odpovědi" : `${String.fromCharCode(65+r.answer)}. ${r.q.options[r.answer]}`;
    const right = `${String.fromCharCode(65+r.q.correctAnswer)}. ${r.q.options[r.q.correctAnswer]}`;
    return `<div class="result-item">
      <strong>${i+1}. ${r.q.question}</strong>
      <small>${r.correct ? "✓ Správně" : "✕ Chyba"}<br>Tvá odpověď: ${user}<br>Správná odpověď: ${right}<br>${r.q.explanation}</small>
    </div>`;
  }).join("");

  show("resultScreen");
}

function goHome(){ show("homeScreen"); }
function retry(){ openSetup(state.mode); }

$("homeBtn").addEventListener("click", goHome);
$("homeResultBtn").addEventListener("click", goHome);
$("backBtn").addEventListener("click", goHome);
$("startBtn").addEventListener("click", startQuiz);
$("nextBtn").addEventListener("click", nextQuestion);
$("prevBtn").addEventListener("click", prevQuestion);
$("retryBtn").addEventListener("click", retry);
document.querySelectorAll(".mode-card").forEach(btn=>btn.addEventListener("click",()=>openSetup(btn.dataset.mode)));

loadQuestions().catch(err=>{
  $("homeScreen").innerHTML = `<div class="panel"><h2>Chyba načtení databáze</h2><p>${err.message}</p><p>Spusť aplikaci přes lokální webový server; prohlížeče mohou blokovat načítání JSON při otevření souboru přímo z disku.</p></div>`;
});
