let questionsData = [];
let userAnswers = {};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('./questions.json')
    .then(res => res.json())
    .then(data => {
      document.getElementById('app-title').innerText = data.title || "OFL Test";
      questionsData = data.questions || [];
      renderQuiz();
    });
});

function renderQuiz() {
  const container = document.getElementById('main-content');
  container.innerHTML = '';
  userAnswers = {};

  questionsData.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `q-${index}`;

    let optionsHTML = '';
    q.options.forEach((opt, optIndex) => {
      optionsHTML += `
        <label class="option">
          <input type="radio" name="q-${index}" value="${optIndex}" onchange="selectAnswer(${index}, ${optIndex})">
          <span>${opt}</span>
        </label>
      `;
    });

    card.innerHTML = `
      <h3>${index + 1}. ${q.question}</h3>
      <div class="options">${optionsHTML}</div>
    `;
    container.appendChild(card);
  });

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn-submit';
  submitBtn.innerText = 'Vyhodnotit test';
  submitBtn.onclick = evaluateQuiz;
  container.appendChild(submitBtn);
}

function selectAnswer(qIndex, optIndex) {
  userAnswers[qIndex] = optIndex;
}

function evaluateQuiz() {
  let correctCount = 0;
  questionsData.forEach((q, index) => {
    const card = document.getElementById(`q-${index}`);
    const selected = userAnswers[index];
    
    if (selected === q.correct) {
      correctCount++;
      card.classList.add('correct');
      card.classList.remove('incorrect');
    } else {
      card.classList.add('incorrect');
      card.classList.remove('correct');
    }
  });

  const percentage = Math.round((correctCount / questionsData.length) * 100);
  alert(`Výsledek: ${correctCount} z ${questionsData.length} (${percentage} %)\nPožadováno: 90 %`);
}
