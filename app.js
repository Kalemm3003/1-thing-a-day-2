import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';
let currentTheme = 'Tout'; // Variable de thème

const card = document.getElementById('card');

// ==================== POPUPS ====================
function showPopup(title, content) {
    let oldPopup = document.querySelector('.info-popup, .definition-popup');
    if (oldPopup) oldPopup.remove();
    let popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.innerHTML = `<h4>${title}</h4><p>${content}</p><button>Fermer</button>`;
    document.body.appendChild(popup);
    popup.querySelector('button').onclick = () => popup.remove();
}

function showDefinition(definition) {
    let oldPopup = document.querySelector('.definition-popup, .info-popup');
    if (oldPopup) oldPopup.remove();
    let popup = document.createElement('div');
    popup.className = 'definition-popup';
    popup.innerHTML = `<h4>📖 Définition</h4><p>${definition}</p><button>Fermer</button>`;
    document.body.appendChild(popup);
    popup.querySelector('button').onclick = () => popup.remove();
}

function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function updateStreak() {
    let streakElem = document.getElementById('streak');
    if (streakElem) streakElem.innerHTML = `🔥 ${learnedFacts.length} appris`;
}

// ==================== LOGIQUE FILTRAGE ====================
function getDailyFact() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    let dailyFact = FACTS.find(f => f.dayOfYear === dayOfYear);
    return dailyFact || FACTS[0];
}

function getNextUnlearnedFact() {
    // FILTRE PAR THÈME ICI
    let pool = (currentTheme === 'Tout') ? FACTS : FACTS.filter(f => f.category === currentTheme);
    let availableFacts = pool.filter(f => !learnedFacts.includes(f.id));

    if (availableFacts.length === 0) {
        showToast('🏆 Plus rien dans ce thème !');
        return pool[Math.floor(Math.random() * pool.length)] || FACTS[0];
    }
    return availableFacts[Math.floor(Math.random() * availableFacts.length)];
}

function markAsLearned(id) {
    if (!learnedFacts.includes(id)) {
        learnedFacts.push(id);
        localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
        updateStreak();
        showToast('✅ Appris !');
    }
}

function renderFact(fact) {
    if (!fact) return;
    currentFact = fact;
    let text = fact.text;
    if (fact.hardWords) {
        fact.hardWords.forEach(hw => {
            const regex = new RegExp(`(${hw.word})`, 'gi');
            text = text.replace(regex, `<span class="hard-word" data-def="${hw.definition.replace(/"/g, '&quot;')}">$1</span>`);
        });
    }
    card.innerHTML = `<div class="category-badge">${fact.category}</div><h1>${fact.title}</h1><p>${text}</p><button class="more-btn">En savoir plus</button>`;
    
    card.querySelectorAll('.hard-word').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); showDefinition(el.dataset.def); };
    });
    card.querySelector('.more-btn').onclick = () => showPopup(fact.title, fact.moreInfo || fact.text);
    
    card.style.transform = 'translateX(0) rotate(0)';
    card.style.opacity = '1';
}

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
            if (diff > 0) markAsLearned(currentFact.id);
            nextFact();
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    });
}

function nextFact() {
    card.style.opacity = '0';
    setTimeout(() => renderFact(getNextUnlearnedFact()), 300);
}

// ==================== NAVIGATION ====================
function showHistory() {
    currentView = 'history'; updateActiveMenu();
    let historyList = document.getElementById('historyList');
    let learnedFactsList = FACTS.filter(f => learnedFacts.includes(f.id));
    historyList.innerHTML = learnedFactsList.length === 0 ? '<div class="empty-state">📭 Aucun fait appris</div>' : 
        learnedFactsList.slice().reverse().map(f => `<div class="history-item" onclick="window.showFactDetail(${f.id})"><h3>${f.title}</h3><p>${f.text.substring(0, 80)}...</p></div>`).join('');
    document.getElementById('historyView').classList.add('open');
}

function showStats() {
    currentView = 'stats'; updateActiveMenu();
    let progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    document.getElementById('statsContainer').innerHTML = `<div class="stats-card"><div class="stats-number">${learnedFacts.length}</div><div>faits appris</div><div style="background:#1e293b;height:8px;border-radius:10px;margin-top:10px;"><div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div></div></div>`;
    document.getElementById('statsView').classList.add('open');
}

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats'));
    });
}

// ==================== INIT ====================
function init() {
    renderFact(getDailyFact());
    setupGestures();
    updateStreak();

    const themeLabel = document.getElementById('current-theme-label');
    const categorySelect = document.getElementById('category-select');

    categorySelect.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        themeLabel.innerText = currentTheme;
        nextFact();
    });
}

document.querySelectorAll('.nav-item').forEach((item, i) => {
    item.onclick = () => { if(i===0) { document.getElementById('historyView').classList.remove('open'); document.getElementById('statsView').classList.remove('open'); currentView='daily'; updateActiveMenu(); } else if(i===1) showHistory(); else showStats(); };
});

window.showFactDetail = (id) => showPopup(FACTS.find(f=>f.id===id).title, FACTS.find(f=>f.id===id).moreInfo);
window.closeHistory = () => document.getElementById('historyView').classList.remove('open');
window.closeStats = () => document.getElementById('statsView').classList.remove('open');

init();
