import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';
let isPopupOpen = false;

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    if (card) {
        renderFact(FACTS[0]);
        setupGestures();
        updateStreak();
    }
});

// ==================== POPUPS ====================
function showPopup(title, content) {
    let oldPopup = document.querySelector('.info-popup, .definition-popup');
    if (oldPopup) oldPopup.remove();
    isPopupOpen = true;
    let overlay = document.createElement('div');
    overlay.className = 'info-popup';
    overlay.innerHTML = `
        <div class="popup-box">
            <div class="popup-handle"></div>
            <h4>${title}</h4>
            <p>${content}</p>
            <button class="close-popup-btn">Fermer</button>
        </div>
    `;
    document.body.appendChild(overlay);
    let popupBox = overlay.querySelector('.popup-box');
    let startY = 0;
    const closeWithAnimation = () => {
        popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        popupBox.style.transform = 'translateY(100px)';
        popupBox.style.opacity = '0';
        setTimeout(() => { overlay.remove(); isPopupOpen = false; }, 200);
    };
    overlay.querySelector('.close-popup-btn').onclick = closeWithAnimation;
    overlay.onclick = (e) => { if (e.target === overlay) closeWithAnimation(); };
}

function showDefinition(definition) {
    let oldPopup = document.querySelector('.definition-popup, .info-popup');
    if (oldPopup) oldPopup.remove();
    isPopupOpen = true;
    let overlay = document.createElement('div');
    overlay.className = 'definition-popup';
    overlay.innerHTML = `
        <div class="popup-box">
            <div class="popup-handle"></div>
            <h4>📖 Définition</h4>
            <p>${definition}</p>
            <button class="close-popup-btn">Fermer</button>
        </div>
    `;
    document.body.appendChild(overlay);
    let popupBox = overlay.querySelector('.popup-box');
    let startY = 0;
    const closeWithAnimation = () => {
        popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        popupBox.style.transform = 'translateY(100px)';
        popupBox.style.opacity = '0';
        setTimeout(() => { overlay.remove(); isPopupOpen = false; }, 200);
    };
    overlay.querySelector('.close-popup-btn').onclick = closeWithAnimation;
    overlay.onclick = (e) => { if (e.target === overlay) closeWithAnimation(); };
}

// ==================== COEUR DE L'APP ====================
function renderFact(fact) {
    const card = document.getElementById('card');
    if (!card || !fact) return;

    currentFact = fact;
    let text = fact.text;
    if (fact.hardWords) {
        fact.hardWords.forEach(hw => {
            const regex = new RegExp(`(${hw.word})`, 'gi');
            text = text.replace(regex, `<span class="hard-word" data-def="${hw.definition}">$1</span>`);
        });
    }

    card.innerHTML = `
        <div class="category-badge">${fact.category}</div>
        <h1 style="font-size: 1.8rem; margin-bottom: 15px;">${fact.title}</h1>
        <p style="font-size: 1.1rem; line-height: 1.6;">${text}</p>
        <button class="more-btn">En savoir plus</button>
    `;

    // Events sur les mots difficiles
    card.querySelectorAll('.hard-word').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); showDefinition(el.dataset.def); };
    });

    // Event sur le bouton En savoir plus
    card.querySelector('.more-btn').onclick = () => showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    
    // Animation d'entrée
    card.style.transition = 'none';
    card.style.transform = 'scale(0.9) translateY(20px)';
    card.style.opacity = '0';
    setTimeout(() => {
        card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = 'translateX(0) rotate(0) scale(1)';
        card.style.opacity = '1';
    }, 50);
}

function setupGestures() {
    const card = document.getElementById('card');
    let moveX = 0;

    card.ontouchstart = e => { 
        startX = e.touches[0].clientX; 
        card.style.transition = 'none'; 
    };

    card.ontouchmove = e => {
        moveX = e.touches[0].clientX - startX;
        const rotation = moveX / 15;
        card.style.transform = `translateX(${moveX}px) rotate(${rotation}deg)`;
        card.style.opacity = `${1 - Math.abs(moveX) / 600}`;
    };

    card.ontouchend = e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 120) {
            // Animation de sortie
            const outX = diff > 0 ? 1000 : -1000;
            card.style.transition = 'all 0.4s ease-in';
            card.style.transform = `translateX(${outX}px) rotate(${outX / 20}deg)`;
            card.style.opacity = '0';
            
            // Logique "Appris"
            if (diff > 0 && !learnedFacts.includes(currentFact.id)) {
                learnedFacts.push(currentFact.id);
                localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
                updateStreak();
            }
            
            // Nouvelle carte
            setTimeout(() => {
                const nextFact = FACTS[Math.floor(Math.random() * FACTS.length)];
                renderFact(nextFact);
            }, 300);
        } else {
            // Retour au centre si swipe trop court
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    };
}

// ==================== NAV & VUES ====================
function updateStreak() {
    const streakElem = document.getElementById('streak');
    if (streakElem) streakElem.innerHTML = `🔥 ${learnedFacts.length} appris`;
}

function showHistory() {
    currentView = 'history';
    updateActiveMenu();
    const list = FACTS.filter(f => learnedFacts.includes(f.id));
    document.getElementById('historyList').innerHTML = list.length === 0 ?
        '<div class="empty-state">📭 Aucun fait appris</div>' :
        list.slice().reverse().map(f => `
            <div class="history-item" onclick="window.showFactDetail(${f.id})">
                <h3>${f.title}</h3>
                <p>${f.text.substring(0, 70)}...</p>
                <small>📂 ${f.category}</small>
            </div>`).join('');
    document.getElementById('historyView').classList.add('open');
    enableSwipeBack();
}

function showStats() {
    currentView = 'stats';
    updateActiveMenu();
    const progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    const uniqueCategories = new Set(FACTS.filter(f => learnedFacts.includes(f.id)).map(f => f.category));
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learnedFacts.length}</div>
            <div style="color:#94a3b8">faits appris</div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${uniqueCategories.size}</div>
            <div style="color:#94a3b8">catégories explorées</div>
        </div>
    `;
    document.getElementById('statsView').classList.add('open');
    enableSwipeBack();
}

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats'));
    });
}

// Swipe back global
let globalStartX = 0;
const onGlobalTouchStart = (e) => globalStartX = e.touches[0].clientX;
const onGlobalTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - globalStartX;
    if (deltaX > 80 && !isPopupOpen && currentView !== 'daily') {
        window.closeHistory(); window.closeStats();
    }
};

function enableSwipeBack() {
    document.addEventListener('touchstart', onGlobalTouchStart);
    document.addEventListener('touchend', onGlobalTouchEnd);
}
function disableSwipeBack() {
    document.removeEventListener('touchstart', onGlobalTouchStart);
    document.removeEventListener('touchend', onGlobalTouchEnd);
}

// Exposer les fonctions globales
window.showFactDetail = (id) => {
    const fact = FACTS.find(f => f.id === id);
    if (fact) showPopup(fact.title, fact.moreInfo || fact.text);
};
window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };

// Listeners Navigation
document.querySelectorAll('.nav-item')[0].onclick = () => { window.closeHistory(); window.closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = showHistory;
document.querySelectorAll('.nav-item')[2].onclick = showStats;
