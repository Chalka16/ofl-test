const questions = [
  {
    text: "A.s. bude v důsledku těchto uvedených skutečností v roce 2024 časově rozlišovat:",
    options: [
      "Příjmy z pronájmu - zvýšení příjmů příštích období",
      "Výnosy z pronájmů - zvýšení výnosů příštích období",
      "Příjmy a výnosy z pronájmu - zvýšení příjmů a výnosů příštích období",
      "Příjmy a výnosy dle uvážení"
    ],
    correct: 1,
    explanation: "Peníze za 3 měsíce z roku 2025 již zaplaceny (interval půlročních plateb), avšak výkon se uskuteční až v budoucnu - nejedná se tedy o příjem v budoucnu, ale o výnos příštího období"
  },
  {
    text: "Výnosy a.s. z pronájmu v roce 2024:",
    options: [
      "30 000,-",
      "18 000,-",
      "15 000,-",
      "9 000,-"
    ],
    correct: 3,
    explanation: "Výnosy z pronájmu budou započítány za měsíc říjen, listopad a prosinec 2024"
  },
  {
    text: "Časové rozlišení a.s. v roce 2024",
    options: [
      "0,-",
      "15 000,-",
      "9 000,-",
      "18 000,-"
    ],
    correct: 2,
    explanation: "Placeno v půlročních intervalech - tedy nájemné na 3 měsíce z roku 2025 musí být časově rozlišeno"
  },
  {
    text: "Časové rozlišení se v účetní závěrce 2025 oproti roku 2024:",
    options: [
      "Sníží",
      "Zvýší",
      "Zůstane ve stejné výši",
      "Nelze určit"
    ],
    correct: 2,
    explanation: "Zůstane stejné, neboť bude opět hrazeno v půlročním intervalu předem, nájemné na měsíce leden, únor a březen z roku 2026"
  }
];

const questionsEl = document.getElementById("questions");
const form = document.getElementById("testForm");
const result = document.getElementById("result");
const checkButton = document.getElementById("checkButton");

function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function render() {
  questionsEl.innerHTML = questions.map((q, i) => `
    <article class="mc-question" data-index="${i}">
      <span class="mc-mark" aria-hidden="true"></span>
      <h2 class="mc-title">${i + 1}. ${esc(q.text)}</h2>

      <div class="mc-options">
        ${q.options.map((option, optionIndex) => `
          <label class="mc-option" data-option="${optionIndex}">
            <input
              type="radio"
              name="question-${i}"
              value="${optionIndex}"
              autocomplete="off"
            >
            <span>${String.fromCharCode(97 + optionIndex)}) ${esc(option)}</span>
          </label>
        `).join("")}
      </div>

      <div class="mc-correct-answer">
        Správná odpověď: ${String.fromCharCode(97 + q.correct)}) ${esc(q.options[q.correct])}
      </div>

      <div class="mc-explanation">
        <strong>Vysvětlení:</strong> ${esc(q.explanation)}
      </div>
    </article>
  `).join("");
}

function checkAll() {
  let correct = 0;

  questions.forEach((q, i) => {
    const card = document.querySelector(`[data-index="${i}"]`);
    const selected = card.querySelector(`input[name="question-${i}"]:checked`);
    const selectedIndex = selected ? Number(selected.value) : -1;
    const isCorrect = selectedIndex === q.correct;

    card.classList.remove("correct", "incorrect");
    card.classList.add(isCorrect ? "correct" : "incorrect");
    card.classList.add("evaluated");

    card.querySelectorAll(".mc-option").forEach(option => {
      option.classList.remove("correct-option", "wrong-option");
      const index = Number(option.dataset.option);

      if (index === q.correct) option.classList.add("correct-option");
      if (index === selectedIndex && selectedIndex !== q.correct) {
        option.classList.add("wrong-option");
      }
    });

    const mark = card.querySelector(".mc-mark");
    mark.textContent = isCorrect ? "✓" : "✕";

    if (isCorrect) correct++;
  });

  const total = questions.length;
  const wrong = total - correct;
  const percent = Math.round((correct / total) * 100);

  result.classList.remove("hidden");
  result.innerHTML = `
    <div class="mc-result-heading">Výsledek testu: Účtování časového rozlišení</div>

    <div class="mc-result-row">
      <div class="mc-result-percent">${percent}%</div>
      <div class="mc-result-summary">
        <div>Správné odpovědi: <strong>${correct}x</strong></div>
        <div>Špatné odpovědi: <strong>${wrong}x</strong></div>
      </div>
    </div>

    <div class="mc-result-actions">
      <button class="mc-result-button primary" id="showTopics" type="button">
        « Zobrazit nabídku všech testů
      </button>
      <button class="mc-result-button secondary" id="repeatTest" type="button">
        Vyplnit tento test znovu
      </button>
    </div>
  `;

  const stats = JSON.parse(
    localStorage.getItem("ucetnictvi_stats") ||
    '{"tests":0,"correct":0,"questions":0,"wrong":0}'
  );

  stats.tests++;
  stats.correct += correct;
  stats.questions += total;
  stats.wrong += wrong;

  localStorage.setItem("ucetnictvi_stats", JSON.stringify(stats));

  checkButton.disabled = true;
  checkButton.textContent = "Test vyhodnocen";

  document.getElementById("showTopics").onclick = () => {
    window.location.href = "../index.html";
  };

  document.getElementById("repeatTest").onclick = resetTest;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetTest() {
  document.querySelectorAll("input[type='radio']").forEach(input => {
    input.checked = false;
  });

  document.querySelectorAll(".mc-question").forEach(card => {
    card.classList.remove("correct", "incorrect", "evaluated");
    card.querySelector(".mc-mark").textContent = "";

    card.querySelectorAll(".mc-option").forEach(option => {
      option.classList.remove("correct-option", "wrong-option");
    });
  });

  result.classList.add("hidden");
  result.innerHTML = "";
  checkButton.disabled = false;
  checkButton.textContent = "Vyhodnotit test";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  checkAll();
});

render();
