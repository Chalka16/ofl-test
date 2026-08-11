/*
  Zkušební Téma 1
  Otázky převzaté pouze z přiložených obrázků.
  V obrázcích nejsou uvedeny konkrétní částky,
  proto se v této prototypové verzi částka nevyhodnocuje.
*/

const questions = [
  {
    id: 1,
    text: "VPD – Vklad peněz z pokladny na bankovní účet",
    amountRequired: false,
    md: "261",
    d: "211",
    explanation: "Účet 221 se účtuje až na základě výpisu z bankovního účtu."
  },
  {
    id: 2,
    text: "VBU – Vklad peněz",
    amountRequired: false,
    md: "221",
    d: "261",
    explanation: "Vyrovnání účtu 261 a přírůstek na účet 221 na základě výpisu z bankovního účtu."
  },
  {
    id: 3,
    text: "PPD – Výběr peněz z bankovního účtu",
    amountRequired: false,
    md: "211",
    d: "261",
    explanation: "O úbytku peněz budeme účtovat až na základě bankovního výpisu."
  },
  {
    id: 4,
    text: "VBU – Výběr peněz na přepážce",
    amountRequired: false,
    md: "261",
    d: "221",
    explanation: "Máme k dispozici bankovní výpis, můžeme účtovat úbytek na bankovním účtu."
  }
];

const questionsContainer = document.getElementById("questions");
const form = document.getElementById("testForm");
const result = document.getElementById("result");
let currentQuestions = [...questions];

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

      <div class="answer-grid">
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

        <div class="answer-cell">
          <label for="md-${question.id}">MD</label>
          <input
            class="answer-input md-input"
            id="md-${question.id}"
            name="md-${question.id}"
            type="text"
            inputmode="numeric"
            autocomplete="off"
          >
        </div>

        <div class="answer-cell">
          <label for="d-${question.id}">D</label>
          <input
            class="answer-input d-input"
            id="d-${question.id}"
            name="d-${question.id}"
            type="text"
            inputmode="numeric"
            autocomplete="off"
          >
        </div>
      </div>

      <div class="question-explanation">
        <strong>Vysvětlení</strong>
        <span>${question.explanation}</span>
      </div>
    `;

    questionsContainer.appendChild(card);
  });
}

function normalizeAccount(value) {
  return value.trim().replace(/\s+/g, "");
}

function evaluateQuestion(card, question) {
  const md = normalizeAccount(card.querySelector(".md-input").value);
  const d = normalizeAccount(card.querySelector(".d-input").value);

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
  const old = JSON.parse(localStorage.getItem(key) || '{"tests":0,"correct":0,"questions":0,"wrong":0}');

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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let score = 0;

  // Vyhodnocujeme pouze otázky, které jsou právě zobrazené.
  // To je důležité hlavně při režimu „Opakovat chybné“.
  currentQuestions.forEach((question) => {
    const card = document.querySelector(`.question-card[data-id="${question.id}"]`);

    if (!card) return;

    if (evaluateQuestion(card, question)) {
      score += 1;
    }
  });

  saveResult(score, currentQuestions.length);
  showResult(score, currentQuestions.length);
});

renderQuestions();
