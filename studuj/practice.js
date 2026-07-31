"use strict";

// ======================================
// PROCVIČOVÁNÍ STANDARDNÍCH FRÁZÍ
// ======================================

let phraseQuestions = [];
let phraseMistakes = [];

let phraseIndex = 0;
let phraseCorrect = 0;
let phraseWrong = 0;

const practiceSection = document.getElementById("practiceSection");

const practiceQuestion =
    document.getElementById("practice-question");

const practiceProgress =
    document.getElementById("practice-progress");

const practiceInput =
    document.getElementById("practice-input");

const practiceFeedback =
    document.getElementById("practice-feedback");

const statCorrect =
    document.getElementById("stat-correct");

const statWrong =
    document.getElementById("stat-wrong");

const statPercent =
    document.getElementById("stat-percent");

const btnCheck =
    document.getElementById("btn-check");

const btnNext =
    document.getElementById("btn-next");

const btnRepeat =
    document.getElementById("btn-repeat");


// ======================================
// NORMALIZACE TEXTU
// ======================================

function normalizeText(text) {

    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

}


// ======================================
// ZAMÍCHÁNÍ POLE
// ======================================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}


// ======================================
// SPUŠTĚNÍ TESTU
// ======================================

function startPhrasePractice(repeatWrong = false) {

    phraseIndex = 0;

    practiceFeedback.textContent = "";

    practiceSection.hidden = false;

    if (!repeatWrong) {

        phraseQuestions = [];

        phraseMistakes = [];

        phraseCorrect = 0;

        phraseWrong = 0;

        document.querySelectorAll(".phrase-card").forEach(card => {

            const title =
                card.querySelector(".phrase-title");

            const subtitle =
                card.querySelector(".phrase-subtitle");

            if (!title) return;

            phraseQuestions.push({

                answer: title.innerText.trim(),

                question: subtitle
                    ? subtitle.innerText.trim()
                    : "Napiš správnou frázi"

            });

        });

        shuffle(phraseQuestions);

    } else {

        phraseQuestions = [...phraseMistakes];

        phraseMistakes = [];

        phraseIndex = 0;

    }

    statCorrect.textContent = phraseCorrect;

    statWrong.textContent = phraseWrong;

    statPercent.textContent = "0 %";

    showPhraseQuestion();

}

// ======================================
// ZOBRAZENÍ OTÁZKY
// ======================================

function showPhraseQuestion() {

    if (phraseIndex >= phraseQuestions.length) {
        finishPhrasePractice();
        return;
    }

    const item = phraseQuestions[phraseIndex];

    practiceQuestion.textContent = item.question;

    practiceProgress.textContent =
        `${phraseIndex + 1} / ${phraseQuestions.length}`;

    practiceInput.value = "";

    practiceInput.disabled = false;

    practiceInput.focus();

    practiceFeedback.textContent = "";

    btnCheck.hidden = false;

    btnNext.hidden = true;

}


// ======================================
// VYHODNOCENÍ ODPOVĚDI
// ======================================

function checkPhraseAnswer() {

    const item = phraseQuestions[phraseIndex];

    const answer =
        normalizeText(practiceInput.value);

    const correct =
        normalizeText(item.answer);

    if (answer === correct) {

        phraseCorrect++;

        practiceFeedback.textContent =
            "✅ Správně";

        practiceFeedback.className =
            "practice-feedback correct";

    } else {

        phraseWrong++;

        phraseMistakes.push(item);

        practiceFeedback.innerHTML = `
            ❌ Správná odpověď:<br>
            <strong>${item.answer}</strong>
        `;

        practiceFeedback.className =
            "practice-feedback wrong";

    }

    statCorrect.textContent = phraseCorrect;

    statWrong.textContent = phraseWrong;

    const total = phraseCorrect + phraseWrong;

    statPercent.textContent =
        Math.round((phraseCorrect / total) * 100) + " %";

    practiceInput.disabled = true;

    btnCheck.hidden = true;

    btnNext.hidden = false;

}


// ======================================
// DALŠÍ OTÁZKA
// ======================================

function nextPhraseQuestion() {

    phraseIndex++;

    showPhraseQuestion();

}


// ======================================
// TLAČÍTKA
// ======================================

btnCheck.addEventListener("click", function(e) {

    e.preventDefault();

    checkPhraseAnswer();

});


btnNext.addEventListener("click", function() {

    nextPhraseQuestion();

});


practiceInput.addEventListener("keydown", function(e) {

    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!btnCheck.hidden) {

        checkPhraseAnswer();

    } else {

        nextPhraseQuestion();

    }

});

// ======================================
// KONEC TESTU
// ======================================

function finishPhrasePractice() {

    practiceQuestion.textContent = "🎉 Test dokončen";

    practiceInput.hidden = true;

    btnCheck.hidden = true;

    btnNext.hidden = true;

    if (phraseMistakes.length > 0) {

        practiceFeedback.innerHTML =
            `Hotovo! Chybných odpovědí: <strong>${phraseMistakes.length}</strong>`;

        btnRepeat.hidden = false;

    } else {

        practiceFeedback.innerHTML =
            "🏆 Gratuluji! Všechny odpovědi byly správně.";

        btnRepeat.hidden = true;

    }

}


// ======================================
// OPAKOVÁNÍ CHYB
// ======================================

btnRepeat.addEventListener("click", function () {

    practiceInput.hidden = false;

    btnRepeat.hidden = true;

    startPhrasePractice(true);

});


// ======================================
// SPUŠTĚNÍ TESTU
// ======================================

document.addEventListener("click", function (e) {

    if (e.target.id !== "startPractice") return;

    practiceInput.hidden = false;

    btnRepeat.hidden = true;

    btnNext.hidden = true;

    btnCheck.hidden = false;

    startPhrasePractice(false);

});

// ======================================
// INICIALIZACE PROCVIČOVÁNÍ
// ======================================

function initializePhrasePractice() {

    const startButton = document.getElementById("startPractice");

    if (!startButton) return;

    startButton.onclick = function () {

        practiceInput.hidden = false;

        btnRepeat.hidden = true;

        btnNext.hidden = true;

        btnCheck.hidden = false;

        startPhrasePractice(false);

    };

}

// Po načtení celé stránky
document.addEventListener("DOMContentLoaded", initializePhrasePractice);

// Po každém načtení nové kapitoly
const observer = new MutationObserver(() => {

    initializePhrasePractice();

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});