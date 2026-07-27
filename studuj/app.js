// =========================================================
// OFL Radiotelefonie
// app.js
// Verze 1.0
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    registerServiceWorker();

    initAnimations();

    updateProgress();

});

// =========================================================
// Registrace Service Worker
// =========================================================

function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register("./sw.js");

            console.log("✅ Service Worker registrován");
            console.log(registration.scope);

        } catch (error) {

            console.error("❌ Registrace Service Workeru selhala");
            console.error(error);

        }

    });

}

// =========================================================
// Animace
// =========================================================

function initAnimations() {

    const cards = document.querySelectorAll(".nav-card");

    cards.forEach((card, index) => {

        card.classList.add("fade-up");

        card.style.animationDelay = `${index * 0.08}s`;

    });

}

// =========================================================
// Progress studia
// =========================================================

const chapters = [

    "abeceda",
    "radio",
    "cisla",
    "poradi",
    "frazeologie",
    "tisnova",
    "spojeni"

];

function updateProgress() {

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progressFill");

    let completed = 0;

    chapters.forEach(chapter => {

        if (localStorage.getItem(chapter) === "true") {

            completed++;

        }

    });

    if (progressText) {

        progressText.textContent =
            `${completed} / ${chapters.length} kapitol`;

    }

    if (progressFill) {

        const percent =
            (completed / chapters.length) * 100;

        progressFill.style.width = percent + "%";

    }

}

// =========================================================
// Označení kapitoly jako dokončené
// =========================================================

function completeChapter(chapterName) {

    if (!chapters.includes(chapterName)) return;

    localStorage.setItem(chapterName, "true");

    updateProgress();

}

// =========================================================
// Zrušení dokončení kapitoly
// =========================================================

function resetChapter(chapterName) {

    localStorage.removeItem(chapterName);

    updateProgress();

}

// =========================================================
// Reset celého studia
// =========================================================

function resetProgress() {

    chapters.forEach(chapter => {

        localStorage.removeItem(chapter);

    });

    updateProgress();

}

// =========================================================
// Získání procent dokončení
// =========================================================

function getProgressPercent() {

    let completed = 0;

    chapters.forEach(chapter => {

        if (localStorage.getItem(chapter) === "true") {

            completed++;

        }

    });

    return Math.round(
        completed / chapters.length * 100
    );

}

// =========================================================
// Test dostupnosti LocalStorage
// =========================================================

function storageAvailable() {

    try {

        localStorage.setItem("test", "1");
        localStorage.removeItem("test");

        return true;

    } catch {

        return false;

    }

}

if (!storageAvailable()) {

    console.warn("LocalStorage není dostupné.");

}