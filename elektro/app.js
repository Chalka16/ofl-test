let originalQuestionsData = [];
let activeQuestions = [];
let userAnswers = {};
let testFinished = false;
let userAnswersHistory = {};

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("./questions.json")
        .then(res => res.json())
        .then(data => {
            document.getElementById("app-title").innerText = data.title || "OFL Test";
            originalQuestionsData = data.questions || [];
            startNewTest(false);
        })
        .catch(err => {
            console.error("Nepodařilo se načíst otázky:", err);
        });
});

function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startNewTest(onlyIncorrect = false) {
    testFinished = false;
    userAnswers = {};

    let sourceQuestions = originalQuestionsData;

    if (onlyIncorrect) {
        sourceQuestions = originalQuestionsData.filter((q, index) => {
            return userAnswersHistory[index] !== true;
        });
        if (sourceQuestions.length === 0) {
            sourceQuestions = originalQuestionsData;
        }
    }

    // Náhodné pořadí otázek
    const shuffledQuestions = shuffleArray(sourceQuestions);

    // Náhodné pořadí odpovědí pro každou otázku
    activeQuestions = shuffledQuestions.map(q => {
        let optionsWithIndex = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
        let shuffledOptions = shuffleArray(optionsWithIndex);
        
        const correctOriginalIndex = q.answer ?? q.correct;
        let newCorrectIndex = shuffledOptions.findIndex(o => o.originalIndex === correctOriginalIndex);

        return {
            q: q.q || q.question,
            options: shuffledOptions.map(o => o.text),
            answer: newCorrectIndex,
            originalGlobalIndex: originalQuestionsData.indexOf(q)
        };
    });

    renderQuiz();
}

function renderQuiz() {
    const container = document.getElementById("main-content");
    container.innerHTML = "";

    if (activeQuestions.length === 0) {
        container.innerHTML = `<div class="card" style="text-align:center;"><h3>Nemáte žádné chybné otázky k procvičení! 🎉</h3></div>`;
        const restartBtn = document.createElement("button");
        restartBtn.className = "btn-submit";
        restartBtn.innerText = "Spustit celý test znovu";
        restartBtn.onclick = () => startNewTest(false);
        container.appendChild(restartBtn);
        return;
    }

    activeQuestions.forEach((q, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.id = `q-${index}`;

        let optionsHTML = "";
        q.options.forEach((opt, optIndex) => {
            optionsHTML += `
                <label class="option" id="q-${index}-o-${optIndex}">
                    <input
                        type="radio"
                        name="q-${index}"
                        value="${optIndex}"
                        onchange="selectAnswer(${index}, ${optIndex})">
                    <span>${opt}</span>
                </label>
            `;
        });

        card.innerHTML = `
            <h3>${q.q}</h3>
            <div class="options">
                ${optionsHTML}
            </div>
        `;

        container.appendChild(card);
    });

    const btn = document.createElement("button");
    btn.className = "btn-submit";
    btn.innerText = "Vyhodnotit test";
    btn.onclick = evaluateQuiz;

    container.appendChild(btn);
}

function selectAnswer(question, answer) {
    if (testFinished) return;
    userAnswers[question] = answer;
}

function evaluateQuiz() {
    if (testFinished) return;
    testFinished = true;

    let correctCount = 0;

    activeQuestions.forEach((q, index) => {
        const correct = q.answer;
        const selected = userAnswers[index];

        if (selected === correct) {
            userAnswersHistory[q.originalGlobalIndex] = true;
            correctCount++;
        } else {
            userAnswersHistory[q.originalGlobalIndex] = false;
        }

        q.options.forEach((opt, optIndex) => {
            const option = document.getElementById(`q-${index}-o-${optIndex}`);
            const radio = option.querySelector("input");

            option.classList.remove("correct", "incorrect");
            radio.disabled = true;
            option.classList.add("disabled");
        });

        // Správná odpověď vždy zeleně
        document.getElementById(`q-${index}-o-${correct}`).classList.add("correct");

        // Špatně vybraná odpověď uživatelem červeně
        if (selected !== undefined && selected !== correct) {
            document.getElementById(`q-${index}-o-${selected}`).classList.add("incorrect");
        }
    });

    const percentage = Math.round((correctCount / activeQuestions.length) * 100);

    const oldResult = document.getElementById("result-box");
    if (oldResult) oldResult.remove();

    const result = document.createElement("div");
    result.className = "result-box";
    result.id = "result-box";

    result.innerHTML = `
        <h2>${percentage >= 90 ? "✅ Test splněn" : "❌ Test nesplněn"}</h2>
        <p><strong>${correctCount}</strong> z <strong>${activeQuestions.length}</strong> správně</p>
        <h3 class="${percentage >= 90 ? "pass" : "fail"}">${percentage} %</h3>
        <p>Požadovaná úspěšnost: 90 %</p>
    `;

    document.getElementById("main-content").prepend(result);

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "actions-group";

    const restart = document.createElement("button");
    restart.className = "btn-submit";
    restart.innerText = "Opakovat celý test";
    restart.onclick = () => startNewTest(false);
    actionsContainer.appendChild(restart);

    const hasErrors = Object.values(userAnswersHistory).includes(false);
    if (hasErrors) {
        const retryErrorsBtn = document.createElement("button");
        retryErrorsBtn.className = "btn-submit btn-secondary";
        retryErrorsBtn.innerText = "Opakovat pouze chybné odpovědi";
        retryErrorsBtn.onclick = () => startNewTest(true);
        actionsContainer.appendChild(retryErrorsBtn);
    }

    document.getElementById("main-content").appendChild(actionsContainer);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

