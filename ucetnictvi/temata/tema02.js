/*
  Účetnictví – Téma 2
  Účetní operace jsou převzaté z přiložených obrázků.
  Účetní osnova je načtena z accounts.json.
*/

const questions = [
  {
    "id": 1,
    "text": "VBÚ – zaplacena záloha na pořízení stroje v celkové částce 50 000,- Kč",
    "amountRequired": false,
    "amount": "50000",
    "md": "052",
    "d": "221",
    "explanation": "Zálohy na dlouhodobý hmotný majetek se účtují na účet 052 na straně MD."
  },
  {
    "id": 2,
    "text": "Daňový doklad k poskytnuté záloze, DPH 21 % činí 8 678,- Kč",
    "amountRequired": false,
    "amount": "8678",
    "md": "343",
    "d": "052",
    "explanation": "Účetní jednotka má nárok na odpočet daně z přidané hodnoty, proto účtujeme DPH na straně MD."
  },
  {
    "id": 3,
    "text": "FAP od dodavatele za stroj v celkové částce 201 659,- Kč – základ daně 166 660,- Kč",
    "amountRequired": false,
    "amount": "166660",
    "md": "042",
    "d": "321",
    "explanation": "Do hodnoty pořízeného majetku musíme započíst celou částku základu daně. Zatím zálohu z účtované částky neodečítáme."
  },
  {
    "id": 4,
    "text": "DPH 21 % činí 34 999,- Kč",
    "amountRequired": false,
    "amount": "34999",
    "md": "343",
    "d": "321",
    "explanation": "Částka DPH vztahující se k celkové hodnotě faktury."
  },
  {
    "id": 5,
    "text": "VÚD – Zúčtování zálohy – základ daně 41 322,- Kč",
    "amountRequired": false,
    "amount": "41322",
    "md": "321",
    "d": "052",
    "explanation": "V tomto bodě musíme odúčtovat zálohu z celkové výše závazku. Závazek se tedy snižuje, proto účet 321 na str. MD. Pohledávka za dodavatelem, která byla vytvořena zálohou se vynuluje účtem 052 na str. D."
  },
  {
    "id": 6,
    "text": "VÚD – Zúčtování zálohy – DPH 8 678,- Kč",
    "amountRequired": false,
    "amount": "8678",
    "md": "321",
    "d": "343",
    "explanation": "Odpočet DPH byl již nárokován v poskytnuté záloze. Z celkové hodnoty DPH na FAP ho tedy musíme odúčtovat z nároku na odpočet (tedy ze strany MD)."
  },
  {
    "id": 7,
    "text": "VPD – hotově zaplaceno za montáž stroje 5 000,- Kč",
    "amountRequired": false,
    "amount": "5000",
    "md": "042",
    "d": "211",
    "explanation": "Hodnota montáže připočtena k hodnotě majetku určeného do zařazení."
  },
  {
    "id": 8,
    "text": "VÚD – Zařazení stroje do užívání 171 660,- Kč",
    "amountRequired": false,
    "amount": "171660",
    "md": "022",
    "d": "042",
    "explanation": "Při zařazení započteme do částky hodnotu základu DPH a hodnotu montáže stroje."
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

function normalizeAmount(value) {
  return value.replace(/\\s/g, "").replace(",", ".").trim();
}

function evaluateQuestion(card, question) {
  if (question.noPosting) {
    card.classList.remove("correct", "incorrect");
    card.classList.add("correct", "evaluated", "informational");
    return true;
  }

  const md = normalizeAndCheckAccount(card.querySelector(".md-input").value);
  const d = normalizeAndCheckAccount(card.querySelector(".d-input").value);

  // Částka je v tomto testu pouze informativní.
  // Neúčastní se vyhodnocení správnosti odpovědi.
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

    const amountText = question.amountRequired ? `Částka ${Number(question.amount).toLocaleString("cs-CZ")} · ` : "";
    answer.textContent = `Správně: ${amountText}MD ${question.md} · D ${question.d}`;
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
