let questionsData = [];
let userAnswers = {};
let testFinished = false;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("./questions.json")
        .then(res => res.json())
        .then(data => {
            document.getElementById("app-title").innerText = data.title || "OFL Test";
            questionsData = data.questions || [];
            renderQuiz();
        });
});

function renderQuiz() {

    testFinished = false;
    userAnswers = {};

    const container = document.getElementById("main-content");
    container.innerHTML = "";

    questionsData.forEach((q, index) => {

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
                        onchange="selectAnswer(${index},${optIndex})">

                    <span>${opt}</span>
                </label>
            `;
        });

        card.innerHTML = `
            <h3>${q.q || q.question}</h3>
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

    questionsData.forEach((q, index) => {

        const correct = q.answer ?? q.correct;
        const selected = userAnswers[index];

        q.options.forEach((opt, optIndex) => {

            const option = document.getElementById(`q-${index}-o-${optIndex}`);
            const radio = option.querySelector("input");

            option.classList.remove("correct");
            option.classList.remove("incorrect");

            radio.disabled = true;
            option.classList.add("disabled");

        });

        document
            .getElementById(`q-${index}-o-${correct}`)
            .classList.add("correct");

        if (selected !== undefined && selected !== correct) {

            document
                .getElementById(`q-${index}-o-${selected}`)
                .classList.add("incorrect");

        }

        if (selected === correct)
            correctCount++;

    });

    const percentage = Math.round(correctCount / questionsData.length * 100);

    const oldResult = document.getElementById("result-box");

    if (oldResult)
        oldResult.remove();

    const result = document.createElement("div");
    result.className = "result-box";
    result.id = "result-box";

    result.innerHTML = `
        <h2>${percentage >= 90 ? "✅ Test splněn" : "❌ Test nesplněn"}</h2>

        <p><strong>${correctCount}</strong> z <strong>${questionsData.length}</strong> správně</p>

        <h3 class="${percentage>=90 ? "pass":"fail"}">
            ${percentage} %
        </h3>

        <p>Požadovaná úspěšnost: 90 %</p>
    `;

    document
        .getElementById("main-content")
        .prepend(result);

    const restart = document.createElement("button");

    restart.className = "btn-submit";

    restart.innerText = "Opakovat test";

    restart.onclick = renderQuiz;

    document
        .getElementById("main-content")
        .appendChild(restart);

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}
