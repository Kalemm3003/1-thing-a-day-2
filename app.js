import { FACTS } from './data.js';

let learningFacts = JSON.parse(localStorage.getItem('learningFacts')) || [];
let knownFacts = JSON.parse(localStorage.getItem('knownFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';
let isPopupOpen = false;

const card = document.getElementById('card');
const swipeZone = document.querySelector('.card-container');

let lastReviewed = JSON.parse(localStorage.getItem('lastReviewed')) || {};

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
    let currentY = 0;
    
    const closeWithAnimation = () => {
        popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        popupBox.style.transform = 'translateY(100px)';
        popupBox.style.opacity = '0';
            setTimeout(() => {
                const next = getNextFact();
                card.style.transition = "none";
                card.style.transform = "translateX(0) rotate(0)";
                card.style.opacity = "0";
                renderFact(next);
                card.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                card.style.opacity = "1";
            }, 250);
        } else {
            card.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    };
}

function showHistory() {
    currentView = 'history';
    updateActiveMenu();
    const list = FACTS.filter(f => [...learningFacts, ...knownFacts].includes(f.id));
    document.getElementById('historyList').innerHTML = list.length === 0 ? '<div class="empty-state">📭 Aucun fait vu</div>' :
        list.slice().reverse().map(f => {
            let status = learningFacts.includes(f.id) ? '📚 En apprentissage' : '✅ Su';
            return `<div class="history-item" onclick="window.showFactDetail(${f.id})">
                <h3>${f.title}</h3>
                <p>${f.text.substring(0, 70)}...</p>
                <small>📂 ${f.category} | ${status}</small>
            </div>`;
        }).join('');
    document.getElementById('historyView').classList.add('open');
    enableSwipeBack();
}

function showStats() {
    currentView = 'stats';
    updateActiveMenu();
    const total = FACTS.length;
    const learningCount = learningFacts.length;
    const knownCount = knownFacts.length;
    const seenCount = learningCount + knownCount;
    const progress = Math.min(Math.round((seenCount / total) * 100), 100);
    const uniqueCategories = new Set(FACTS.filter(f => [...learningFacts, ...knownFacts].includes(f.id)).map(f => f.category));
    
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learningCount}</div>
            <div style="color:#94a3b8">📚 En apprentissage</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${knownCount}</div>
            <div style="color:#94a3b8">✅ Su</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${seenCount} / ${total}</div>
            <div style="color:#94a3b8">faits vus</div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width:${progress}%"></div>
            </div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${uniqueCategories.size}</div>
            <div style="color:#94a3b8">catégories</div>
        </div>`;
    document.getElementById('statsView').classList.add('open');
    enableSwipeBack();
}

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        const isActive = (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats');
        item.classList.toggle('active', isActive);
    });
}

let globalStartX = 0;
function onGlobalTouchStart(e) { globalStartX = e.touches[0].clientX; }
function onGlobalTouchEnd(e) {
    const deltaX = e.changedTouches[0].clientX - globalStartX;
    if (deltaX > 80 && !isPopupOpen && currentView !== 'daily') { closeHistory(); closeStats(); }
}
function enableSwipeBack() { document.addEventListener('touchstart', onGlobalTouchStart); document.addEventListener('touchend', onGlobalTouchEnd); }
function disableSwipeBack() { document.removeEventListener('touchstart', onGlobalTouchStart); document.removeEventListener('touchend', onGlobalTouchEnd); }

window.showFactDetail = (id) => { 
    const fact = FACTS.find(f => f.id === id); 
    if (fact) showPopup(fact.title, fact.moreInfo || fact.text); 
};
window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };

document.querySelectorAll('.nav-item')[0].onclick = () => { window.closeHistory(); window.closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = showHistory;
document.querySelectorAll('.nav-item')[2].onclick = showStats;

let firstFact = FACTS.find(f => ![...learningFacts, ...knownFacts].includes(f.id)) || FACTS[0];
renderFact(firstFact);
setupGestures();
updateStats();
