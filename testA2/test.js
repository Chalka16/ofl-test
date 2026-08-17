const state={
  questions:[],
  mode:"learn",
  current:0,
  answers:[],
  displayedOptions:[],
  locked:false
};

const $=id=>document.getElementById(id);

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function labelCategory(c){
  return c==="meteorologie"?"Meteorologie":c==="uas_vykonnost"?"Provádění letů / UAS":"Zmírnění rizik";
}
function labelDifficulty(d){
  return d==="easy"?"Lehká":d==="medium"?"Střední":"Těžká";
}

function newRun(mode){
  state.mode=mode;
  state.current=0;
  state.answers=Array(state.questions.length).fill(null);
  state.locked=false;
  state.displayedOptions=[];
  $("modeTitle").textContent=mode==="learn"?"Trénink":"Simulace zkoušky";
  $("learnMode").classList.toggle("active",mode==="learn");
  $("examMode").classList.toggle("active",mode==="exam");
  $("result").classList.add("hidden");
  render();
}

function render(){
  const q=state.questions[state.current];
  if(!q)return;
  $("counter").textContent=`Otázka ${state.current+1} z ${state.questions.length}`;
  const answered=state.answers.filter(x=>x!==null).length;
  $("answered").textContent=`${answered} zodpovězeno`;
  $("bar").style.width=`${((state.current+1)/state.questions.length)*100}%`;
  $("num").textContent=String(state.current+1).padStart(2,"0");
  $("cat").textContent=labelCategory(q.category);
  $("diff").textContent=labelDifficulty(q.difficulty);
  $("question").textContent=q.question;

  // Shuffle both question choices and their display order on every new question.
  if(!state.displayedOptions.length || state.displayedOptionsQuestion!==state.current){
    state.displayedOptions=shuffle(q.options.map((text,index)=>({text,index})));
    state.displayedOptionsQuestion=state.current;
  }

  const selected=state.answers[state.current];
  $("answers").innerHTML="";
  state.displayedOptions.forEach((opt)=>{
    const b=document.createElement("button");
    b.className="answer";
    b.dataset.originalIndex=opt.index;
    if(selected!==null && selected===opt.index)b.classList.add("selected");
    b.innerHTML=`<span>${String.fromCharCode(65+state.displayedOptions.indexOf(opt))}</span>${opt.text}`;
    b.onclick=()=>choose(opt.index);
    if(state.mode==="learn" && selected!==null)b.disabled=true;
    $("answers").appendChild(b);
  });

  $("explanation").classList.add("hidden");
  $("explanation").className="explanation hidden";

  if(state.mode==="learn" && selected!==null) showExplanation(q,selected,false);
  $("prev").disabled=state.current===0;
  $("next").textContent=state.current===state.questions.length-1?"Dokončit":"Další →";
}

function choose(originalIndex){
  if(state.mode==="learn" && state.answers[state.current]!==null)return;
  state.answers[state.current]=originalIndex;
  render();
  if(state.mode==="learn"){
    showExplanation(state.questions[state.current],originalIndex,true);
  }
}

function showExplanation(q,selected,scroll){
  const ok=selected===q.correctAnswer;
  const box=$("explanation");
  box.className=`explanation ${ok?"good":"bad"}`;
  box.innerHTML=`<strong>${ok?"✓ Správně":"✕ Špatně"}</strong><br>${q.explanation}`;
  box.classList.remove("hidden");
  [...$("answers").children].forEach(b=>{
    const idx=Number(b.dataset.originalIndex);
    b.disabled=true;
    if(idx===q.correctAnswer)b.classList.add("correct");
    if(idx===selected && selected!==q.correctAnswer)b.classList.add("wrong");
  });
  if(scroll){
    requestAnimationFrame(()=>box.scrollIntoView({behavior:"smooth",block:"center"}));
  }
}

function next(){
  if(state.mode==="exam" && state.answers[state.current]===null){
    alert("Nejdříve vyber odpověď.");
    return;
  }
  if(state.current<state.questions.length-1){
    state.current++;
    state.displayedOptions=[];
    render();
    window.scrollTo({top:0,behavior:"smooth"});
  }else{
    finish();
  }
}
function prev(){
  if(state.current>0){
    state.current--;
    state.displayedOptions=[];
    render();
    window.scrollTo({top:0,behavior:"smooth"});
  }
}

function finish(){
  const results=state.questions.map((q,i)=>({
    q,answer:state.answers[i],correct:state.answers[i]===q.correctAnswer
  }));
  const correct=results.filter(x=>x.correct).length;
  const wrong=results.length-correct;
  const pct=Math.round(correct/results.length*100);
  const pass=state.mode==="exam" ? correct>=23 : null;
  const mistakes=results.filter(x=>!x.correct);

  $("result").innerHTML=`
    <div class="result-hero ${pass===true?"pass":""}">
      <b>${state.mode==="exam"?(pass?"ÚSPĚŠNĚ":"NEÚSPĚŠNĚ"):"Výsledek tréninku"}</b>
      <span>${correct} / ${results.length} • ${pct} %</span>
    </div>
    <div class="result-summary">
      <div><b>${correct}</b><small>správně</small></div>
      <div><b>${wrong}</b><small>chybně</small></div>
      <div><b>${pct} %</b><small>úspěšnost</small></div>
    </div>
    <div class="mistakes">
      <div><strong>Moje chyby</strong> <span style="color:#64748b;font-size:12px">${mistakes.length} otázek</span></div>
      ${mistakes.length?mistakes.map((r,i)=>{
        const user=r.answer===null?"Bez odpovědi":r.q.options[r.answer];
        const right=r.q.options[r.q.correctAnswer];
        return `<div class="mistake"><b>${i+1}. ${r.q.question}</b><small>Tvá odpověď: ${user}</small><strong>Správně: ${right}</strong></div>`;
      }).join(""):"<p style='color:#64748b'>Bez chybných odpovědí.</p>"}
      ${mistakes.length?`<button class="primary repeat" id="repeatMistakes">↻ Zopakovat chybné otázky</button>`:""}
    </div>`;
  $("result").classList.remove("hidden");
  $("result").scrollIntoView({behavior:"smooth",block:"start"});
  const repeat=$("repeatMistakes");
  if(repeat)repeat.onclick=()=>startMistakes(mistakes.map(x=>x.q));
}

function startMistakes(list){
  state.questions=shuffle(list);
  state.current=0;
  state.answers=Array(state.questions.length).fill(null);
  state.displayedOptions=[];
  state.mode="learn";
  $("modeTitle").textContent="Moje chyby";
  $("learnMode").classList.add("active");
  $("examMode").classList.remove("active");
  $("result").classList.add("hidden");
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}

$("next").onclick=next;
$("prev").onclick=prev;
$("learnMode").onclick=()=>newRun("learn");
$("examMode").onclick=()=>newRun("exam");

fetch("data/questions.json")
  .then(r=>{if(!r.ok)throw new Error("Databázi se nepodařilo načíst.");return r.json();})
  .then(data=>{state.questions=data.questions.filter(q=>q.status!=="retired");newRun("learn");})
  .catch(err=>{
    document.body.innerHTML=`<main style="padding:30px;font-family:system-ui"><h2>Chyba načtení databáze</h2><p>${err.message}</p><p>Spusť aplikaci přes lokální webový server nebo GitHub Pages.</p></main>`;
  });
