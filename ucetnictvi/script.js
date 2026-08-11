const topicCards = document.querySelectorAll(".topic-card");
const toast = document.getElementById("toast");
const statsButton = document.getElementById("statsButton");
const navItems = document.querySelectorAll(".nav-item");

let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

topicCards.forEach((card) => {
  card.addEventListener("click", () => {
    const topic = card.dataset.topic;

    // Zatím pouze testujeme indexovou stránku.
    // Později zde přesměrujeme na konkrétní test:
    // window.location.href = `test.html?tema=${topic}`;

    showToast(`Téma ${topic} bude brzy připraveno.`);
  });
});

statsButton.addEventListener("click", () => {
  showToast("Statistiky doplníme v další fázi.");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    if (item.dataset.nav === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(".stats-preview")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});
