const questions = [
{text:"VÚD – Počáteční zůstatek Výsledku hospodaření",amount:"200000",md:"701",d:"431",explanation:"V případě dosaženého zisku v minulém účetním období se výsledek hospodaření převádí na účet 431 na straně Dal. Software Vám výsledek účtu 431 vypočítá po uzavření běžného období."},
{text:"VÚD – Příděl do rezervního fondu",amount:"20000",md:"431",d:"421",explanation:"Účet 421 je účet pasivní. Jeho přírůstky se zaznamenávají na straně Dal."},
{text:"VÚD – Příděl do sociálního fondu",amount:"30000",md:"431",d:"423",explanation:"Účet 423 je účet pasivní. Jeho přírůstky se zaznamenávají na straně Dal."},
{text:"VÚD – Předpis závazku za společníky – podíly na zisku",amount:"100000",md:"431",d:"364",explanation:"Valná hromada může rozhodnout o přidělení podílů na zisku společníkům. Ve chvíli tohoto rozhodnutí se účtuje na základě interního dokladu o závazku společnosti ke společníkům. Závazky jsou účtem pasivním, přírůstek bude zanesen na straně Dal."},
{text:"VÚD – Předpis srážkové daně z podílů na zisku 15 %, částka 15 000 Kč",amount:"15000",md:"364",d:"342",explanation:"Snížení závazku za společníky a zároveň zvýšení závazku za finančním úřadem."},
{text:"VÚD – Převedení zisku na Nerozdělený zisk minulých let",amount:"50000",md:"431",d:"428",explanation:"Zbytek HV – zisku se musí převést na účet 428 na str. D. Účet 431 musí ke konci běžného období vykazovat 0 Kč."},
{text:"VBÚ – Výplata podílů na zisku společníkům: 85 000 Kč",amount:"85000",md:"364",d:"221",explanation:"Snížení (vynulování) závazku za společníky. Výplata provedena z bankovního konta – úbytek finančních prostředků na účtu 221."},
{text:"VBÚ – Odvod srážkové daně: 15 000 Kč",amount:"15000",md:"342",d:"221",explanation:"Snížení (vynulování) závazku vůči finančnímu úřadu. Placeno z bankovního účtu – úbytek peněz z bankovního konta 221."}
];

let accounts=[];
const norm=v=>String(v??"").replace(/\s+/g,"").replace(/[.,-]/g,"").trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

async function loadAccounts(){
  try{const r=await fetch("accounts.json");if(r.ok)accounts=await r.json();}
  catch(e){accounts=[];}
}

function render(){
  document.getElementById("questions").innerHTML=questions.map((q,i)=>`
    <article class="question" data-index="${i}">
      <div class="question-head">${i+1}. ${q.text}</div>
      <div class="amount-row field-wrap"><label>Částka</label><input class="amount-input" inputmode="numeric" autocomplete="off" data-type="amount"></div>
      <div class="account-grid">
        <div class="field-wrap"><label>MD</label><input class="account-input" inputmode="numeric" autocomplete="off" data-type="md"><div class="suggestions"></div></div>
        <div class="field-wrap"><label>D</label><input class="account-input" inputmode="numeric" autocomplete="off" data-type="d"><div class="suggestions"></div></div>
      </div>
      <div class="explanation" hidden></div>
    </article>`).join("");
  bindInputs();
}

function matches(q){
  q=q.trim().toLowerCase();
  return (q?accounts.filter(a=>String(a.code).includes(q)||String(a.name).toLowerCase().includes(q)):accounts).slice(0,30);
}
function closeAll(except){
  document.querySelectorAll(".suggestions.open").forEach(x=>{if(x!==except)x.classList.remove("open")});
}
function showSuggestions(input){
  const box=input.parentElement.querySelector(".suggestions"),list=matches(input.value);
  box.innerHTML=list.map(a=>`<button type="button" class="suggestion" data-code="${a.code}"><span class="suggestion-code">${a.code}</span><span class="suggestion-name">${esc(a.name)}</span></button>`).join("");
  box.classList.toggle("open",list.length>0);
}
function bindInputs(){
  document.querySelectorAll(".account-input").forEach(input=>{
    input.addEventListener("input",()=>{showSuggestions(input);if(/^\d{3}$/.test(input.value)&&input.dataset.type==="md")input.closest(".question").querySelector('[data-type="d"]').focus();});
    input.addEventListener("focus",()=>{closeAll(input.parentElement.querySelector(".suggestions"));showSuggestions(input);});
  });
  document.addEventListener("click",e=>{
    const s=e.target.closest(".suggestion");
    if(s){const i=s.closest(".field-wrap").querySelector(".account-input");i.value=s.dataset.code;s.parentElement.classList.remove("open");if(i.dataset.type==="md")i.closest(".question").querySelector('[data-type="d"]').focus();return;}
    if(!e.target.closest(".field-wrap"))closeAll();
  });
}

document.getElementById("testForm").addEventListener("submit",e=>{
  e.preventDefault();
  let correct=0;
  questions.forEach((q,i)=>{
    const c=document.querySelector(`[data-index="${i}"]`);
    const a=c.querySelector('[data-type="amount"]'),m=c.querySelector('[data-type="md"]'),d=c.querySelector('[data-type="d"]'),x=c.querySelector(".explanation");
    const ok=[norm(a.value)===norm(q.amount),norm(m.value)===norm(q.md),norm(d.value)===norm(q.d)];
    [a,m,d].forEach((el,j)=>{el.classList.remove("correct","wrong");el.classList.add(ok[j]?"correct":"wrong");});
    if(ok.every(Boolean))correct++;
    x.hidden=false;x.innerHTML=`<strong>Vysvětlení:</strong> ${q.explanation}`;
  });
  const total=questions.length,p=Math.round(correct/total*100),r=document.getElementById("result");
  r.innerHTML=`<div class="result-title">Výsledek:</div><div class="result-stats"><div class="result-stat"><span>Správně</span><strong>${correct} / ${total}</strong></div><div class="result-stat"><span>Úspěšnost</span><strong>${p} %</strong></div><div class="result-stat"><span>Chybně</span><strong>${total-correct}</strong></div></div>`;
  r.classList.remove("hidden");
  const st=JSON.parse(localStorage.getItem("ucetnictvi_stats")||'{"tests":0,"correct":0,"questions":0,"wrong":0}');
  st.tests++;st.correct+=correct;st.questions+=total;st.wrong+=total-correct;
  localStorage.setItem("ucetnictvi_stats",JSON.stringify(st));
  document.querySelector(".submit-button").disabled=true;
  window.scrollTo({top:0,behavior:"smooth"});
});

loadAccounts().then(render);