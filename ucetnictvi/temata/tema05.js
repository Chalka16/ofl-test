const questions = [
  {
    text: "VÚD - Počáteční zůstatek Výsledku hospodaření",
    amount: "300000",
    md: "431",
    d: "701",
    explanation: "Ztráta má počáteční zůstatek na straně MD účtu 431 (v případě zisku by se HV účtoval stále na stejný účet 431, avšak na str. D)."
  },
  {
    text: "VÚD - Úhrada ztráty z rezervního fondu",
    amount: "40000",
    md: "421",
    d: "431",
    explanation: "Snížíme zákonný rezervní fond (strana MD) a zároveň snížíme ztrátu zaúčtováním účtu 431 na stranu Dal."
  },
  {
    text: "VÚD - Úhrada ztráty z nerozděleného zisku minulých let",
    amount: "150000",
    md: "428",
    d: "431",
    explanation: "Ztrátu lze uhradit z účtu 428, na který ÚJ v minulých obdobích účtovala dosažený nerozdělený zisk. Jedná se pouze o účetní termín „úhrady“. Vidíte, že úhrada není účtována ani z účtu 211 nebo 221, o skutečný převod peněžních prostředků tedy nejde."
  },
  {
    text: "VÚD - Předpis ztráty společníkům k úhradě",
    amount: "70000",
    md: "354",
    d: "431",
    explanation: "Pohledávky za společníky při úhradě ztráty se účtují na účet 354 na stranu MD. Zároveň snížíme ztrátu - strana Dal."
  },
  {
    text: "VÚD - Převedení ztráty na nerozdělenou ztrátu minulých let",
    amount: "40000",
    md: "429",
    d: "431",
    explanation: "V případě převodu ztráty na účet 429 opět nejde o úhradu. Avšak ztráta bude na tomto účtu viset. Ke konci BO účet 431 vykazovat žádný zůstatek, proto se ztráta musí převést. Zůstatek účtu 429 lze snižovat (nulovat) z účtu 428 v případě budoucího dosažení nerozděleného zisku."
  },
  {
    text: "VBÚ - zaplacení ztráty společníky",
    amount: "70000",
    md: "221",
    d: "354",
    explanation: "V tomto případě se jedná o skutečný příjem peněžních prostředků při úhradě ztráty, která byla předepsána společníkům."
  }
];

let accounts = [];

const norm = v => String(v ?? "").replace(/\s+/g, "").replace(/[.,-]/g, "").trim();

const esc = s => String(s).replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

async function loadAccounts() {
  try {
    const r = await fetch("../accounts.json", { cache: "no-store" });
    if (r.ok) accounts = await r.json();
  } catch (e) {
    accounts = [];
  }
}

function render() {
  document.getElementById("questions").innerHTML = questions.map((q, i) => `
    <article class="question" data-index="${i}">
      <div class="question-head">${i + 1}. ${q.text}</div>

      <div class="amount-row field-wrap">
        <label>Částka</label>
        <input class="amount-input" inputmode="numeric" autocomplete="off" data-type="amount">
      </div>

      <div class="account-grid">
        <div class="field-wrap">
          <label>MD</label>
          <input class="account-input" inputmode="numeric" autocomplete="off" data-type="md">
          <div class="suggestions"></div>
        </div>

        <div class="field-wrap">
          <label>D</label>
          <input class="account-input" inputmode="numeric" autocomplete="off" data-type="d">
          <div class="suggestions"></div>
        </div>
      </div>

      <div class="explanation" hidden></div>
    </article>
  `).join("");

  bindInputs();
}

function matches(q) {
  q = q.trim().toLowerCase();

  return (
    q
      ? accounts.filter(a =>
          String(a.code).includes(q) ||
          String(a.name).toLowerCase().includes(q)
        )
      : accounts
  ).slice(0, 30);
}

function closeAll(except) {
  document.querySelectorAll(".suggestions.open").forEach(x => {
    if (x !== except) x.classList.remove("open");
  });
}

function showSuggestions(input) {
  const box = input.parentElement.querySelector(".suggestions");
  const list = matches(input.value);

  box.innerHTML = list.map(a => `
    <button type="button" class="suggestion" data-code="${a.code}">
      <span class="suggestion-code">${a.code}</span>
      <span class="suggestion-name">${esc(a.name)}</span>
    </button>
  `).join("");

  box.classList.toggle("open", list.length > 0);
}

function bindInputs() {
  document.querySelectorAll(".account-input").forEach(input => {
    input.addEventListener("input", () => {
      showSuggestions(input);

      if (/^\d{3}$/.test(input.value) && input.dataset.type === "md") {
        input.closest(".question")
          .querySelector('[data-type="d"]')
          .focus();
      }
    });

    input.addEventListener("focus", () => {
      closeAll(input.parentElement.querySelector(".suggestions"));
      showSuggestions(input);
    });
  });

  document.addEventListener("click", e => {
    const s = e.target.closest(".suggestion");

    if (s) {
      const input = s.closest(".field-wrap").querySelector(".account-input");
      input.value = s.dataset.code;
      s.parentElement.classList.remove("open");

      if (input.dataset.type === "md") {
        input.closest(".question")
          .querySelector('[data-type="d"]')
          .focus();
      }

      return;
    }

    if (!e.target.closest(".field-wrap")) closeAll();
  });
}

function checkAll() {
  let correct = 0;

  questions.forEach((q, i) => {
    const c = document.querySelector(`[data-index="${i}"]`);
    const a = c.querySelector('[data-type="amount"]');
    const m = c.querySelector('[data-type="md"]');
    const d = c.querySelector('[data-type="d"]');
    const x = c.querySelector(".explanation");

    const ok = [
      norm(a.value) === norm(q.amount),
      norm(m.value) === norm(q.md),
      norm(d.value) === norm(q.d)
    ];

    [a, m, d].forEach((el, j) => {
      el.classList.remove("correct", "wrong");
      el.classList.add(ok[j] ? "correct" : "wrong");
    });

    if (ok.every(Boolean)) correct++;

    x.hidden = false;
    x.innerHTML = `<strong>Vysvětlení:</strong> ${q.explanation}`;
  });

  const total = questions.length;
  const p = Math.round(correct / total * 100);
  const r = document.getElementById("result");

  r.classList.remove("hidden");
  r.innerHTML = `
    <div class="result-title">Výsledek testu:</div>
    <div class="result-stats">
      <div class="result-stat">
        <span>Správně</span>
        <strong>${correct} / ${total}</strong>
      </div>
      <div class="result-stat">
        <span>Úspěšnost</span>
        <strong>${p} %</strong>
      </div>
      <div class="result-stat">
        <span>Chybně</span>
        <strong>${total - correct}</strong>
      </div>
    </div>
  `;

  const st = JSON.parse(
    localStorage.getItem("ucetnictvi_stats") ||
    '{"tests":0,"correct":0,"questions":0,"wrong":0}'
  );

  st.tests++;
  st.correct += correct;
  st.questions += total;
  st.wrong += total - correct;

  localStorage.setItem("ucetnictvi_stats", JSON.stringify(st));
}

document.getElementById("testForm").addEventListener("submit", e => {
  e.preventDefault();
  checkAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

loadAccounts().then(render);
