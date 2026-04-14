import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';

const card = document.getElementById('card');

function showPopup(title, content) {
    let oldPopup = document.querySelector('.info-popup, .definition-popup');
    if (oldPopup) oldPopup.remove();
    
    let overlay = document.createElement('div');
    overlay.className = 'info-popup';
    overlay.innerHTML = `
        <div class="popup-box">
            <h4>${title}</h4>
            <p>${content}</p>
            <button class="close-popup-btn">Fermer</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    let popupBox = overlay.querySelector('.popup-box');
    let startY = 0;
    let currentY = 0;
    
    overlay.querySelector('.close-popup-btn').onclick = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    
    // Swipe vers le bas avec suivi du doigt
    popupBox.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        popupBox.style.transition = 'none';
        e.stopPropagation();
    });
    
    popupBox.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const moveY = currentY - startY;
        if (moveY > 0) {
            popupBox.style.transform = `translateY(${moveY}px)`;
            popupBox.style.opacity = `${1 - moveY / 300}`;
        }
        e.stopPropagation();
    });
    
    popupBox.addEventListener('touchend', (e) => {
        const moveY = currentY - startY;
        popupBox.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        if (moveY > 100) {
            overlay.remove();
        } else {
            popupBox.style.transform = 'translateY(0)';
            popupBox.style.opacity = '1';
        }
        e.stopPropagation();
    });
}

function showDefinition(definition) {
    let oldPopup = document.querySelector('.definition-popup, .info-popup');
    if (oldPopup) oldPopup.remove();
    
    let overlay = document.createElement('div');
    overlay.className = 'definition-popup';
    overlay.innerHTML = `
        <div class="popup-box">
            <h4>📖 Définition</h4>
            <p>${definition}</p>
            <button class="close-popup-btn">Fermer</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    let popupBox = overlay.querySelector('.popup-box');
    let startY = 0;
    let currentY = 0;
    
    overlay.querySelector('.close-popup-btn').onclick = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    
    // Swipe vers le bas avec suivi du doigt
    popupBox.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        popupBox.style.transition = 'none';
        e.stopPropagation();
    });
    
    popupBox.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const moveY = currentY - startY;
        if (moveY > 0) {
            popupBox.style.transform = `translateY(${moveY}px)`;
            popupBox.style.opacity = `${1 - moveY / 300}`;
        }
        e.stopPropagation();
    });
    
    popupBox.addEventListener('touchend', (e) => {
        const moveY = currentY - startY;
        popupBox.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        if (moveY > 100) {
            overlay.remove();
        } else {
            popupBox.style.transform = 'translateY(0)';
            popupBox.style.opacity = '1';
        }
        e.stopPropagation();
    });
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
        el.onclick = (e) => { e.stopPropagation(); showDefinition(el.dataset.def); };
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
            }
            renderFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    };
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
        <div class="stats-card">
            <div class="stats-number">${FACTS.length}</div>
            <div style="color:#94a3b8">faits disponibles</div>
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

let globalStartX = 0;
let isSwipingBack = false;

function enableSwipeBack() {
    document.addEventListener('touchstart', onGlobalTouchStart);
    document.addEventListener('touchend', onGlobalTouchEnd);
}

function disableSwipeBack() {
    document.removeEventListener('touchstart', onGlobalTouchStart);
    document.removeEventListener('touchend', onGlobalTouchEnd);
}

function onGlobalTouchStart(e) {
    globalStartX = e.touches[0].clientX;
    isSwipingBack = true;
}

function onGlobalTouchEnd(e) {
    if (!isSwipingBack) return;
    isSwipingBack = false;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - globalStartX;
    if (deltaX > 60) {
        if (document.getElementById('historyView').classList.contains('open')) {
            closeHistory();
        } else if (document.getElementById('statsView').classList.contains('open')) {
            closeStats();
        }
    }
}

window.showFactDetail = (id) => {
    const fact = FACTS.find(f => f.id === id);
    if (fact) showPopup(fact.title, fact.moreInfo || fact.text);
};
window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };

document.querySelectorAll('.nav-item')[0].onclick = () => { window.closeHistory(); window.closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = showHistory;
document.querySelectorAll('.nav-item')[2].onclick = showStats;

renderFact(FACTS[0]);
setupGestures();
updateStreak();
