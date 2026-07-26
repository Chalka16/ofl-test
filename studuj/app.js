// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Registrace Service Workeru pro PWA funkčnost
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrován úspěšně:', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registrace selhala:', error);
                });
        });
    }

    // Plynulé přechody (Fade-in) při načtení stránky
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 50);

    // Animace karet na domovské obrazovce
    const cards = document.querySelectorAll('.nav-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        card.classList.add('slide-up-animation');
    });

    // Ošetření prázdných odkazů (např. karta Testy)
    const testCard = document.getElementById('testy-card');
    if(testCard) {
        testCard.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Modul Testy bude zpřístupněn v další verzi aplikace.');
        });
    }
});
