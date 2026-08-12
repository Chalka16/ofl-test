/*
  Účetnictví – Téma 1
  Účetní operace jsou převzaté z přiložených obrázků.
  Účetní osnova je načtena z accounts.json, vytvořeného z nahraného PDF.
*/

const questions = [
  {
    "id": 1,
    "text": "Základ daně FAP č. 1",
    "amountRequired": false,
    "md": "501",
    "d": "321",
    "explanation": "V průběhu účetního období se složky pořizovací ceny nakupovaných zásob účtují přímo do spotřeby – tedy u materiálu na účet 501."
  },
  {
    "id": 2,
    "text": "DPH 21 % k FAP č. 1",
    "amountRequired": false,
    "md": "343",
    "d": "321",
    "explanation": "Ačkoli základ daně účtujete do spotřeby (501), tak DPH vztahující se k tomuto materiálu účtujete na účet určený pro DPH, tedy 343."
  },
  {
    "id": 3,
    "text": "Příjemka materiálu na sklad",
    "amountRequired": false,
    "md": null,
    "d": null,
    "explanation": "Při účtování o zásobách způsobem B neúčtujeme o příjemkách ani o výdejkách.",
    "noPosting": true
  },
  {
    "id": 4,
    "text": "Základ daně FAV č. 1",
    "amountRequired": false,
    "md": "311",
    "d": "642",
    "explanation": "Při prodeji materiálu zaúčtujeme na stranu D výnosový účet určený pro tržbu z prodeje materiálu. Zde nemá vliv zp. metody B."
  },
  {
    "id": 5,
    "text": "DPH 21 % FAV č. 1",
    "amountRequired": false,
    "md": "311",
    "d": "343",
    "explanation": "Účtování o DPH na výstupu. Bez vlivu, zda-li účtujete zp. B nebo A."
  },
  {
    "id": 6,
    "text": "VÚD – Vyskladnění prodaného materiálu",
    "amountRequired": false,
    "md": null,
    "d": null,
    "explanation": "Při účtování o zásobách způsobem B neúčtujeme o vyskladnění prodaného materiálu.",
    "noPosting": true
  },
  {
    "id": 7,
    "text": "Výdejka materiálu do spotřeby",
    "amountRequired": false,
    "md": null,
    "d": null,
    "explanation": "Při účtování o zásobách způsobem B neúčtujeme o příjemkách ani o výdejkách.",
    "noPosting": true
  },
  {
    "id": 8,
    "text": "Základ daně FAP č. 2",
    "amountRequired": false,
    "md": "501",
    "d": "321",
    "explanation": "V průběhu účetního období se složky pořizovací ceny nakupovaných zásob účtují přímo do spotřeby – tedy u materiálu na účet 501."
  },
  {
    "id": 9,
    "text": "DPH 21 % k FAP č. 2",
    "amountRequired": false,
    "md": "343",
    "d": "321",
    "explanation": "DPH na vstupu. Účtujeme vždy takto, ať účtujeme podle metody A nebo B."
  },
  {
    "id": 10,
    "text": "VÚD – Převod počátečního stavu do spotřeby",
    "amountRequired": false,
    "md": "501",
    "d": "112",
    "explanation": "Na konci roku při uzavírání účetních knih převedeme konečný stav na účet 501 na straně MD. Na začátku následujícího roku pak převedeme tento stav opět na účet 501 na stranu DAL."
  },
  {
    "id": 11,
    "text": "VÚD – Zaúčtování konečného stavu materiálu na sklad",
    "amountRequired": false,
    "md": "112",
    "d": "501",
    "explanation": "Poslední transakce roku v oblasti materiálu účtovaným zp. B je převod z účtu 501 na účet 112 na straně MD."
  },
  {
    "id": 12,
    "text": "VÚD – Materiál podle FAP č. 2 ještě nebyl přijat na sklad",
    "amountRequired": false,
    "md": "119",
    "d": "501",
    "explanation": "Koncem roku může dojít k případům, že účetní jednotka obdrží fakturu od dodavatele za materiál, ale dodávka do konce roku nebude převzata na sklad. Pro tyto případy se použije účet 119 na straně MD. A protože byl materiál na základě FAP zaúčtován podle zp. B na účtu 501 na MD, musíme ho zaúčtovat na str. D účtu 501."
  },
  {
    "id": 13,
    "text": "VÚD – Počáteční zůstatek materiálu",
    "amountRequired": false,
    "md": "112",
    "d": "701",
    "explanation": "Na začátku roku otevíráme účetní knihy a počáteční stav materiálu účtujeme na str. MD účtu 112. Poté převedeme tento počáteční stav na účet 501 MD."
  },
  {
    "id": 14,
    "text": "Příjemka materiálu na sklad podle FAP č. 2 z minulého účetního období",
    "amountRequired": false,
    "md": "501",
    "d": "119",
    "explanation": "Při uplatnění způsobu B je zvláště nutné vést skladovou evidenci na analytických účtech, aby bylo možné zjistit a prokázat stav zásob v průběhu účetního období."
  }
];


const questionsContainer = document.getElementById("questions");
const form = document.getElementById("testForm");
const result = document.getElementById("result");

let currentQuestions = [...questions];
let accounts = [];

async function loadAccounts() {
  try {
    const response = await fetch("accounts.json", { cache: "no-store" });
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
    card.dataset.id = question.id;

    card.innerHTML = `
      <div class="question-number">OTÁZKA ${index + 1}</div>
      <p class="question-text">${question.text}</p>

      <div class="answer-grid ${question.noPosting ? "answer-grid-no-posting" : ""}">
        <div class="answer-cell">
          <label for="amount-${question.id}">Částka</label>
          <input
            class="answer-input amount-input"
            id="amount-${question.id}"
            name="amount-${question.id}"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder=""
          >
        </div>

        ${question.noPosting ? `
          <div class="no-posting-note">
            Tato operace se při účtování zásob způsobem B neúčtuje.
          </div>
        ` : `
          <div class="answer-cell">
            <label for="md-${question.id}">MD</label>
            <div class="account-field">
              <input
                class="answer-input md-input account-input"
                id="md-${question.id}"
                name="md-${question.id}"
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
            <label for="d-${question.id}">D</label>
            <div class="account-field">
              <input
                class="answer-input d-input account-input"
                id="d-${question.id}"
                name="d-${question.id}"
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
        `}
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
      const code = account.code.toLowerCase();
      const name = normalizeText(account.name);
      return code.includes(q) || name.includes(q);
    })
    .sort((a, b) => {
      const ac = a.code.toLowerCase();
      const bc = b.code.toLowerCase();
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

      return a.code.localeCompare(b.code);
    })
    .slice(0, 8);
}

function closeSuggestions(container) {
  const suggestions = container.querySelector(".account-suggestions");
  const input = container.querySelector(".account-input");

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

  // Po výběru účtu v MD přejdeme rovnou do D.
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

      // Pokud uživatel zadá přesně tři číslice do MD a jde o existující účet,
      // účet se potvrdí a kurzor přejde do D.
      const digits = input.value.replace(/\D/g, "");

      if (input.classList.contains("md-input") && digits.length === 3 && /^\d{3}$/.test(input.value.trim())) {
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

  // Hodnotíme číslo účtu; název je pouze pomocná forma zadávání.
  if (/^\d{3}$/.test(normalized)) {
    return normalized;
  }

  const found = accounts.find(account =>
    normalizeText(account.name) === normalizeText(value)
  );

  return found ? found.code : normalized;
}

function evaluateQuestion(card, question) {
  if (question.noPosting) {
    card.classList.remove("correct", "incorrect");
    card.classList.add("correct", "evaluated", "informational");
    return true;
  }

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

function getScoredQuestions(list) {
  return list.filter(question => !question.noPosting);
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

      const wrongQuestions = questions.filter(q => wrongIds.includes(q.id));

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

  currentQuestions.forEach(question => {
    const card = document.querySelector(
      `.question-card[data-id="${question.id}"]`
    );

    if (!card) return;

    const correct = evaluateQuestion(card, question);

    if (!question.noPosting && correct) {
      score += 1;
    }
  });

  const scoredQuestions = getScoredQuestions(currentQuestions);
  saveResult(score, scoredQuestions.length);
  showResult(score, scoredQuestions.length);
});

document.addEventListener("click", event => {
  if (!event.target.closest(".account-field")) {
    closeAllSuggestions();
  }
});

(async function init() {
  await loadAccounts();
  renderQuestions();
})();
