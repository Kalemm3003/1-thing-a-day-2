import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';

const card = document.getElementById('card');

// ==================== POPUPS (Version d'origine) ====================
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

// ==================== LOGIQUE DE BASE ====================
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
            if (el.dataset.def) showDefinition(el.dataset.def);
        });
    });

    card.querySelector('.more-btn').onclick = () => showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    card.style.transform = 'translateX(0) rotate(0)';
    card.style.opacity = '1';
}

function setupGestures() {
    card.ontouchstart = e => { startX = e.touches[0].clientX; card.style.transition = 'none'; };
    card.ontouchmove = e => {
        const move = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${move}px) rotate(${move / 20}deg)`;
        card.style.opacity = `${1 - Math.abs(move) / 500}`;
    };
    card.ontouchend = e => {
        const diff = e.changedTouches[0].clientX - startX;
        card.style.transition = 'all 0.3s ease';
        if (Math.abs(diff) > 100) {
            if (diff > 0 && !learnedFacts.includes(currentFact.id)) {
                learnedFacts.push(currentFact.id);
                localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
                updateStreak();
                showToast('✅ Appris !');
            }
            renderFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    };
}

// ==================== RENDU HISTORIQUE & STATS ====================
function showHistory() {
    currentView = 'history';
    updateActiveMenu();
    const list = FACTS.filter(f => learnedFacts.includes(f.id));
    document.getElementById('historyList').innerHTML = list.length === 0 ? 
        '<div class="empty-state">📭 Aucun fait appris</div>' : 
        list.slice().reverse().map(f => `
            <div class="history-item" onclick="window.showFactDetail(${f.id})">
                <h3>${f.title}</h3>
                <p>${f.text.substring(0, 75)}...</p>
                <small>📂 ${f.category}</small>
            </div>`).join('');
    document.getElementById('historyView').classList.add('open');
}

function showStats() {
    currentView = 'stats';
    updateActiveMenu();
    const progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learnedFacts.length}</div>
            <div style="color:#94a3b8; text-transform:uppercase; font-size:12px; letter-spacing:1px;">faits appris</div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${new Set(FACTS.filter(f => learnedFacts.includes(f.id)).map(f => f.category)).size}</div>
            <div style="color:#94a3b8; text-transform:uppercase; font-size:12px; letter-spacing:1px;">catégories explorées</div>
        </div>
    `;
    document.getElementById('statsView').classList.add('open');
}

// ==================== NAVIGATION & SWIPE RETOUR ====================
let gStartX = 0;
document.addEventListener('touchstart', e => gStartX = e.touches[0].clientX);
document.addEventListener('touchend', e => {
    if (currentView !== 'daily' && (e.changedTouches[0].clientX - gStartX > 80)) {
        closeHistory(); closeStats();
    }
});

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats'));
    });
}

window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); };
window.showFactDetail = (id) => showPopup(FACTS.find(f => f.id === id).title, FACTS.find(f => f.id === id).moreInfo || FACTS.find(f => f.id === id).text);

document.querySelectorAll('.nav-item')[0].onclick = () => { window.closeHistory(); window.closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = showHistory;
document.querySelectorAll('.nav-item')[2].onclick = showStats;

// INIT
renderFact(FACTS[0]);
setupGestures();
updateStreak();
