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
            overlay.remove();
            isPopupOpen = false;
        }, 200);
    };
    
    overlay.querySelector('.close-popup-btn').onclick = closeWithAnimation;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWithAnimation(); });
    
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
        if (moveY > 100) {
            closeWithAnimation();
        } else {
            popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease';
            popupBox.style.transform = 'translateY(0)';
            popupBox.style.opacity = '1';
        }
        e.stopPropagation();
    });
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
    let currentY = 0;
    
    const closeWithAnimation = () => {
        popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        popupBox.style.transform = 'translateY(100px)';
        popupBox.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            isPopupOpen = false;
        }, 200);
    };
    
    overlay.querySelector('.close-popup-btn').onclick = closeWithAnimation;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWithAnimation(); });
    
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
        if (moveY > 100) {
            closeWithAnimation();
        } else {
            popupBox.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease';
            popupBox.style.transform = 'translateY(0)';
            popupBox.style.opacity = '1';
        }
        e.stopPropagation();
    });
}

function updateStats() {
    let streakElem = document.getElementById('streak');
    if (streakElem) streakElem.innerHTML = `📚 ${learningFacts.length} | ✅ ${knownFacts.length}`;
}

function renderFact(fact) {
    if (!fact) return;
    currentFact = fact;
    let text = fact.text;
    if (fact.hardWords) {
        fact.hardWords.forEach(hw => {
            const regex = new RegExp(`(${hw.word})`, 'gi');
            text = text.replace(regex, `<span class="hard-word" data-def="${hw.definition}">$1</span>`);
        });
    }
    card.innerHTML = `<div class="category-badge">${fact.category}</div><h1>${fact.title}</h1><p>${text}</p><button class="more-btn">En savoir plus</button>`;
    
    card.querySelectorAll('.hard-word').forEach(el => { 
        el.onclick = (e) => { 
            e.stopPropagation(); 
            showDefinition(el.dataset.def); 
        }; 
    });
    
    card.querySelector('.more-btn').onclick = () => showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    
    card.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    card.style.transform = 'translateX(0) rotate(0) scale(1)';
    card.style.opacity = '1';
}

function getNextFact() {
    const today = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    
    let allFactIds = [...learningFacts, ...knownFacts];
    let newFacts = FACTS.filter(f => !allFactIds.includes(f.id));
    
    if (newFacts.length > 0) {
        let nextFact = newFacts[Math.floor(Math.random() * newFacts.length)];
        while (nextFact.id === currentFact?.id && newFacts.length > 1) {
            nextFact = newFacts[Math.floor(Math.random() * newFacts.length)];
        }
        return nextFact;
    }
    
    let learningDue = learningFacts.filter(id => {
        let last = lastReviewed[id] || 0;
        return today - last > 1 * DAY;
    });
    
    if (learningDue.length > 0) {
        let nextFact = FACTS.find(f => f.id === learningDue[Math.floor(Math.random() * learningDue.length)]);
        while (nextFact.id === currentFact?.id && learningDue.length > 1) {
            nextFact = FACTS.find(f => f.id === learningDue[Math.floor(Math.random() * learningDue.length)]);
        }
        showToast("📚 Rappel : fait en apprentissage");
        return nextFact;
    }
    
    let knownDue = knownFacts.filter(id => {
        let last = lastReviewed[id] || 0;
        return today - last > 30 * DAY;
    });
    
    if (knownDue.length > 0) {
        let nextFact = FACTS.find(f => f.id === knownDue[Math.floor(Math.random() * knownDue.length)]);
        while (nextFact.id === currentFact?.id && knownDue.length > 1) {
            nextFact = FACTS.find(f => f.id === knownDue[Math.floor(Math.random() * knownDue.length)]);
        }
        showToast("✅ Rappel : fait connu");
        return nextFact;
    }
    
    showToast("🔄 Cycle terminé, on recommence !");
    return FACTS[Math.floor(Math.random() * FACTS.length)];
}

function setupGestures() {
    let moveX = 0;
    
    swipeZone.ontouchstart = e => { 
        startX = e.touches[0].clientX; 
        card.style.transition = 'none'; 
    };
    
    swipeZone.ontouchmove = e => {
        moveX = e.touches[0].clientX - startX;
        const rotation = moveX / 15;
        card.style.transform = `translateX(${moveX}px) rotate(${rotation}deg)`;
        card.style.opacity = `${1 - Math.abs(moveX) / 800}`;
    };
    
    swipeZone.ontouchend = e => {
        const diff = e.changedTouches[0].clientX - startX;
        
        if (Math.abs(diff) > 40) {
            const outX = diff > 0 ? 1000 : -1000;
            card.style.transition = 'all 0.3s ease-out';
            card.style.transform = `translateX(${outX}px) rotate(${outX / 20}deg)`;
            card.style.opacity = '0';
            
            if (diff > 0) {
                if (!learningFacts.includes(currentFact.id) && !knownFacts.includes(currentFact.id)) {
                    learningFacts.push(currentFact.id);
                    localStorage.setItem('learningFacts', JSON.stringify(learningFacts));
                    showToast('📚 J\'APPRENDS → Reviendra dans 1 jour');
                } else if (knownFacts.includes(currentFact.id)) {
                    knownFacts = knownFacts.filter(id => id !== currentFact.id);
                    learningFacts.push(currentFact.id);
                    localStorage.setItem('knownFacts', JSON.stringify(knownFacts));
                    localStorage.setItem('learningFacts', JSON.stringify(learningFacts));
                    showToast('📚 À réviser → Reviendra dans 1 jour');
                }
            } else {
                if (!knownFacts.includes(currentFact.id)) {
                    knownFacts.push(currentFact.id);
                    localStorage.setItem('knownFacts', JSON.stringify(knownFacts));
                    learningFacts = learningFacts.filter(id => id !== currentFact.id);
                    localStorage.setItem('learningFacts', JSON.stringify(learningFacts));
                    showToast('✅ JE SAIS DÉJÀ → Reviendra dans 30 jours');
                }
            }
            
            lastReviewed[currentFact.id] = Date.now();
            localStorage.setItem('lastReviewed', JSON.stringify(lastReviewed));
            updateStats();
            
            setTimeout(() => {
                const next = getNextFact();
                renderFact(next);
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
