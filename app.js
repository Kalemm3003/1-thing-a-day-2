import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';
let currentTheme = 'Tout';

const card = document.getElementById('card');

// ==================== POPUPS & UTILS ====================
function updateStreak() {
    const streakElem = document.getElementById('streak');
    if (streakElem) streakElem.innerHTML = `🔥 ${learnedFacts.length} appris`;
}

function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ==================== FILTRAGE & RENDU ====================
function getNextFact() {
    let pool = (currentTheme === 'Tout') ? FACTS : FACTS.filter(f => f.category === currentTheme);
    let available = pool.filter(f => !learnedFacts.includes(f.id));
    if (available.length === 0) return pool[Math.floor(Math.random() * pool.length)];
    return available[Math.floor(Math.random() * available.length)];
}

function renderFact(fact) {
    if (!fact) return;
    currentFact = fact;
    let text = fact.text;
    if (fact.hardWords) {
        fact.hardWords.forEach(hw => {
            const regex = new RegExp(`(${hw.word})`, 'gi');
            text = text.replace(regex, `<span class="hard-word">${hw.word}</span>`);
        });
    }
    card.innerHTML = `<div class="category-badge">${fact.category}</div><h1>${fact.title}</h1><p>${text}</p><button class="more-btn">En savoir plus</button>`;
    card.style.transform = 'translateX(0) rotate(0)';
    card.style.opacity = '1';
}

// ==================== GESTION SWIPE CARTES ====================
function setupGestures() {
    card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; card.style.transition = 'none'; });
    card.addEventListener('touchmove', e => {
        const move = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${move}px) rotate(${move / 20}deg)`;
        card.style.opacity = `${1 - Math.abs(move) / 500}`;
    });
    card.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        card.style.transition = 'all 0.4s ease';
        if (Math.abs(diff) > 100) {
            if (diff > 0) {
                if (!learnedFacts.includes(currentFact.id)) {
                    learnedFacts.push(currentFact.id);
                    localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
                    updateStreak();
                    showToast('✅ Appris !');
                }
            }
            card.style.opacity = '0';
            setTimeout(() => renderFact(getNextFact()), 300);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    });
}

// ==================== SWIPE RETOUR (GLOBAL) ====================
let backStartX = 0;
document.addEventListener('touchstart', e => { backStartX = e.touches[0].clientX; });
document.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - backStartX;
    if (diff > 80 && currentView !== 'daily') {
        closeHistory();
        closeStats();
    }
});

// ==================== NAVIGATION ====================
function showHistory() {
    currentView = 'history'; updateActiveMenu();
    let historyList = document.getElementById('historyList');
    let learnedList = FACTS.filter(f => learnedFacts.includes(f.id));
    historyList.innerHTML = learnedList.length === 0 ? '<div class="empty-state">📭 Aucun fait appris</div>' :
        learnedList.slice().reverse().map(f => `<div class="history-item"><h3>${f.title}</h3><p>${f.category}</p></div>`).join('');
    document.getElementById('historyView').classList.add('open');
}

function showStats() {
    currentView = 'stats'; updateActiveMenu();
    let progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    document.getElementById('statsContainer').innerHTML = `<div class="stats-card"><div class="stats-number">${learnedFacts.length}</div><div>appris</div><div style="background:#1e293b;height:8px;border-radius:10px;margin-top:10px;"><div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div></div></div>`;
    document.getElementById('statsView').classList.add('open');
}

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats'));
    });
}

window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); };

// ==================== INIT ====================
function init() {
    renderFact(FACTS[0]);
    updateStreak();
    setupGestures();

    const select = document.getElementById('category-select');
    const label = document.getElementById('current-theme-label');
    select.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        label.innerText = currentTheme;
        renderFact(getNextFact());
    });

    document.querySelectorAll('.nav-item').forEach((btn, i) => {
        btn.onclick = () => { 
            if (i === 0) { window.closeHistory(); window.closeStats(); }
            else if (i === 1) showHistory();
            else showStats();
        };
    });
}

init();
