/*
  Účetnictví – Téma 5
  Účetní operace jsou převzaté z podkladů.
  Účetní osnova je načtena z accounts.json.
*/

const questions = [
  {
    id: 1,
    text: "VÚD - Počáteční zůstatek Výsledku hospodaření",
    amount: "300000",
    md: "431",
    d: "701",
    explanation: "Ztráta má počáteční zůstatek na straně MD účtu 431 (v případě zisku by se HV účtoval stále na stejný účet 431, avšak na str. D)."
  },
  {
    id: 2,
    text: "VÚD - Úhrada ztráty z rezervního fondu",
    amount: "40000",
    md: "421",
    d: "431",
    explanation: "Snížíme zákonný rezervní fond (strana MD) a zároveň snížíme ztrátu zaúčtováním účtu 431 na stranu Dal."
  },
  {
    id: 3,
    text: "VÚD - Úhrada ztráty z nerozděleného zisku minulých let",
    amount: "150000",
    md: "428",
    d: "431",
    explanation: "Ztrátu lze uhradit z účtu 428, na který ÚJ v minulých obdobích účtovala dosažený nerozdělený zisk. Jedná se pouze o účetní termín „úhrady“. Vidíte, že úhrada není účtována ani z účtu 211 nebo 221, o skutečný převod peněžních prostředků tedy nejde."
  },
  {
    id: 4,
    text: "VÚD - Předpis ztráty společníkům k úhradě",
    amount: "70000",
    md: "354",
    d: "431",
    explanation: "Pohledávky za společníky při úhradě ztráty se účtují na účet 354 na stranu MD. Zároveň snížíme ztrátu - strana Dal."
  },
  {
    id: 5,
    text: "VÚD - Převedení ztráty na nerozdělenou ztrátu minulých let",
    amount: "40000",
    md: "429",
    d: "431",
    explanation: "V případě převodu ztráty na účet 429 opět nejde o úhradu. Avšak ztráta bude na tomto účtu viset. Ke konci BO účet 431 vykazovat žádný zůstatek, proto se ztráta musí převést. Zůstatek účtu 429 lze snižovat (nulovat) z účtu 428 v případě budoucího dosažení nerozděleného zisku."
  },
  {
    id: 6,
    text: "VBÚ - zaplacení ztráty společníky",
    amount: "70000",
    md: "221",
    d: "354",
    explanation: "V tomto případě se jedná o skutečný příjem peněžních prostředků při úhradě ztráty, která byla předepsána společníkům."
  }
];

const questionsContainer = document.getElementById("questions");
const form = document.getElementById("testForm");
const result = document.getElementById("result");

let currentQuestions = [...questions];
let accounts = [];

async function loadAccounts() {
  try {
    const response = await fetch("../accounts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Nelze načíst účtovou osnovu.");
    accounts = await response.json();
  } catch (error) {
    console.error(error);
    accounts = [];
  }
}

function normalizeText(value) {
  return value
    .toLocaleLowerCase("cs-CZ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizeAccount(value) {
  return value.trim().replace(/\s+/g, "");
}

function renderQuestions(list = questions) {
  currentQuestions = [...list];
  questionsContainer.innerHTML = "";

  list.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    card.dataset.id = question.id ?? index + 1;

    card.innerHTML = `
      <div class="question-number">OTÁZKA ${index + 1}</div>
      <p class="question-text">${question.text}</p>

      <div class="answer-grid">
        <div class="answer-cell">
          <label for="amount-${card.dataset.id}">Částka</label>
          <input
            class="answer-input amount-input"
            id="amount-${card.dataset.id}"
            name="amount-${card.dataset.id}"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder=""
          >
        </div>

        <div class="answer-cell">
          <label for="md-${card.dataset.id}">MD</label>
          <div class="account-field">
            <input
              class="answer-input md-input account-input"
              id="md-${card.dataset.id}"
              name="md-${card.dataset.id}"
              type="text"
              inputmode="text"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              aria-autocomplete="list"
              aria-expanded="false"
            >
            <div class="account-suggestions" role="listbox" aria-label="Nabídka účtů MD"></div>
          </div>
        </div>

        <div class="answer-cell">
          <label for="d-${card.dataset.id}">D</label>
          <div class="account-field">
            <input
              class="answer-input d-input account-input"
              id="d-${card.dataset.id}"
              name="d-${card.dataset.id}"
              type="text"
              inputmode="text"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              aria-autocomplete="list"
              aria-expanded="false"
            >
            <div class="account-suggestions" role="listbox" aria-label="Nabídka účtů D"></div>
          </div>
        </div>
      </div>

      <div class="question-explanation">
        <strong>Vysvětlení</strong>
        <span>${question.explanation}</span>
      </div>
    `;

    questionsContainer.appendChild(card);
  });

  attachAccountAutocomplete();
}

function findAccounts(query) {
  const q = normalizeText(query);
  if (!q) return [];

  return accounts
    .filter(account => {
      const code = String(account.code).toLowerCase();
      const name = normalizeText(account.name);
      return code.includes(q) || name.includes(q);
    })
    .sort((a, b) => {
      const ac = String(a.code).toLowerCase();
      const bc = String(b.code).toLowerCase();
      const an = normalizeText(a.name);
      const bn = normalizeText(b.name);

      const aCodeExact = ac === q;
      const bCodeExact = bc === q;
      if (aCodeExact !== bCodeExact) return aCodeExact ? -1 : 1;

      const aCodeStart = ac.startsWith(q);
      const bCodeStart = bc.startsWith(q);
      if (aCodeStart !== bCodeStart) return aCodeStart ? -1 : 1;

      const aNameStart = an.startsWith(q);
      const bNameStart = bn.startsWith(q);
      if (aNameStart !== bNameStart) return aNameStart ? -1 : 1;

      return String(a.code).localeCompare(String(b.code));
    })
    .slice(0, 8);
}

function closeSuggestions(container) {
  const suggestions = container?.querySelector(".account-suggestions");
  const input = container?.querySelector(".account-input");

  if (!suggestions) return;

  suggestions.classList.remove("open");
  input?.setAttribute("aria-expanded", "false");
}

function closeAllSuggestions(except = null) {
  document.querySelectorAll(".account-field").forEach(field => {
    if (field !== except) closeSuggestions(field);
  });
}

function selectAccount(input, account) {
  input.value = account.code;

  const field = input.closest(".account-field");
  closeSuggestions(field);

  if (input.classList.contains("md-input")) {
    const card = input.closest(".question-card");
    const dInput = card?.querySelector(".d-input");
    dInput?.focus();
  }
}

function showSuggestions(input) {
  const field = input.closest(".account-field");
  const suggestions = field?.querySelector(".account-suggestions");

  if (!field || !suggestions) return;

  closeAllSuggestions(field);

  const matches = findAccounts(input.value);

  if (!input.value.trim()) {
    closeSuggestions(field);
    return;
  }

  if (matches.length === 0) {
    suggestions.innerHTML = `<div class="account-empty">Účet nebyl nalezen.</div>`;
    suggestions.classList.add("open");
    input.setAttribute("aria-expanded", "true");
    return;
  }

  suggestions.innerHTML = matches.map(account => `
    <button class="account-option" type="button" data-code="${account.code}">
      <span class="account-code">${account.code}</span>
      <span class="account-name">${account.name}</span>
    </button>
  `).join("");

  suggestions.querySelectorAll(".account-option").forEach(option => {
    option.addEventListener("mousedown", event => {
      event.preventDefault();
      const account = accounts.find(item => item.code === option.dataset.code);
      if (account) selectAccount(input, account);
    });
  });

  suggestions.classList.add("open");
  suggestions.scrollTop = 0;
  input.setAttribute("aria-expanded", "true");
}

function attachAccountAutocomplete() {
  document.querySelectorAll(".account-input").forEach(input => {
    input.addEventListener("input", () => {
      showSuggestions(input);

      const digits = input.value.replace(/\D/g, "");

      if (
        input.classList.contains("md-input") &&
        digits.length === 3 &&
        /^\d{3}$/.test(input.value.trim())
      ) {
        const account = accounts.find(item => item.code === digits);

        if (account) {
          input.value = account.code;
          const field = input.closest(".account-field");
          closeSuggestions(field);

          const card = input.closest(".question-card");
          card?.querySelector(".d-input")?.focus();
        }
      }
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) showSuggestions(input);
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeSuggestions(input.closest(".account-field"));
      }
    });
  });
}

function normalizeAndCheckAccount(value) {
  const normalized = normalizeAccount(value);

  if (/^\d{3}$/.test(normalized)) return normalized;

  const found = accounts.find(account =>
    normalizeText(account.name) === normalizeText(value)
  );

  return found ? found.code : normalized;
}

function evaluateQuestion(card, question) {
  const md = normalizeAndCheckAccount(card.querySelector(".md-input").value);
  const d = normalizeAndCheckAccount(card.querySelector(".d-input").value);

  const correct = md === question.md && d === question.d;

  card.classList.remove("correct", "incorrect");
  card.classList.add(correct ? "correct" : "incorrect", "evaluated");

  const explanation = card.querySelector(".question-explanation");

  if (!correct) {
    let answer = explanation.querySelector(".correct-answer");

    if (!answer) {
      answer = document.createElement("div");
      answer.className = "correct-answer";
      explanation.appendChild(answer);
    }

    answer.textContent = `Správně: MD ${question.md} · D ${question.d}`;
  }

  return correct;
}

function saveResult(score, total) {
  const key = "ucetnictvi_stats";
  const old = JSON.parse(
    localStorage.getItem(key) ||
    '{"tests":0,"correct":0,"questions":0,"wrong":0}'
  );

  old.tests += 1;
  old.correct += score;
  old.questions += total;
  old.wrong += total - score;

  localStorage.setItem(key, JSON.stringify(old));
}

function showResult(score, total) {
  const percent = Math.round((score / total) * 100);
  const wrong = total - score;

  result.classList.remove("hidden");

  result.innerHTML = `
    <div class="eyebrow">VÝSLEDEK TESTU</div>
    <div class="result-score">${score} / ${total}</div>
    <div class="result-percent">${percent} %</div>
    <div class="result-message">
      ${wrong === 0
        ? "Výborně. Všechny odpovědi jsou správně."
        : `Chybně: ${wrong} ${wrong === 1 ? "otázka" : "otázky"}.`}
    </div>

    ${wrong > 0 ? `
      <button class="retry-wrong-button" id="retryWrong" type="button">
        Opakovat chybné
      </button>
    ` : ""}

    <button class="retry-button" id="retryAll" type="button">
      Opakovat celý test
    </button>
  `;

  document.getElementById("retryAll").addEventListener("click", () => {
    renderQuestions(questions);
    result.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (wrong > 0) {
    document.getElementById("retryWrong").addEventListener("click", () => {
      const wrongIds = [...document.querySelectorAll(".question-card.incorrect")]
        .map(card => Number(card.dataset.id));

      const wrongQuestions = questions.filter((q, index) =>
        wrongIds.includes(Number(q.id ?? index + 1))
      );

      renderQuestions(wrongQuestions);
      result.classList.add("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  let score = 0;

  currentQuestions.forEach((question, index) => {
    const id = question.id ?? index + 1;
    const card = document.querySelector(`.question-card[data-id="${id}"]`);

    if (!card) return;

    if (evaluateQuestion(card, question)) score += 1;
  });

  saveResult(score, currentQuestions.length);
  showResult(score, currentQuestions.length);
});

document.addEventListener("click", event => {
  if (!event.target.closest(".account-field")) closeAllSuggestions();
});

(async function init() {
  await loadAccounts();
  renderQuestions();
})();
