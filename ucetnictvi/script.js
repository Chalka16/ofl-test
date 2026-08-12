const topicCards = document.querySelectorAll(".topic-card");
const toast = document.getElementById("toast");
const statsButton = document.getElementById("statsButton");

topicCards.forEach(card => {
  card.addEventListener("click", () => {
    const topic = card.dataset.topic;

    if (topic === "1") {
      window.location.href = "testy/uct-mat-zpusB-01.html";
      return;
    }

    if (topic === "2") {
      window.location.href = "testy/uct-posk-zaloh-02.html";
      return;
    }

    if (topic === "3") {
      window.location.href = "testy/uct-prijate-zalohy-03.html";
      return;
    }

    if (topic === "4") {
      window.location.href = "testy/uct-hospodar-zisk-04.html";
      return;
    }

    if (topic === "5") {
      window.location.href = "testy/vysledek-hospodareni-ztrata-05.html";
      return;
    }

    showToast(`Téma ${topic} bude brzy připraveno.`);
  });
});

statsButton?.addEventListener("click", () => {
  const stats = JSON.parse(
    localStorage.getItem("ucetnictvi_stats") ||
    '{"tests":0,"correct":0,"questions":0,"wrong":0}'
  );

  const success = stats.questions
    ? Math.round((stats.correct / stats.questions) * 100)
    : 0;

  showToast(
    stats.tests
      ? `Testů: ${stats.tests} · Úspěšnost: ${success} % · Chyby: ${stats.wrong}`
      : "Zatím nemáš žádný dokončený test."
  );
});

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    if (item.dataset.nav === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item.dataset.nav === "stats") {
      statsButton?.click();
    }
  });
});

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
