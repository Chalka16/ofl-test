{\rtf1\ansi\ansicpg1250\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw8400\paperh11900\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let questionsData = [];\
let userAnswers = \{\};\
\
if ('serviceWorker' in navigator) \{\
    navigator.serviceWorker.register('./sw.js');\
\}\
\
document.addEventListener('DOMContentLoaded', () => \{\
    fetch('./questions.json')\
        .then(res => res.json())\
        .then(data => \{\
            document.getElementById('app-title').innerText = data.title || "OFL Test";\
            questionsData = data.questions || [];\
            renderQuiz();\
        \});\
\});\
\
function renderQuiz() \{\
    const container = document.getElementById('main-content');\
    container.innerHTML = '';\
    userAnswers = \{\};\
\
    questionsData.forEach((q, index) => \{\
        const card = document.createElement('div');\
        card.className = 'card';\
        card.id = `q-card-$\{index\}`;\
\
        let optionsHTML = q.options.map((opt, optIdx) => \
            `<button class="option-btn" onclick="selectOption($\{index\}, $\{optIdx\})">$\{String.fromCharCode(65 + optIdx)\}) $\{opt\}</button>`\
        ).join('');\
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