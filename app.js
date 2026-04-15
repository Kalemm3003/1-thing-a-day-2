import { FACTS } from './data.js';
let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let currentView = 'daily';
let isPopupOpen = false;
const card = document.getElementById('card');

function showPopup(title, content) {
    let oldPopup = document.querySelector('.info-popup, .definition-popup');
    if (oldPopup) oldPopup.remove();
    isPopupOpen = true;
    let overlay = document.createElement('div');
    overlay.className = 'info-popup';
    overlay.innerHTML = `<div class="popup-box"><div class="popup-handle"></div><h4>${title}</h4><p>${content}</p><button class="close-popup-btn">Fermer</button></div>`;
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
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWithAnimation(); });
    popupBox.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; popupBox.style.transition = 'none'; e.stopPropagation(); });
    popupBox.addEventListener('touchmove', (e) => {
        const moveY = e.touches[0].clientY - startY;
        if (moveY > 0) { popupBox.style.transform = `translateY(${moveY}px)`; popupBox.style.opacity = `${1 - moveY / 300}`; }
        e.stopPropagation();
    });
    popupBox.addEventListener('touchend', (e) => {
        const moveY = e.changedTouches[0].clientY - startY;
        if (moveY > 100) closeWithAnimation();
        else { popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease'; popupBox.style.transform = 'translateY(0)'; popupBox.style.opacity = '1'; }
        e.stopPropagation();
    });
}

function showDefinition(definition) {
    let oldPopup = document.querySelector('.definition-popup, .info-popup');
    if (oldPopup) oldPopup.remove();
    isPopupOpen = true;
    let overlay = document.createElement('div');
    overlay.className = 'definition-popup';
    overlay.innerHTML = `<div class="popup-box"><div class="popup-handle"></div><h4>📖 Définition</h4><p>${definition}</p><button class="close-popup-btn">Fermer</button></div>`;
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
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWithAnimation(); });
    popupBox.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; popupBox.style.transition = 'none'; e.stopPropagation(); });
    popupBox.addEventListener('touchmove', (e) => {
        const moveY = e.touches[0].clientY - startY;
        if (moveY > 0) { popupBox.style.transform = `translateY(${moveY}px)`; popupBox.style.opacity = `${1 - moveY / 300}`; }
        e.stopPropagation();
    });
    popupBox.addEventListener('touchend', (e) => {
        const moveY = e.changedTouches[0].clientY - startY;
        if (moveY > 100) closeWithAnimation();
        else { popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease'; popupBox.style.transform = 'translateY(0)'; popupBox.style.opacity = '1'; }
        e.stopPropagation();
    });
}

function updateStreak() {
    let streakElem = document.getElementById('streak');
    // On ne compte que les faits appris qui existent encore dans la base
    const validLearnedCount = learnedFacts.filter(id => FACTS.some(f => f.id === id)).length;
    if (streakElem) streakElem.innerHTML = `🔥 ${validLearnedCount} appris`;
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
    card.innerHTML = `<div class="category-badge">${fact.category}</div><h1>${fact.title}</h1><p>${text}</p><button class="more-btn">En savoir plus</button>`;
    card.querySelectorAll('.hard-word').forEach(el => { el.onclick = (e) => { e.stopPropagation(); showDefinition(el.dataset.def); }; });
    card.querySelector('.more-btn').onclick = () => showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    card.style.transition = 'none'; card.style.transform = 'scale(0.9) translateY(20px)'; card.style.opacity = '0';
    setTimeout(() => { card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; card.style.transform = 'translateX(0) rotate(0) scale(1)'; card.style.opacity = '1'; }, 10);
}

function setupGestures() {
    let moveX = 0;
    card.ontouchstart = e => { startX = e.touches[0].clientX; card.style.transition = 'none'; };
    card.ontouchmove = e => {
        moveX = e.touches[0].clientX - startX;
        const rotation = moveX / 15;
        card.style.transform = `translateX(${moveX}px) rotate(${rotation}deg)`;
        card.style.opacity = `${1 - Math.abs(moveX) / 1000}`;
    };
    card.ontouchend = e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 120) {
            const outX = diff > 0 ? 1000 : -1000;
            card.style.transition = 'all 0.5s ease-in'; card.style.transform = `translateX(${outX}px) rotate(${outX / 20}deg)`; card.style.opacity = '0';
            if (diff > 0 && !learnedFacts.includes(currentFact.id)) {
                learnedFacts.push(currentFact.id);
                localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
                updateStreak();
            }
            setTimeout(() => { renderFact(FACTS[Math.floor(Math.random() * FACTS.length)]); }, 300);
        } else {
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translateX(0) rotate(0)'; card.style.opacity = '1';
        }
    };
}

function showHistory() {
    currentView = 'history'; updateActiveMenu();
    const list = FACTS.filter(f => learnedFacts.includes(f.id));
    document.getElementById('historyList').innerHTML = list.length === 0 ? '<div class="empty-state">📭 Aucun fait appris</div>' :
        list.slice().reverse().map(f => `<div class="history-item" onclick="window.showFactDetail(${f.id})"><h3>${f.title}</h3><p>${f.text.substring(0, 70)}...</p><small>📂 ${f.category}</small></div>`).join('');
    document.getElementById('historyView').classList.add('open');
    enableSwipeBack();
}

function showStats() {
    currentView = 'stats'; updateActiveMenu();
    // On nettoie les stats pour ne compter que ce qui existe dans data.js
    const validLearnedIDs = learnedFacts.filter(id => FACTS.some(f => f.id === id));
    const count = validLearnedIDs.length;
    const total = FACTS.length;
    const progress = Math.min(Math.round((count / total) * 100), 100);
    
    const uniqueCategories = new Set(FACTS.filter(f => validLearnedIDs.includes(f.id)).map(f => f.category));
    
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${count}</div>
            <div style="color:#94a3b8">faits appris</div>
            <div class="progress-bar-bg" style="overflow:hidden">
                <div class="progress-bar-fill" style="width:${progress}%; max-width:100%"></div>
            </div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${uniqueCategories.size}</div>
            <div style="color:#94a3b8">catégories explorées</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${total}</div>
            <div style="color:#94a3b8">faits disponibles</div>
        </div>`;
    document.getElementById('statsView').classList.add('open');
    enableSwipeBack();
}

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', (i === 0 && currentView === 'daily') || (i === 1 && currentView === 'history') || (i === 2 && currentView === 'stats'));
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

window.showFactDetail = (id) => { const fact = FACTS.find(f => f.id === id); if (fact) showPopup(fact.title, fact.moreInfo || fact.text); };
window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); disableSwipeBack(); };

document.querySelectorAll('.nav-item')[0].onclick = () => { window.closeHistory(); window.closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = showHistory;
document.querySelectorAll('.nav-item')[2].onclick = showStats;

renderFact(FACTS[0]);
setupGestures();
updateStreak();
