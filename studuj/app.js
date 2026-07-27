/**
 * OFL PWA - Refaktorovaný produkční aplikační skript
 * Architektura: Modulární ES6 Vanilla JS
 * Návrhové vzory: SOLID, DRY, KISS, Clean Code
 */

// =========================================================
// 1. KONSTANTY A ENUMERACE
// =========================================================

const MODES = Object.freeze({
    STUDY: 'study',
    HIDDEN: 'hidden',
    PRACTICE: 'practice'
});

const MASK_TEXT = '•••••';

// =========================================================
// 2. UNIVERZÁLNÍ DATOVÝ MODEL
// =========================================================

const DATA = {
    czechAlphabet: [
        { prompt: 'A', answer: 'Adam' },
        { prompt: 'B', answer: 'Božena' },
        { prompt: 'C', answer: 'Cyril' },
        { prompt: 'D', answer: 'David' },
        { prompt: 'E', answer: 'Emil' },
        { prompt: 'F', answer: 'František' },
        { prompt: 'G', answer: 'Gustav' },
        { prompt: 'H', answer: 'Helena' },
        { prompt: 'I', answer: 'Ivan' },
        { prompt: 'J', answer: 'Josef' },
        { prompt: 'K', answer: 'Karel' },
        { prompt: 'L', answer: 'Ludvík' },
        { prompt: 'M', answer: 'Marie' },
        { prompt: 'N', answer: 'Norbert' },
        { prompt: 'O', answer: 'Oto' },
        { prompt: 'P', answer: 'Petr' },
        { prompt: 'Q', answer: 'Quido' },
        { prompt: 'R', answer: 'Rudolf' },
        { prompt: 'S', answer: 'Svatopluk' },
        { prompt: 'T', answer: 'Tomáš' },
        { prompt: 'U', answer: 'Urban' },
        { prompt: 'V', answer: 'Václav' },
        { prompt: 'W', answer: 'Dvojité Vé' },
        { prompt: 'X', answer: 'Xaver' },
        { prompt: 'Y', answer: 'Ypsilon' },
        { prompt: 'Z', answer: 'Zuzana' }
    ],
    icaoAlphabet: [
        { prompt: 'A', answer: 'Alfa', detail: 'AL FAH' },
        { prompt: 'B', answer: 'Bravo', detail: 'BRAH VOH' },
        { prompt: 'C', answer: 'Charlie', detail: 'CHAR LEE' },
        { prompt: 'D', answer: 'Delta', detail: 'DELL TAH' },
        { prompt: 'E', answer: 'Echo', detail: 'ECK OH' },
        { prompt: 'F', answer: 'Foxtrot', detail: 'FOKS TROT' },
        { prompt: 'G', answer: 'Golf', detail: 'GOLF' },
        { prompt: 'H', answer: 'Hotel', detail: 'HO TTEL' },
        { prompt: 'I', answer: 'India', detail: 'IN DEE AH' },
        { prompt: 'J', answer: 'Juliett', detail: 'JEW LEE ETT' },
        { prompt: 'K', answer: 'Kilo', detail: 'KEY LOH' },
        { prompt: 'L', answer: 'Lima', detail: 'LEE MAH' },
        { prompt: 'M', answer: 'Mike', detail: 'MIKE' },
        { prompt: 'N', answer: 'November', detail: 'NO VEM BER' },
        { prompt: 'O', answer: 'Oscar', detail: 'OSS CAH' },
        { prompt: 'P', answer: 'Papa', detail: 'PAH PAH' },
        { prompt: 'Q', answer: 'Quebec', detail: 'KEH BECK' },
        { prompt: 'R', answer: 'Romeo', detail: 'ROW ME OH' },
        { prompt: 'S', answer: 'Sierra', detail: 'SEE AIR RAH' },
        { prompt: 'T', answer: 'Tango', detail: 'TANG GO' },
        { prompt: 'U', answer: 'Uniform', detail: 'YOU NEE FORM' },
        { prompt: 'V', answer: 'Victor', detail: 'VIK TAH' },
        { prompt: 'W', answer: 'Whiskey', detail: 'WISS KEY' },
        { prompt: 'X', answer: 'X-ray', detail: 'ECKS RAY' },
        { prompt: 'Y', answer: 'Yankee', detail: 'YANG KEY' },
        { prompt: 'Z', answer: 'Zulu', detail: 'ZOO LOO' }
    ],
    numbers: [
        { prompt: '0', answer: 'Nula', detail: 'ZEE ROH' },
        { prompt: '1', answer: 'Jedna', detail: 'WUN' },
        { prompt: '2', answer: 'Dvě', detail: 'TOO' },
        { prompt: '3', answer: 'Tři', detail: 'TREE' },
        { prompt: '4', answer: 'Čtyři', detail: 'FOW ER' },
        { prompt: '5', answer: 'Pět', detail: 'FIFE' },
        { prompt: '6', answer: 'Šest', detail: 'SIX' },
        { prompt: '7', answer: 'Sedm', detail: 'SEVEN' },
        { prompt: '8', answer: 'Osm', detail: 'AIT' },
        { prompt: '9', answer: 'Devět', detail: 'NINER' },
        { prompt: '100', answer: 'Sto', detail: 'HUN DRED' },
        { prompt: '1000', answer: 'Tisíc', detail: 'TOUSAND' }
    ],
    messagePriority: [
        { prompt: '1. Tísňové zprávy', answer: 'MAYDAY', detail: 'Nejvyšší priorita' },
        { prompt: '2. Pilné zprávy', answer: 'PAN PAN', detail: 'Bezprostřední ohrožení' },
        { prompt: '3. Zprávy o zaměřování', answer: 'Direction finding', detail: 'Navigační pomoc' },
        { prompt: '4. Zprávy pro bezpečnost letů', answer: 'Flight safety', detail: 'Řízení letového provozu' }
    ],
    phraseology: [
        { prompt: 'Rozumím', answer: 'ROGER', detail: 'Předchozí zprávě jsem porozuměl' },
        { prompt: 'Schváleno', answer: 'APPROVED', detail: 'Povolení pro požadovaný úkon' },
        { prompt: 'Proveďte opakovací manévr', answer: 'GO AROUND', detail: 'Přerušení přistání' },
        { prompt: 'Čekejte', answer: 'STANDBY', detail: 'Zůstaňte na příjmu' },
        { prompt: 'Opravuji', answer: 'CORRECTION', detail: 'Chyba v přenosu' }
    ],
    emergency: [
        { prompt: 'Tísňový signál', answer: 'MAYDAY', detail: 'Opakuje se 3x' },
        { prompt: 'Pilnostní signál', answer: 'PAN PAN', detail: 'Opakuje se 3x' },
        { prompt: 'Tísňový kmitočet VHF', answer: '121.500 MHz', detail: 'Mezinárodní tísňový kmitočet' }
    ],
    connection: [
        { prompt: 'Jak mě slyšíte?', answer: 'HOW DO YOU READ ME', detail: 'Zkouška spojení' },
        { prompt: 'Slyším vás 5', answer: 'READ YOU 5', detail: 'Dokonalá čitelnost' }
    ]
};

// =========================================================
// 3. UI BUILDER UTILITY
// =========================================================

const UI = {
    /**
     * Vytvoří komplexní HTML element s nastavenými vlastnostmi, událostmi a potomky bez použití innerHTML
     * @param {string} tag 
     * @param {Object} options 
     * @returns {HTMLElement}
     */
    createElement: (tag, options = {}) => {
        const {
            classes = [],
            attributes = {},
            dataset = {},
            events = {},
            text = '',
            children = []
        } = options;

        const el = document.createElement(tag);

        if (Array.isArray(classes) && classes.length > 0) {
            el.classList.add(...classes.filter(Boolean));
        }

        Object.entries(attributes).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                el.setAttribute(key, value);
            }
        });

        Object.entries(dataset).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                el.dataset[key] = value;
            }
        });

        Object.entries(events).forEach(([event, handler]) => {
            if (typeof handler === 'function') {
                el.addEventListener(event, handler);
            }
        });

        if (text) {
            el.textContent = text;
        }

        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child) {
                    if (typeof child === 'string') {
                        el.appendChild(document.createTextNode(child));
                    } else if (child instanceof Node) {
                        el.appendChild(child);
                    }
                }
            });
        }

        return el;
    }
};

// =========================================================
// 4. ROZŠÍŘENÁ SPRÁVA ULOŽIŠTĚ (StorageManager)
// =========================================================

const StorageManager = {
    STORAGE_KEY: 'ofl_pwa_data_v2',

    /**
     * Výchozí stav datové struktury
     */
    getDefaults: () => ({
        completedChapters: [],
        practiceStats: {},
        favorites: [],
        lastMode: MODES.STUDY,
        lastChapter: 'czechAlphabet',
        settings: {
            theme: 'light',
            soundEnabled: true,
            autoNext: false
        }
    }),

    /**
     * Načte kompletní stav z LocalStorage
     * @returns {Object}
     */
    load: () => {
        try {
            const raw = localStorage.getItem(StorageManager.STORAGE_KEY);
            return raw ? { ...StorageManager.getDefaults(), ...JSON.parse(raw) } : StorageManager.getDefaults();
        } catch (e) {
            console.error('Chyba při načítání LocalStorage:', e);
            return StorageManager.getDefaults();
        }
    },

    /**
     * Uloží kompletní stav do LocalStorage
     * @param {Object} data 
     */
    save: (data) => {
        try {
            localStorage.setItem(StorageManager.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Chyba při ukládání do LocalStorage:', e);
        }
    },

    /**
     * Atomická aktualizace stavu
     * @param {Function} mutator 
     */
    update: (mutator) => {
        const data = StorageManager.load();
        mutator(data);
        StorageManager.save(data);
    },

    /**
     * Označí kapitolu jako dokončenou
     * @param {string} chapterId 
     */
    markChapterCompleted: (chapterId) => {
        StorageManager.update(data => {
            if (!data.completedChapters.includes(chapterId)) {
                data.completedChapters.push(chapterId);
            }
        });
    },

    /**
     * Zaznamená výsledky procvičování pro danou kapitolu
     * @param {string} chapterId 
     * @param {number} correct 
     * @param {number} total 
     */
    recordPracticeResult: (chapterId, correct, total) => {
        StorageManager.update(data => {
            if (!data.practiceStats[chapterId]) {
                data.practiceStats[chapterId] = { totalQuestions: 0, correctAnswers: 0, attempts: 0 };
            }
            const stat = data.practiceStats[chapterId];
            stat.totalQuestions += total;
            stat.correctAnswers += correct;
            stat.attempts += 1;
        });
    },

    /**
     * Uloží poslední navštívený stav uživatele
     * @param {string} chapterId 
     * @param {string} mode 
     */
    saveLastState: (chapterId, mode) => {
        StorageManager.update(data => {
            if (chapterId) data.lastChapter = chapterId;
            if (mode) data.lastMode = mode;
        });
    },

    /**
     * Resetuje veškerá uložená data
     */
    reset: () => {
        localStorage.removeItem(StorageManager.STORAGE_KEY);
    }
};

// =========================================================
// 5. UNIVERZÁLNÍ STUDIJNÍ MODUL (LearningModule)
// =========================================================

class LearningModule {
    /**
     * @param {Object} config - Konfigurace kapitoly ({ id, title, items })
     */
    constructor(config) {
        this.config = config;
        this.currentMode = MODES.STUDY;
        
        this.modeButtons = {};
        this.contentContainer = null;
        
        this.practiceState = {
            shuffledItems: [],
            currentIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            isAnswerChecked: false
        };
    }

    /**
     * Inicializuje modul a vybuduje rozvržení DOM bez překreslování celku
     * @param {HTMLElement} container 
     */
    render(container) {
        container.replaceChildren();

        const titleElement = UI.createElement('h1', {
            classes: ['chapter-title'],
            text: this.config.title
        });

        const header = UI.createElement('header', {
            classes: ['chapter-header'],
            children: [titleElement]
        });

        const btnStudy = this.createModeButton('Studium', MODES.STUDY);
        const btnHide = this.createModeButton('Skrýt slova', MODES.HIDDEN);
        const btnPractice = this.createModeButton('Procvičování', MODES.PRACTICE);

        this.modeButtons[MODES.STUDY] = btnStudy;
        this.modeButtons[MODES.HIDDEN] = btnHide;
        this.modeButtons[MODES.PRACTICE] = btnPractice;

        const modeNav = UI.createElement('nav', {
            classes: ['mode-nav'],
            children: [btnStudy, btnHide, btnPractice]
        });

        this.contentContainer = UI.createElement('section', {
            classes: ['content-card', 'slide-up-animation']
        });

        container.append(header, modeNav, this.contentContainer);
        this.renderContent();
    }

    /**
     * Vytvoří tlačítko režimu
     * @param {string} label 
     * @param {string} mode 
     * @returns {HTMLElement}
     */
    createModeButton(label, mode) {
        const isActive = this.currentMode === mode;
        return UI.createElement('button', {
            classes: ['btn-mode', isActive ? 'btn-mode-active' : ''],
            text: label,
            events: {
                click: () => this.switchMode(mode)
            }
        });
    }

    /**
     * Přepne režim s minimální aktualizací DOM (bez celkové reinstanciace)
     * @param {string} newMode 
     */
    switchMode(newMode) {
        if (this.currentMode === newMode) return;

        Object.entries(this.modeButtons).forEach(([mode, btn]) => {
            btn.classList.toggle('btn-mode-active', mode === newMode);
        });

        this.currentMode = newMode;
        StorageManager.saveLastState(this.config.id, newMode);
        this.renderContent();
    }

    /**
     * Vykreslí vnitřní obsah podle vybraného režimu
     */
    renderContent() {
        this.contentContainer.replaceChildren();

        if (this.currentMode === MODES.STUDY || this.currentMode === MODES.HIDDEN) {
            this.renderListMode({ isHidden: this.currentMode === MODES.HIDDEN });
        } else if (this.currentMode === MODES.PRACTICE) {
            this.startPractice();
        }
    }

    /**
     * UNIVERZÁLNÍ RENDERER PRO REŽIMY STUDIUM A SKRÝT SLOVA
     * @param {Object} options 
     */
    renderListMode({ isHidden }) {
        const titleText = isHidden ? 'Režim: Skrýt slova (Kliknutím odhalíš)' : 'Režim: Studium';
        
        const title = UI.createElement('h2', {
            classes: ['section-subtitle'],
            text: titleText
        });

        const cards = this.config.items.map(item => {
            const promptEl = UI.createElement('div', {
                classes: ['card-prompt'],
                text: item.prompt
            });

            const answerEl = UI.createElement('div', {
                classes: ['card-answer'],
                text: isHidden ? MASK_TEXT : item.answer,
                dataset: {
                    hidden: isHidden ? 'true' : 'false',
                    answer: item.answer
                }
            });

            const children = [promptEl, answerEl];

            if (item.detail) {
                const detailEl = UI.createElement('div', {
                    classes: ['card-detail'],
                    text: item.detail
                });
                children.push(detailEl);
            }

            const cardClasses = ['alpha-card'];
            if (isHidden) cardClasses.push('interactive');

            const cardEvents = {};
            if (isHidden) {
                cardEvents.click = () => {
                    const isCurrentlyHidden = answerEl.dataset.hidden === 'true';
                    if (isCurrentlyHidden) {
                        answerEl.textContent = answerEl.dataset.answer;
                        answerEl.dataset.hidden = 'false';
                        card.classList.add('revealed');
                    } else {
                        answerEl.textContent = MASK_TEXT;
                        answerEl.dataset.hidden = 'true';
                        card.classList.remove('revealed');
                    }
                };
            }

            const card = UI.createElement('div', {
                classes: cardClasses,
                events: cardEvents,
                children: children
            });

            return card;
        });

        const grid = UI.createElement('div', {
            classes: ['alphabet-grid'],
            children: cards
        });

        this.contentContainer.append(title, grid);
    }

    /**
     * REŽIM PROCVIČOVÁNÍ - Inicializace
     */
    startPractice() {
        this.practiceState.shuffledItems = this.shuffleArray(this.config.items);
        this.practiceState.currentIndex = 0;
        this.practiceState.correctCount = 0;
        this.practiceState.wrongCount = 0;
        this.practiceState.isAnswerChecked = false;

        this.renderPracticeStep();
    }

    /**
     * Fisher-Yates shuffle algorithm
     * @param {Array} array 
     * @returns {Array}
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Vykreslení jednotlivého kroku v procvičování
     */
    renderPracticeStep() {
        this.contentContainer.replaceChildren();

        if (this.practiceState.currentIndex >= this.practiceState.shuffledItems.length) {
            this.renderPracticeResults();
            return;
        }

        const currentItem = this.practiceState.shuffledItems[this.practiceState.currentIndex];
        this.practiceState.isAnswerChecked = false;

        const infoBox = UI.createElement('div', {
            classes: ['info-box'],
            text: `Otázka ${this.practiceState.currentIndex + 1} z ${this.practiceState.shuffledItems.length}`
        });

        const promptText = UI.createElement('div', {
            classes: ['practice-prompt'],
            text: currentItem.prompt
        });

        const childrenList = [promptText];

        if (currentItem.detail) {
            const detailHint = UI.createElement('div', {
                classes: ['card-detail'],
                text: `Nápověda: ${currentItem.detail}`
            });
            childrenList.push(detailHint);
        }

        const inputField = UI.createElement('input', {
            classes: ['practice-input'],
            attributes: {
                type: 'text',
                placeholder: 'Zadejte odpovídající výraz...'
            }
        });

        const feedbackArea = UI.createElement('div', {
            classes: ['practice-feedback']
        });

        const actionBtn = UI.createElement('button', {
            classes: ['btn-primary'],
            text: 'Ověřit'
        });

        const handleCheck = () => {
            this.checkPracticeAnswer(inputField, feedbackArea, actionBtn, currentItem);
        };

        actionBtn.addEventListener('click', handleCheck);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCheck();
            }
        });

        childrenList.push(inputField, feedbackArea, actionBtn);

        const practiceContainer = UI.createElement('div', {
            classes: ['practice-container'],
            children: childrenList
        });

        this.contentContainer.append(infoBox, practiceContainer);
        setTimeout(() => inputField.focus(), 50);
    }

    /**
     * Evaluace odpovědi uživatele
     */
    checkPracticeAnswer(inputEl, feedbackEl, actionBtn, item) {
        if (this.practiceState.isAnswerChecked) {
            this.practiceState.currentIndex++;
            this.renderPracticeStep();
            return;
        }

        const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '');
        
        const userAnswer = normalize(inputEl.value);
        const correctAnswer = normalize(item.answer);

        if (userAnswer === correctAnswer) {
            inputEl.classList.add('is-correct');
            feedbackEl.classList.add('is-correct');
            feedbackEl.textContent = 'Správně!';
            this.practiceState.correctCount++;
        } else {
            inputEl.classList.add('is-wrong');
            feedbackEl.classList.add('is-wrong');
            feedbackEl.textContent = `Špatně. Správná odpověď: ${item.answer}`;
            this.practiceState.wrongCount++;
        }

        inputEl.disabled = true;
        actionBtn.textContent = 'Další';
        this.practiceState.isAnswerChecked = true;
    }

    /**
     * Vykreslení souhrnných výsledků procvičování
     */
    renderPracticeResults() {
        const total = this.practiceState.shuffledItems.length;
        const correct = this.practiceState.correctCount;
        const wrong = this.practiceState.wrongCount;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        const title = UI.createElement('h2', {
            classes: ['section-subtitle'],
            text: 'Výsledky procvičování'
        });

        const statCorrect = UI.createElement('p', {
            classes: ['stat-correct'],
            text: `Správně: ${correct}`
        });

        const statWrong = UI.createElement('p', {
            classes: ['stat-wrong'],
            text: `Špatně: ${wrong}`
        });

        const statPercent = UI.createElement('p', {
            classes: ['stat-percent'],
            text: `Úspěšnost: ${percentage}%`
        });

        const statsCard = UI.createElement('div', {
            classes: ['stats-card'],
            children: [statCorrect, statWrong, statPercent]
        });

        const retryBtn = UI.createElement('button', {
            classes: ['btn-primary'],
            text: 'Procvičit znovu',
            events: {
                click: () => this.startPractice()
            }
        });

        this.contentContainer.append(title, statsCard, retryBtn);

        StorageManager.recordPracticeResult(this.config.id, correct, total);
        if (percentage >= 80) {
            StorageManager.markChapterCompleted(this.config.id);
        }
    }
}

// =========================================================
// 6. ROUTING SYSTEM (Mapa Routeru)
// =========================================================

const ROUTES = {
    'abeceda.html': { id: 'czechAlphabet', title: 'Česká abeceda' },
    'icao.html': { id: 'icaoAlphabet', title: 'ICAO Hláskovací abeceda' },
    'cisla.html': { id: 'numbers', title: 'Čísla a číslovky' },
    'frazeologie.html': { id: 'phraseology', title: 'Letecká frázeologie' },
    'poradi.html': { id: 'messagePriority', title: 'Pořadí zpráv' },
    'tisnova.html': { id: 'emergency', title: 'Tísňová volání' },
    'spojeni.html': { id: 'connection', title: 'Pravidla spojení' }
};

const Router = {
    /**
     * Vyhodnotí aktuální trasu a vykreslí příslušný modul
     */
    init: () => {
        const path = window.location.pathname;
        const matchingKey = Object.keys(ROUTES).find(route => path.includes(route));

        if (matchingKey) {
            const routeConfig = ROUTES[matchingKey];
            const mainContainer = document.querySelector('main') || document.body;

            if (DATA[routeConfig.id]) {
                const module = new LearningModule({
                    id: routeConfig.id,
                    title: routeConfig.title,
                    items: DATA[routeConfig.id]
                });
                module.render(mainContainer);
            }
        }
    }
};

// =========================================================
// 7. HLAVNÍ APLIKAČNÍ ŘÍDIČ (App Controller)
// =========================================================

const App = {
    /**
     * Hlavní inicializace aplikace
     */
    init: () => {
        App.initServiceWorker();
        App.initAnimations();
        Router.init();
    },

    /**
     * Registrace Service Workeru
     */
    initServiceWorker: () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('ServiceWorker úspěšně registrován:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Registrace ServiceWorkeru selhala:', error);
                    });
            });
        }
    },

    /**
     * Spuštění vizuálních přechodových animací
     */
    initAnimations: () => {
        document.body.classList.add('fade-in');
        
        const navCards = document.querySelectorAll('.nav-card');
        navCards.forEach((card, index) => {
            card.classList.add('slide-up-animation');
            card.dataset.delay = `${index * 0.05}s`;
        });
    }
};

// Spuštění aplikace po načtení DOM
document.addEventListener('DOMContentLoaded', App.init);
