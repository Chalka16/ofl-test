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

}        ).join('');\
\
        card.innerHTML = `<div class="question-title">$\{q.q\}</div><div class="options">$\{optionsHTML\}</div>`;\
        container.appendChild(card);\
    \});\
\
    const submitBtn = document.createElement('button');\
    submitBtn.className = 'action-btn';\
    submitBtn.innerText = 'Vyhodnotit test';\
    submitBtn.onclick = evaluate;\
    container.appendChild(submitBtn);\
\}\
\
function selectOption(qIdx, optIdx) \{\
    userAnswers[qIdx] = optIdx;\
    const card = document.getElementById(`q-card-$\{qIdx\}`);\
    const btns = card.querySelectorAll('.option-btn');\
    btns.forEach((btn, i) => \{\
        btn.classList.toggle('selected', i === optIdx);\
    \});\
\}\
\
function evaluate() \{\
    let score = 0;\
    const total = questionsData.length;\
\
    questionsData.forEach((q, index) => \{\
        const card = document.getElementById(`q-card-$\{index\}`);\
        const btns = card.querySelectorAll('.option-btn');\
        const selected = userAnswers[index];\
\
        btns.forEach((btn, optIdx) => \{\
            btn.disabled = true;\
            btn.classList.remove('selected');\
            if (optIdx === q.answer) btn.classList.add('correct');\
            if (selected === optIdx && selected !== q.answer) btn.classList.add('incorrect');\
        \});\
\
        if (selected === q.answer) score++;\
    \});\
\
    const pct = Math.round((score / total) * 100);\
    \
    let oldResult = document.querySelector('.result-box');\
    if (oldResult) oldResult.remove();\
\
    const resultDiv = document.createElement('div');\
    resultDiv.className = 'result-box';\
    resultDiv.innerHTML = `\
        <h2 class="$\{pct >= 90 ? 'pass' : 'fail'\}">$\{pct >= 90 ? 'PRO\'8aEL/A JSTE!' : 'NEPRO\'8aEL/A JSTE'\}</h2>\
        <p><strong>Sk\'f3re: $\{score\} z $\{total\} ($\{pct\} %)</strong></p>\
        <p style="font-size: 0.85em; color: #8e8e93;">Pro \'fasp\uc0\u283 ch je pot\u345 eba 90 %.</p>\
        <button class="action-btn" onclick="renderQuiz()">Zkusi\uc0\u357  znovu</button>\
    `;\
    document.getElementById('main-content').prepend(resultDiv);\
    window.scrollTo(\{ top: 0, behavior: 'smooth' \});\
\}\
}
