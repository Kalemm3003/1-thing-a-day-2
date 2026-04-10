// ==================== STOCKAGE ====================
let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let seenFacts = JSON.parse(localStorage.getItem('seenFacts')) || [];
let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
let lastLearnDate = localStorage.getItem('lastLearnDate');
let currentFact = null;
let currentView = 'daily';
let dailyFact = null;
let hasSeenDailyFact = false;

// ==================== DATE ACTUELLE ====================
function updateCalendarDate() {
    let today = new Date();
    let day = today.getDate();
    document.getElementById('calendarDate').innerHTML = day;
}
updateCalendarDate();

// ==================== FONCTIONS UTILITAIRES ====================
function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

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
        if (e.target === popup) popup.remove();
    });
}

function showDefinition(word, definition) {
    let oldPopup = document.querySelector('.definition-popup, .info-popup');
    if (oldPopup) oldPopup.remove();
    
    let popup = document.createElement('div');
    popup.className = 'definition-popup';
    popup.innerHTML = `
        <h4>📖 ${word}</h4>
        <p>${definition}</p>
        <button>Fermer</button>
    `;
    document.body.appendChild(popup);
    
    popup.querySelector('button').onclick = () => popup.remove();
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.remove();
    });
}

// ==================== GESTION DU STREAK ====================
function updateStreak() {
    let today = new Date().toDateString();
    if (lastLearnDate !== today) {
        if (lastLearnDate && new Date(lastLearnDate).getTime() === new Date(today).getTime() - 86400000) {
            currentStreak++;
            showToast('🔥 Streak de ' + currentStreak + ' jours !');
        } else if (lastLearnDate !== today) {
            currentStreak = 1;
        }
        lastLearnDate = today;
        localStorage.setItem('lastLearnDate', lastLearnDate);
        localStorage.setItem('currentStreak', currentStreak);
    }
    document.getElementById('streakDisplay').innerHTML = currentStreak;
}

// ==================== FAIT DU JOUR ====================
function getDailyFact() {
    let today = new Date();
    let startOfYear = new Date(today.getFullYear(), 0, 1);
    let dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    
    let dailyFactData = FACTS.find(f => f.dayOfYear === dayOfYear);
    if (!dailyFactData) {
        let bonusFacts = FACTS.filter(f => f.dayOfYear === null);
        dailyFactData = bonusFacts[Math.floor(Math.random() * bonusFacts.length)];
    }
    return dailyFactData;
}

// ==================== PROCHAIN FAIT NON VU ====================
function getNextUnlearnedFact(excludeDaily = true) {
    let excludeIds = [...learnedFacts, ...seenFacts];
    if (excludeDaily && dailyFact) {
        excludeIds.push(dailyFact.id);
    }
    
    let availableFacts = FACTS.filter(f => !excludeIds.includes(f.id));
    
    if (availableFacts.length === 0) {
        let resetFacts = FACTS.filter(f => !learnedFacts.includes(f.id));
        if (resetFacts.length === 0) {
            showToast('🏆 Félicitations ! Tu as tout appris !');
            return FACTS[Math.floor(Math.random() * FACTS.length)];
        }
        seenFacts = [];
        localStorage.setItem('seenFacts', JSON.stringify(seenFacts));
        return resetFacts[Math.floor(Math.random() * resetFacts.length)];
    }
    return availableFacts[Math.floor(Math.random() * availableFacts.length)];
}

// ==================== MARQUER COMME APPRIS ====================
function markAsLearned(factId) {
    if (!learnedFacts.includes(factId)) {
        learnedFacts.push(factId);
        localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
        updateStreak();
        showToast('✅ Appris ! +1 jour de streak');
        return true;
    }
    return false;
}

// ==================== MARQUER COMME VU ====================
function markAsSeen(factId) {
    if (!seenFacts.includes(factId) && !learnedFacts.includes(factId)) {
        seenFacts.push(factId);
        localStorage.setItem('seenFacts', JSON.stringify(seenFacts));
    }
}

// ==================== AFFICHAGE DU TEXTE ====================
function renderTextWithDefinitions(text, hardWords) {
    if (!hardWords || hardWords.length === 0) return text;
    let result = text;
    for (let item of hardWords) {
        let regex = new RegExp(`\\b(${item.word})\\b`, 'gi');
        result = result.replace(regex, `<span class="highlight-word" data-word="${item.word}" data-def="${item.definition.replace(/"/g, '&quot;')}">$1</span>`);
    }
    return result;
}

function attachWordClickHandlers() {
    document.querySelectorAll('.highlight-word').forEach(el => {
        el.removeEventListener('click', wordClickHandler);
        el.addEventListener('click', wordClickHandler);
    });
}

function wordClickHandler(e) {
    e.stopPropagation();
    let word = this.dataset.word;
    let definition = this.dataset.def;
    showDefinition(word, definition);
}

// ==================== CHARGEMENT D'UN FAIT ====================
function loadFact(fact, isDaily = false) {
    if (!fact) return;
    currentFact = fact;
    document.getElementById('category').innerHTML = fact.category.toUpperCase();
    document.getElementById('title').innerHTML = fact.title;
    let textWithDefinitions = renderTextWithDefinitions(fact.text, fact.hardWords);
    document.getElementById('text').innerHTML = textWithDefinitions;
    document.getElementById('infoBtn').dataset.moreInfo = fact.moreInfo || fact.text;
    attachWordClickHandlers();
}

// ==================== CHARGER LE FAIT DU JOUR ====================
function loadDailyFact() {
    dailyFact = getDailyFact();
    loadFact(dailyFact, true);
    
    let reminderTitle = document.getElementById('reminderTitle');
    reminderTitle.innerHTML = dailyFact.title;
    
    let today = new Date().toDateString();
    let dailySeen = localStorage.getItem('dailySeen_' + today);
    if (dailySeen === 'true') {
        hasSeenDailyFact = true;
        document.getElementById('dailyReminder').style.display = 'flex';
    } else {
        hasSeenDailyFact = false;
        document.getElementById('dailyReminder').style.display = 'none';
    }
}

// ==================== RAPPEL DU FAIT DU JOUR ====================
function showDailyReminder() {
    if (dailyFact) {
        showPopup(`📅 Fait du ${new Date().getDate()}/${new Date().getMonth()+1}`, dailyFact.moreInfo || dailyFact.text);
    }
}

// ==================== SWIPE ====================
function nextFact(direction) {
    let next;
    if (direction === 'right') {
        markAsLearned(currentFact.id);
        if (currentFact.id === dailyFact?.id && !hasSeenDailyFact) {
            let today = new Date().toDateString();
            localStorage.setItem('dailySeen_' + today, 'true');
            hasSeenDailyFact = true;
            document.getElementById('dailyReminder').style.display = 'flex';
        }
        next = getNextUnlearnedFact(true);
    } else {
        markAsSeen(currentFact.id);
        next = getNextUnlearnedFact(true);
    }
    
    if (next) {
        loadFact(next);
        let card = document.getElementById('card');
        card.classList.add(direction === 'right' ? 'swiping-right' : 'swiping-left');
        setTimeout(() => {
            card.classList.remove('swiping-right', 'swiping-left');
        }, 300);
    }
}

// ==================== GESTION DES SWIPES ====================
let touchStartX = 0;
let swipeContainer = document.getElementById('swipeContainer');

swipeContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

swipeContainer.addEventListener('touchend', (e) => {
    let deltaX = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(deltaX) > 50) {
        nextFact(deltaX > 0 ? 'right' : 'left');
    }
});

// ==================== VUES ====================
function showHistory() {
    let historyList = document.getElementById('historyList');
    let learnedFactsList = FACTS.filter(f => learnedFacts.includes(f.id));
    if (learnedFactsList.length === 0) {
        historyList.innerHTML = '<div class="empty-state">📭 Aucun fait appris<br>Swipe à droite pour apprendre !</div>';
    } else {
        historyList.innerHTML = learnedFactsList.slice().reverse().map(f => 
            `<div class="history-item" onclick="showFactDetail(${f.id})">
                <h3>${f.title}</h3>
                <p>${f.text.substring(0, 80)}...</p>
                <small>📂 ${f.category}</small>
            </div>`
        ).join('');
    }
    document.getElementById('historyView').classList.add('open');
}

function showFactDetail(factId) {
    let fact = FACTS.find(f => f.id === factId);
    if (fact) {
        showPopup(fact.title, fact.moreInfo || fact.text);
    }
}

function closeHistory() {
    document.getElementById('historyView').classList.remove('open');
}

function showStats() {
    let uniqueCategories = new Set(FACTS.filter(f => learnedFacts.includes(f.id)).map(f => f.category));
    let totalAvailable = FACTS.length;
    let progress = Math.round((learnedFacts.length / totalAvailable) * 100);
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card"><div class="stats-number">${learnedFacts.length}</div><div>faits appris</div>
        <div style="margin-top:10px;background:#1e293b;border-radius:10px;height:8px;">
            <div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div>
        </div></div>
        <div class="stats-card"><div class="stats-number">${currentStreak}</div><div>jours consécutifs 🔥</div></div>
        <div class="stats-card"><div class="stats-number">${uniqueCategories.size}</div><div>catégories explorées</div></div>
        <div class="stats-card"><div class="stats-number">${FACTS.length}</div><div>faits disponibles</div></div>
    `;
    document.getElementById('statsView').classList.add('open');
}

function closeStats() {
    document.getElementById('statsView').classList.remove('open');
}

function showDaily() {
    currentView = 'daily';
    updateActiveMenu();
    if (dailyFact) {
        loadFact(dailyFact, true);
    } else {
        loadDailyFact();
    }
}

function updateActiveMenu() {
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${currentView}"]`).classList.add('active');
}

// ==================== ÉVÉNEMENTS ====================
document.getElementById('infoBtn').addEventListener('click', () => {
    if (currentFact) {
        showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    }
});

document.getElementById('dailyReminder').addEventListener('click', showDailyReminder);

document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
        let view = btn.dataset.view;
        if (view === 'daily') showDaily();
        if (view === 'history') showHistory();
        if (view === 'stats') showStats();
    });
});

// ==================== INITIALISATION ====================
function init() {
    updateStreak();
    updateCalendarDate();
    loadDailyFact();
}

window.closeHistory = closeHistory;
window.closeStats = closeStats;
window.showFactDetail = showFactDetail;
window.showDefinition = showDefinition;

init();
