'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // --- LOCAL STORAGE KEYS ---
    const STORAGE_ALPHABET_KEY = 'ofl_alphabet';
    const STORAGE_MODE_KEY = 'ofl_mode';

    // --- STAV APLIKACE ---
    let database = null;
    let currentAlphabet = 'icao'; // 'icao' | 'cz'
    let currentMode = 'study'; // 'study' | 'hidden' | 'practice'

    const practiceState = {
        queue: [],
        currentIndex: 0,
        totalCount: 0,
        correctCount: 0,
        wrongCount: 0,
        mistakes: [],
        currentItem: null
    };

    // --- DOM ELEMENTY ---
    const viewCards = document.getElementById('view-cards');
    const viewPractice = document.getElementById('view-practice');
    const chapterTitle = document.querySelector('.chapter-title');
    const studyDivider = document.getElementById('study-divider');
    const studyTip = document.getElementById('study-tip');

    const alphabetNav = document.getElementById('alphabet-type-nav');
    const learningModeNav = document.getElementById('learning-mode-nav');

    const practiceForm = document.getElementById('practice-form');
    const practiceInput = document.getElementById('practice-input');
    const practiceTarget = document.getElementById('practice-target');
    const practiceProgress = document.getElementById('practice-progress');
    const practiceFeedback = document.getElementById('practice-feedback');

    const btnSubmit = document.getElementById('btn-practice-submit');
    const btnNext = document.getElementById('btn-practice-next');
    const btnRepeatWrong = document.getElementById('btn-practice-repeat-wrong');

    const statCorrect = document.getElementById('stat-correct');
    const statWrong = document.getElementById('stat-wrong');
    const statPercent = document.getElementById('stat-percent');

    // --- POMOCNÉ FUNKCE ---
    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const normalizeAnswer = (str) => {
        if (!str) return '';
        return str
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const saveSettings = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // Ignorujeme chyby localStorage
        }
    };

    const loadSettings = (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    };

    const updateTitle = () => {
        if (!chapterTitle) return;
        if (currentAlphabet === 'icao') {
            chapterTitle.textContent = 'ICAO hláskovací abeceda';
        } else if (currentAlphabet === 'cz') {
            chapterTitle.textContent = 'Česká hláskovací abeceda';
        }
    };

    const showDatabaseError = () => {
        if (!viewCards) return;
        viewCards.textContent = '';
        const errParagraph = document.createElement('p');
        errParagraph.className = 'error-message';
        errParagraph.textContent = 'Nepodařilo se načíst databázi hláskovací abecedy.';
        viewCards.appendChild(errParagraph);
    };

    // --- DATABÁZE ---
    const loadDatabase = () => {
        const scriptEl = document.getElementById('alphabet-database');
        if (!scriptEl) {
            showDatabaseError();
            return null;
        }
        try {
            const data = JSON.parse(scriptEl.textContent);
            if (!data || (!data.icao && !data.cz)) {
                showDatabaseError();
                return null;
            }
            return data;
        } catch (e) {
            showDatabaseError();
            return null;
        }
    };

    // --- VYKRESLOVÁNÍ KARET ---
    const renderCards = () => {
        if (!viewCards || !database || !database[currentAlphabet]) return;

        if (currentMode === 'practice') {
            viewCards.hidden = true;
            return;
        }

        viewCards.hidden = false;
        viewCards.textContent = '';
        const fragment = document.createDocumentFragment();

        database[currentAlphabet].forEach((item) => {
            const card = document.createElement('article');
            card.className = 'learning-card interactive';
            card.dataset.letter = item.letter;

            const letterSpan = document.createElement('span');
            letterSpan.className = 'learning-card-letter';
            letterSpan.textContent = item.letter;

            const wordSpan = document.createElement('span');
            wordSpan.className = 'learning-card-word';
            wordSpan.textContent = item.word;

            card.appendChild(letterSpan);
            card.appendChild(wordSpan);

            // Výslovnost zobrazovat pouze u ICAO abecedy
            if (currentAlphabet === 'icao' && item.desc) {
                const descSpan = document.createElement('span');
                descSpan.className = 'learning-card-desc';
                descSpan.textContent = item.desc;
                if (currentMode === 'hidden') {
                    descSpan.classList.add('is-hidden');
                }
                card.appendChild(descSpan);
            }

            if (currentMode === 'hidden') {
                wordSpan.classList.add('is-hidden');
            }

            fragment.appendChild(card);
        });

        viewCards.appendChild(fragment);
    };

    const toggleCard = (card) => {
        if (currentMode !== 'hidden') return;

        const word = card.querySelector('.learning-card-word');
        const desc = card.querySelector('.learning-card-desc');

        if (word) {
            if (word.classList.contains('is-revealed')) {
                word.classList.remove('is-revealed');
                word.classList.add('is-hidden');
            } else {
                word.classList.remove('is-hidden');
                word.classList.add('is-revealed');
            }
        }

        if (desc) {
            if (desc.classList.contains('is-revealed')) {
                desc.classList.remove('is-revealed');
                desc.classList.add('is-hidden');
            } else {
                desc.classList.remove('is-hidden');
                desc.classList.add('is-revealed');
            }
        }
    };

    // --- PROCVIČOVÁNÍ & STATISTIKY ---
    const updateStats = () => {
        if (statCorrect) statCorrect.textContent = practiceState.correctCount;
        if (statWrong) statWrong.textContent = practiceState.wrongCount;

        const totalAnswered = practiceState.correctCount + practiceState.wrongCount;
        const percentage = totalAnswered > 0 
            ? Math.round((practiceState.correctCount / totalAnswered) * 100) 
            : 0;

        if (statPercent) statPercent.textContent = `${percentage} %`;
    };

    const nextQuestion = () => {
        if (!practiceState.queue || practiceState.queue.length === 0) return;

        practiceState.currentItem = practiceState.queue.shift();
        practiceState.currentIndex++;

        if (practiceTarget) practiceTarget.textContent = practiceState.currentItem.letter;
        if (practiceProgress) {
            practiceProgress.textContent = `${practiceState.currentIndex} / ${practiceState.totalCount}`;
        }

        if (practiceInput) {
            practiceInput.value = '';
            practiceInput.disabled = false;
            practiceInput.classList.remove('is-correct', 'is-wrong');
        }

        if (practiceFeedback) {
            practiceFeedback.textContent = '';
            practiceFeedback.className = 'practice-feedback';
        }

        if (btnSubmit) btnSubmit.hidden = false;
        if (btnNext) {
            btnNext.hidden = true;
            btnNext.textContent = 'Další písmeno →';
        }
        if (btnRepeatWrong) btnRepeatWrong.hidden = true;

        if (practiceInput) practiceInput.focus();
    };

    const startPractice = (customItems = null) => {
        if (!database || !database[currentAlphabet]) return;

        const items = customItems || database[currentAlphabet];
        practiceState.queue = shuffleArray(items);
        practiceState.totalCount = practiceState.queue.length;
        practiceState.currentIndex = 0;
        practiceState.mistakes = [];

        if (!customItems) {
            practiceState.correctCount = 0;
            practiceState.wrongCount = 0;
        }

        updateStats();
        nextQuestion();
    };

    const checkAnswer = () => {
        if (!practiceState.currentItem || !practiceInput) return;

        const userVal = normalizeAnswer(practiceInput.value);
        const targetVal = normalizeAnswer(practiceState.currentItem.word);

        const isCorrect = userVal === targetVal;

        practiceInput.disabled = true;

        if (isCorrect) {
            practiceState.correctCount++;
            practiceInput.classList.add('is-correct');
            if (practiceFeedback) {
                practiceFeedback.textContent = '✔ Správně';
                practiceFeedback.className = 'practice-feedback correct';
            }
        } else {
            practiceState.wrongCount++;
            
            const isDuplicate = practiceState.mistakes.some(
                item => item.letter === practiceState.currentItem.letter
            );
            if (!isDuplicate) {
                practiceState.mistakes.push(practiceState.currentItem);
            }

            practiceInput.classList.add('is-wrong');
            if (practiceFeedback) {
                practiceFeedback.textContent = `✖ Správná odpověď byla ${practiceState.currentItem.word}`;
                practiceFeedback.className = 'practice-feedback wrong';
            }
        }

        updateStats();

        if (btnSubmit) btnSubmit.hidden = true;

        if (practiceState.queue.length > 0) {
            if (btnNext) {
                btnNext.hidden = false;
                btnNext.focus();
            }
        } else {
            if (practiceState.mistakes.length > 0) {
                if (btnRepeatWrong) {
                    btnRepeatWrong.hidden = false;
                    btnRepeatWrong.focus();
                }
                if (btnNext) {
                    btnNext.hidden = true;
                }
            } else {
                if (btnRepeatWrong) {
                    btnRepeatWrong.hidden = true;
                }
                if (btnNext) {
                    btnNext.textContent = 'Začít znovu ↺';
                    btnNext.hidden = false;
                    btnNext.focus();
                }
                if (practiceFeedback) {
                    const congratsMsg = 'Gratulujeme! Všechny odpovědi byly správně.';
                    if (isCorrect) {
                        practiceFeedback.textContent = `✔ Správně. ${congratsMsg}`;
                    } else {
                        practiceFeedback.textContent = `${practiceFeedback.textContent} ${congratsMsg}`;
                    }
                }
            }
        }
    };

    // --- PŘEPÍNÁNÍ OVERLAY / REŽIMŮ ---
    const updateTabUI = (container, activeAttr, activeValue) => {
        if (!container) return;
        const buttons = container.querySelectorAll('.btn-mode');
        buttons.forEach((btn) => {
            const matches = btn.dataset[activeAttr] === activeValue;
            btn.classList.toggle('active', matches);
            btn.setAttribute('aria-selected', matches ? 'true' : 'false');
        });
    };

    const switchAlphabet = (alphabetType) => {
        if (alphabetType !== 'icao' && alphabetType !== 'cz') return;
        currentAlphabet = alphabetType;
        saveSettings(STORAGE_ALPHABET_KEY, alphabetType);

        updateTitle();
        updateTabUI(alphabetNav, 'alphabet', alphabetType);

        if (currentMode === 'practice') {
            startPractice();
        } else {
            renderCards();
        }
    };

    const switchMode = (modeType) => {
        if (modeType !== 'study' && modeType !== 'hidden' && modeType !== 'practice') return;
        currentMode = modeType;
        saveSettings(STORAGE_MODE_KEY, modeType);

        updateTabUI(learningModeNav, 'mode', modeType);

        if (modeType === 'practice') {
            if (viewCards) viewCards.hidden = true;
            if (viewPractice) viewPractice.hidden = false;
            if (studyTip) studyTip.hidden = true;
            if (studyDivider) studyDivider.hidden = true;
            startPractice();
        } else {
            if (viewCards) viewCards.hidden = false;
            if (viewPractice) viewPractice.hidden = true;
            if (studyTip) studyTip.hidden = false;
            if (studyDivider) studyDivider.hidden = false;
            renderCards();
        }

        scrollTop();
    };

    // --- POSLUCHAČE UDÁLOSTÍ ---
    const setupEventListeners = () => {
        if (alphabetNav) {
            alphabetNav.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-alphabet]');
                if (btn) switchAlphabet(btn.dataset.alphabet);
            });
        }

        if (learningModeNav) {
            learningModeNav.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-mode]');
                if (btn) switchMode(btn.dataset.mode);
            });
        }

        if (viewCards) {
            viewCards.addEventListener('click', (e) => {
                const card = e.target.closest('.learning-card');
                if (card) toggleCard(card);
            });
        }

        if (practiceForm) {
            practiceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (btnSubmit && !btnSubmit.hidden) {
                    checkAnswer();
                } else if (btnNext && !btnNext.hidden) {
                    btnNext.click();
                } else if (btnRepeatWrong && !btnRepeatWrong.hidden) {
                    btnRepeatWrong.click();
                }
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (practiceState.queue.length > 0) {
                    nextQuestion();
                } else {
                    startPractice();
                }
            });
        }

        if (btnRepeatWrong) {
            btnRepeatWrong.addEventListener('click', () => {
                const mistakesToRepeat = [...practiceState.mistakes];
                startPractice(mistakesToRepeat);
            });
        }
    };

    // --- INICIALIZACE ---
    const init = () => {
        database = loadDatabase();
        setupEventListeners();

        const savedAlphabet = loadSettings(STORAGE_ALPHABET_KEY);
        const savedMode = loadSettings(STORAGE_MODE_KEY);

        const initialAlphabet = (savedAlphabet === 'icao' || savedAlphabet === 'cz') ? savedAlphabet : 'icao';
        const initialMode = (savedMode === 'study' || savedMode === 'hidden' || savedMode === 'practice') ? savedMode : 'study';

        switchAlphabet(initialAlphabet);
        switchMode(initialMode);
        setupStudyNavigation();
    };
// =====================================================
// STUDIJNÍ KAPITOLY
// =====================================================

const studyContainer = document.getElementById("study-content");
const cardGrid = document.querySelector(".card-grid");

async function loadStudyPage(page) {

    if (!studyContainer || !cardGrid) return;

    try {

        const response = await fetch(`${page}.html`);

        if (!response.ok) {
            throw new Error("Soubor nenalezen");
        }

        const html = await response.text();

        studyContainer.innerHTML = `
            <button class="btn-back" id="btn-back">
                ← Zpět na přehled
            </button>

            ${html}
        `;
initializePhrasePractice();
        cardGrid.hidden = true;
        studyContainer.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        history.pushState(
            {
                page: page
            },
            "",
            `#${page}`
        );

        document
            .getElementById("btn-back")
            .addEventListener("click", showHome);

    } catch (err) {

        studyContainer.innerHTML = `
            <div class="content-card">
                <h2>Chyba</h2>
                <p>Nepodařilo se načíst studijní kapitolu.</p>
            </div>
        `;

        cardGrid.hidden = true;
        studyContainer.hidden = false;
    }

}

function showHome() {

    if (!studyContainer || !cardGrid) return;

    studyContainer.hidden = true;
    studyContainer.innerHTML = "";

    cardGrid.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    history.pushState({}, "", "index.html");

}

function setupStudyNavigation() {

    document.querySelectorAll(".nav-card[data-page]").forEach(card => {

        card.addEventListener("click", e => {

            e.preventDefault();

            loadStudyPage(card.dataset.page);

        });

    });

}

window.addEventListener("popstate", () => {

    const page = location.hash.replace("#", "");

    if (page) {

        loadStudyPage(page);

    } else {

        showHome();

    }

});
    init();
});

function togglePhrase(header) {

    if (!practiceMode) return;

    const body = header.nextElementSibling;
    const icon = header.querySelector(".phrase-icon");

    body.classList.toggle("hidden-meaning");
    icon.classList.toggle("rotated");

}
let practiceMode = false;

document.addEventListener("click", (e) => {

    if (e.target.id !== "togglePractice") return;

    practiceMode = !practiceMode;

    const button = e.target;

    const bodies = document.querySelectorAll(".phrase-body");
    const icons = document.querySelectorAll(".phrase-icon");

    if (practiceMode) {

        button.textContent = "📖 Ukončit procvičování";

        bodies.forEach(body => {
            body.classList.add("hidden-meaning");
        });

        icons.forEach(icon => {
            icon.classList.remove("rotated");
        });

    } else {

        button.textContent = "🧠 Zapnout procvičování";

        bodies.forEach(body => {
            body.classList.remove("hidden-meaning");
        });

        icons.forEach(icon => {
            icon.classList.add("rotated");
        });

    }

});

/* ===============================

   Skupiny standardních výrazů

================================ */
function toggleGroup(header) {

    const groups = document.querySelectorAll(".phrase-group-body");

    groups.forEach(group => {

        if (group !== header.nextElementSibling) {

            group.classList.remove("open");

            // Významy schovej pouze v režimu procvičování
            group.querySelectorAll(".phrase-body").forEach(body => {
                if (practiceMode) {
                    body.classList.add("hidden-meaning");
                } else {
                    body.classList.remove("hidden-meaning");
                }
            });

            // Reset ikon frází
            group.querySelectorAll(".phrase-icon").forEach(icon => {
                icon.classList.remove("rotated");
            });

            // Reset ikony skupiny
            const otherIcon =
                group.previousElementSibling.querySelector(".group-icon");

            otherIcon.textContent = "▼";
        }

    });

    const body = header.nextElementSibling;
    const icon = header.querySelector(".group-icon");

    body.classList.toggle("open");
    icon.textContent = body.classList.contains("open") ? "▲" : "▼";

    // Pokud není procvičování zapnuté, zobraz všechny významy
    if (!practiceMode) {
        body.querySelectorAll(".phrase-body").forEach(item => {
            item.classList.remove("hidden-meaning");
        });
    }
}




// ======================================
// PROCVIČOVÁNÍ STANDARDNÍCH FRÁZÍ
// ======================================

let phraseQuestions = [];
let phraseMistakes = [];

let phraseIndex = 0;
let phraseCorrect = 0;
let phraseWrong = 0;

let practiceSection;
let practiceQuestion;
let practiceProgress;
let practiceInput;
let practiceFeedback;

let statCorrect;
let statWrong;
let statPercent;

let btnCheck;
let btnNext;
let btnRepeat;


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

    practiceSection = document.getElementById("phrasePracticeSection");
    practiceQuestion = document.getElementById("phrase-question");
    console.log(practiceQuestion);
    practiceProgress = document.getElementById("phrase-progress");
    practiceInput = document.getElementById("phrase-input");
    console.log(practiceInput);
    practiceFeedback = document.getElementById("phrase-feedback");

    statCorrect = document.getElementById("phrase-stat-correct");
    statWrong = document.getElementById("phrase-stat-wrong");
    statPercent = document.getElementById("phrase-stat-percent");

    btnCheck = document.getElementById("phrase-btn-check");
    btnNext = document.getElementById("phrase-btn-next");
    btnRepeat = document.getElementById("phrase-btn-repeat");

    const startButton = document.getElementById("startPractice");

    if (
        !startButton ||
        !practiceSection ||
        !practiceInput
    ) return;

    startButton.onclick = function () {

        practiceInput.hidden = false;

        btnRepeat.hidden = true;

        btnNext.hidden = true;

        btnCheck.hidden = false;

        startPhrasePractice(false);

    };
    btnCheck.addEventListener("click", function (e) {

        e.preventDefault();
        checkPhraseAnswer();

    });

    btnNext.addEventListener("click", function () {

        nextPhraseQuestion();

    });

    btnRepeat.addEventListener("click", function () {

        practiceInput.hidden = false;

        btnRepeat.hidden = true;

        startPhrasePractice(true);

    });

    practiceInput.addEventListener("keydown", function (e) {

        if (e.key !== "Enter") return;

        e.preventDefault();

        if (!btnCheck.hidden) {
            checkPhraseAnswer();
        } else {
            nextPhraseQuestion();
        }

    });
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
