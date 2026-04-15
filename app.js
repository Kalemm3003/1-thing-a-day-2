import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;
let isPopupOpen = false;
let currentView = 'daily';

const card = document.getElementById('card');

function updateStreak() {
    const streakElem = document.getElementById('streak');
    if (streakElem) streakElem.innerHTML = `🔥 ${learnedFacts.length} appris`;
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
    card.innerHTML = `
        <div class="category-badge">${fact.category}</div>
        <h1 style="font-size: 1.8rem; margin-bottom: 15px;">${fact.title}</h1>
        <p style="font-size: 1.1rem; line-height: 1.6;">${text}</p>
        <button class="more-btn">En savoir plus</button>
    `;
    card.querySelectorAll('.hard-word').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); showPopup("📖 Définition", el.dataset.def); };
    });
    card.querySelector('.more-btn').onclick = () => showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    
    // Animation d'entrée
    card.style.transition = 'none';
    card.style.transform = 'scale(0.8) translateY(40px)';
    card.style.opacity = '0';
    setTimeout(() => {
        card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = 'scale(1) translateY(0)';
        card.style.opacity = '1';
    }, 50);
}

function showPopup(title, content) {
    isPopupOpen = true;
    let overlay = document.createElement('div');
    overlay.className = 'info-popup';
    overlay.innerHTML = `<div class="popup-box"><div class="popup-handle"></div><h4>${title}</h4><p>${content}</p><button class="close-popup-btn">Fermer</button></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.close-popup-btn').onclick = () => { overlay.remove(); isPopupOpen = false; };
    overlay.onclick = (e) => { if(e.target === overlay) { overlay.remove(); isPopupOpen = false; } };
}

function setupGestures() {
    card.ontouchstart = (e) => {
        startX = e.touches[0].clientX;
        card.style.transition = 'none';
    };
    card.ontouchmove = (e) => {
        const moveX = e.touches[0].clientX - startX;
        const rotation = moveX / 15;
        card.style.transform = `translateX(${moveX}px) rotate(${rotation}deg)`;
        card.style.opacity = `${1 - Math.abs(moveX) / 600}`;
    };
    card.ontouchend = (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 120) {
            const direction = diff > 0 ? 1 : -1;
            card.style.transition = 'all 0.5s ease-in';
            card.style.transform = `translateX(${direction * 1000}px) rotate(${direction * 45}deg)`;
            card.style.opacity = '0';
            
            if (diff > 0 && !learnedFacts.includes(currentFact.id)) {
                learnedFacts.push(currentFact.id);
                localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
                updateStreak();
            }
            setTimeout(() => {
                const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
                renderFact(randomFact);
            }, 300);
        } else {
            card.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    };
}

// Navigation
window.closeHistory = () => { document.getElementById('historyView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); };
window.closeStats = () => { document.getElementById('statsView').classList.remove('open'); currentView = 'daily'; updateActiveMenu(); };

function updateActiveMenu() {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        const isDaily = i === 0 && currentView === 'daily';
        const isHist = i === 1 && currentView === 'history';
        const isStat = i === 2 && currentView === 'stats';
        item.classList.toggle('active', isDaily || isHist || isStat);
    });
}

document.querySelectorAll('.nav-item')[0].onclick = () => { window.closeHistory(); window.closeStats(); };
document.querySelectorAll('.nav-item')[1].onclick = () => {
    currentView = 'history'; updateActiveMenu();
    const list = FACTS.filter(f => learnedFacts.includes(f.id));
    document.getElementById('historyList').innerHTML = list.length === 0 ? '<div class="empty-state">📭 Aucun fait appris</div>' : 
        list.reverse().map(f => `<div class="history-item"><h3>${f.title}</h3><p>${f.text}</p></div>`).join('');
    document.getElementById('historyView').classList.add('open');
};
document.querySelectorAll('.nav-item')[2].onclick = () => {
    currentView = 'stats'; updateActiveMenu();
    const progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    document.getElementById('statsContainer').innerHTML = `<div class="stats-card"><div class="stats-number">${learnedFacts.length}</div><div>faits appris</div><div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${progress}%"></div></div></div>`;
    document.getElementById('statsView').classList.add('open');
};

renderFact(FACTS[0]);
setupGestures();
updateStreak();
