import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';

const card = document.getElementById('card');

// ==================== GESTION DES POPUPS ====================
function closeAllPopups() {
    const popup = document.querySelector('.info-popup, .definition-popup');
    const overlay = document.querySelector('.popup-overlay');
    if (popup) popup.remove();
    if (overlay) overlay.remove();
}

function createPopup(title, content) {
    closeAllPopups();

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.innerHTML = `
        <div style="width: 40px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 10px; margin: -10px auto 15px auto;"></div>
        <h4>${title}</h4>
        <p>${content}</p>
        <button id="popupCloseBtn">Fermer</button>
    `;
    document.body.appendChild(popup);

    // 1. Fermer via bouton
    popup.querySelector('#popupCloseBtn').onclick = closeAllPopups;

    // 2. Fermer via clic extérieur (overlay)
    overlay.onclick = closeAllPopups;

    // 3. Fermer via swipe vers le bas
    let touchY = 0;
    popup.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, {passive: true});
    popup.addEventListener('touchmove', e => {
        const moveY = e.touches[0].clientY - touchY;
        if (moveY > 0) {
            popup.style.transform = `translateY(${moveY}px)`;
        }
    }, {passive: true});
    popup.addEventListener('touchend', e => {
        const diffY = e.changedTouches[0].clientY - touchY;
        if (diffY > 100) {
            closeAllPopups();
        } else {
            popup.style.transform = 'translateY(0)';
        }
    }, {passive: true});
}

// ==================== SWIPE RETOUR GLOBAL ====================
let globalStartX = 0;
document.addEventListener('touchstart', e => {
    globalStartX = e.touches[0].clientX;
}, {passive: true});

document.addEventListener('touchend', e => {
    const diffX = e.changedTouches[0].clientX - globalStartX;
    
    // Si on est dans une vue secondaire et qu'on swipe de gauche à droite
    if (currentView !== 'daily' && diffX > 80) {
        closeHistory();
        closeStats();
    }
}, {passive: true});

// ==================== LOGIQUE APP ====================
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

function renderFact(fact) {
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

    card.querySelectorAll('.hard-word').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); createPopup('📖 Définition', el.dataset.def); };
    });

    card.querySelector('.more-btn').onclick = () => createPopup(currentFact.title, currentFact.moreInfo || currentFact.text);

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
        card.style.transition = 'all 0.3s ease';
        if (Math.abs(diff) > 100) {
            if (diff > 0 && !learnedFacts.includes(currentFact.id)) {
                learnedFacts.push(currentFact.id);
                localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
                updateStreak();
                showToast('✅ Appris !');
            }
            card.style.opacity = '0';
            setTimeout(() => {
                const pool = FACTS.filter(f => !learnedFacts.includes(f.id));
                renderFact(pool.length > 0 ? pool[Math.floor(Math.random()*pool.length)] : FACTS[0]);
            }, 300);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    });
}

// ==================== NAVIGATION ====================
function showHistory() {
    currentView = 'history';
    updateActiveMenu();
    const list = FACTS.filter(f => learnedFacts.includes(f.id));
    document.getElementById('historyList').innerHTML = list.length === 0 ? '<div class="empty-state">📭 Aucun fait appris</div>' : 
        list.reverse().map(f => `<div class="history-item"><h3>${f.title}</h3><p>${f.category}</p></div>`).join('');
    document.getElementById('historyView').classList.add('open');
}

function showStats() {
    currentView = 'stats';
    updateActiveMenu();
    let progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learnedFacts.length}</div>
            <div>faits appris</div>
            <div style="margin-top:10px;background:#1e293b;border-radius:10px;height:8px;">
                <div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div>
            </div>
        </div>
    `;
    document.getElementById('statsView').classList.add('open');
}

function closeHistory() { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); }
function closeStats() { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); }

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats'));
    });
}

document.querySelectorAll('.nav-item')[0].onclick = () => { closeHistory(); closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = showHistory;
document.querySelectorAll('.nav-item')[2].onclick = showStats;

window.closeHistory = closeHistory;
window.closeStats = closeStats;

// INIT
renderFact(FACTS[0]);
setupGestures();
updateStreak();
