import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';

const card = document.getElementById('card');

// ==================== POPUPS ====================
function showPopup(title, content) {
    let oldPopup = document.querySelector('.info-popup, .definition-popup');
    if (oldPopup) oldPopup.remove();

    let popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.innerHTML = `
        <h4>${title}</h4>
        <p>${content}</p>
        <button>Fermer</button>
    `;
    document.body.appendChild(popup);

    popup.querySelector('button').onclick = () => popup.remove();
    popup.addEventListener('click', (e) => {
        if (e.target === popup || e.target === popup.querySelector('button')) {
            popup.remove();
        }
    });
}

function showDefinition(definition) {
    let oldPopup = document.querySelector('.definition-popup, .info-popup');
    if (oldPopup) oldPopup.remove();

    let popup = document.createElement('div');
    popup.className = 'definition-popup';
    popup.innerHTML = `
        <h4>📖 Définition</h4>
        <p>${definition}</p>
        <button>Fermer</button>
    `;
    document.body.appendChild(popup);

    popup.querySelector('button').onclick = () => popup.remove();
    popup.addEventListener('click', (e) => {
        if (e.target === popup || e.target === popup.querySelector('button')) {
            popup.remove();
        }
    });
}

function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ==================== STREAK ====================
function updateStreak() {
    let streakElem = document.getElementById('streak');
    if (streakElem) {
        let count = learnedFacts.length;
        streakElem.innerHTML = `🔥 ${count} appris`;
    }
}
updateStreak();

// ==================== FAIT DU JOUR ====================
function getDailyFact() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

    let dailyFact = FACTS.find(f => f.dayOfYear === dayOfYear);
    if (!dailyFact) {
        dailyFact = FACTS[0];
    }
    return dailyFact;
}

// ==================== PROCHAIN FAIT ====================
function getNextUnlearnedFact() {
    let availableFacts = FACTS.filter(f => !learnedFacts.includes(f.id));

    if (availableFacts.length === 0) {
        showToast('🏆 Félicitations ! Tu as tout appris !');
        return FACTS[Math.floor(Math.random() * FACTS.length)];
    }
    return availableFacts[Math.floor(Math.random() * availableFacts.length)];
}

// ==================== MARQUER COMME APPRIS ====================
function markAsLearned(id) {
    if (!learnedFacts.includes(id)) {
        learnedFacts.push(id);
        localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
        updateStreak();
        showToast('✅ Appris !');
        return true;
    }
    return false;
}

// ==================== RENDER FACT ====================
function renderFact(fact) {
    currentFact = fact;

    let text = fact.text;
    if (fact.hardWords) {
        fact.hardWords.forEach(hw => {
            const regex = new RegExp(`(${hw.word})`, 'gi');
            text = text.replace(regex, `<span class="hard-word" data-def="${hw.definition.replace(/"/g, '&quot;')}">$1</span>`);
        });
    }

    card.innerHTML = `
        <div class="category-badge">${fact.category}</div>
        <h1 style="font-size: 1.8rem; margin-bottom: 15px;">${fact.title}</h1>
        <p style="font-size: 1.1rem; line-height: 1.6;">${text}</p>
        <button class="more-btn">En savoir plus</button>
    `;

    card.querySelectorAll('.hard-word').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            let def = el.dataset.def;
            if (def) showDefinition(def);
        });
    });

    card.querySelector('.more-btn').addEventListener('click', () => {
        showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    });

    card.style.transform = 'translateX(0) rotate(0)';
    card.style.opacity = '1';
}

// ==================== CHARGEMENT INITIAL ====================
function loadFactOfDay() {
    const dailyFact = getDailyFact();
    renderFact(dailyFact);
}

// ==================== SWIPE PROGRESSIF ====================
function setupGestures() {
    card.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        card.style.transition = 'none';
    });

    card.addEventListener('touchmove', e => {
        const move = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${move}px) rotate(${move / 20}deg)`;
        card.style.opacity = `${1 - Math.abs(move) / 500}`;
    });

    card.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        if (Math.abs(diff) > 100) {
            if (diff > 0) {
                markAsLearned(currentFact.id);
            }
            nextFact();
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    });
}

function nextFact() {
    card.style.opacity = '0';
    setTimeout(() => {
        const next = getNextUnlearnedFact();
        renderFact(next);
    }, 300);
}

// ==================== HISTORIQUE ====================
function showHistory() {
    currentView = 'history';
    updateActiveMenu();

    let historyList = document.getElementById('historyList');
    let learnedFactsList = FACTS.filter(f => learnedFacts.includes(f.id));

    if (learnedFactsList.length === 0) {
        historyList.innerHTML = '<div class="empty-state">📭 Aucun fait appris<br>Swipe à droite pour apprendre !</div>';
    } else {
        historyList.innerHTML = learnedFactsList.slice().reverse().map(f =>
            `<div class="history-item" onclick="window.showFactDetail(${f.id})">
                <h3>${f.title}</h3>
                <p>${f.text.substring(0, 80)}...</p>
                <small>📂 ${f.category}</small>
            </div>`
        ).join('');
    }
    document.getElementById('historyView').classList.add('open');
    enableSwipeBack();
}

function showFactDetail(factId) {
    let fact = FACTS.find(f => f.id === factId);
    if (fact) {
        showPopup(fact.title, fact.moreInfo || fact.text);
    }
}

function closeHistory() {
    document.getElementById('historyView').classList.remove('open');
    disableSwipeBack();
}

// ==================== STATS ====================
function showStats() {
    currentView = 'stats';
    updateActiveMenu();

    let uniqueCategories = new Set(FACTS.filter(f => learnedFacts.includes(f.id)).map(f => f.category));
    let progress = Math.round((learnedFacts.length / FACTS.length) * 100);

    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learnedFacts.length}</div>
            <div>faits appris</div>
            <div style="margin-top:10px;background:#1e293b;border-radius:10px;height:8px;">
                <div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div>
            </div>
        </div>
        <div class="stats-card"><div class="stats-number">${uniqueCategories.size}</div><div>catégories explorées</div></div>
        <div class="stats-card"><div class="stats-number">${FACTS.length}</div><div>faits disponibles</div></div>
    `;
    document.getElementById('statsView').classList.add('open');
    enableSwipeBack();
}

function closeStats() {
    document.getElementById('statsView').classList.remove('open');
    disableSwipeBack();
}

// ==================== SWIPE POUR REVENIR ====================
let swipeBackStartX = 0;
let swipeBackArea = null;

function enableSwipeBack() {
    if (!swipeBackArea) {
        swipeBackArea = document.createElement('div');
        swipeBackArea.className = 'swipe-back-area';
        document.body.appendChild(swipeBackArea);
    }
    swipeBackArea.classList.add('active');
    swipeBackArea.addEventListener('touchstart', onSwipeBackStart);
    swipeBackArea.addEventListener('touchend', onSwipeBackEnd);
}

function disableSwipeBack() {
    if (swipeBackArea) {
        swipeBackArea.classList.remove('active');
        swipeBackArea.removeEventListener('touchstart', onSwipeBackStart);
        swipeBackArea.removeEventListener('touchend', onSwipeBackEnd);
    }
}

function onSwipeBackStart(e) {
    swipeBackStartX = e.touches[0].clientX;
}

function onSwipeBackEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - swipeBackStartX;

    if (deltaX > 50) {
        if (document.getElementById('historyView').classList.contains('open')) {
            closeHistory();
        } else if (document.getElementById('statsView').classList.contains('open')) {
            closeStats();
        }
    }
}

// ==================== DAILY ====================
function showDaily() {
    currentView = 'daily';
    updateActiveMenu();
    loadFactOfDay();
}

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (currentView === 'daily') document.querySelectorAll('.nav-item')[0].classList.add('active');
    if (currentView === 'history') document.querySelectorAll('.nav-item')[1].classList.add('active');
    if (currentView === 'stats') document.querySelectorAll('.nav-item')[2].classList.add('active');
}

// ==================== NAVIGATION ====================
document.querySelectorAll('.nav-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === 0) showDaily();
        if (index === 1) showHistory();
        if (index === 2) showStats();
    });
});

// ==================== INIT ====================
function init() {
    loadFactOfDay();
    setupGestures();
    updateStreak();
}

window.showFactDetail = showFactDetail;
window.closeHistory = closeHistory;
window.closeStats = closeStats;
window.showDefinition = showDefinition;
window.showPopup = showPopup;

init();
