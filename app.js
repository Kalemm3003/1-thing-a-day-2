// ==================== STOCKAGE ====================
let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let seenFacts = JSON.parse(localStorage.getItem('seenFacts')) || [];
let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
let lastLearnDate = localStorage.getItem('lastLearnDate');
let currentFact = null;
let currentView = 'daily';
let dailyFact = null;
let hasSeenDailyFact = false;

// Variables pour le swipe progressif
let startX = 0;
let currentX = 0;
let isDragging = false;
let card = document.getElementById('card');

// ==================== DATE ====================
function updateCalendarDate() {
    let today = new Date();
    let day = today.getDate();
    let dateElem = document.getElementById('calendarDate');
    if (dateElem) dateElem.innerHTML = day;
}
updateCalendarDate();

// ==================== POPUPS ====================
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

function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ==================== STREAK ====================
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
    let streakElem = document.getElementById('streakDisplay');
    if (streakElem) streakElem.innerHTML = currentStreak;
}
updateStreak();

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

// ==================== PROCHAIN FAIT ====================
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

// ==================== MARQUAGES ====================
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

function markAsSeen(factId) {
    if (!seenFacts.includes(factId) && !learnedFacts.includes(factId)) {
        seenFacts.push(factId);
        localStorage.setItem('seenFacts', JSON.stringify(seenFacts));
    }
}

// ==================== TEXTE AVEC MOTS CLIQUABLES ====================
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
function loadFact(fact) {
    if (!fact) return;
    currentFact = fact;
    
    document.getElementById('category').innerHTML = fact.category.toUpperCase();
    document.getElementById('title').innerHTML = fact.title;
    
    let textWithDefinitions = renderTextWithDefinitions(fact.text, fact.hardWords);
    document.getElementById('text').innerHTML = textWithDefinitions;
    
    attachWordClickHandlers();
}

// ==================== CHARGEMENT FAIT DU JOUR ====================
function loadDailyFact() {
    dailyFact = getDailyFact();
    loadFact(dailyFact);
    
    let reminderTitle = document.getElementById('reminderTitle');
    if (reminderTitle) reminderTitle.innerHTML = dailyFact.title;
    
    let today = new Date().toDateString();
    let dailySeen = localStorage.getItem('dailySeen_' + today);
    let reminder = document.getElementById('dailyReminder');
    if (reminder) {
        if (dailySeen === 'true') {
            hasSeenDailyFact = true;
            reminder.style.display = 'flex';
        } else {
            hasSeenDailyFact = false;
            reminder.style.display = 'none';
        }
    }
}

// ==================== RAPPEL ====================
function showDailyReminder() {
    if (dailyFact) {
        showPopup(`📅 Fait du ${new Date().getDate()}/${new Date().getMonth()+1}`, dailyFact.moreInfo || dailyFact.text);
    }
}

// ==================== SWIPE PROGRESSIF ====================
function nextFact(direction) {
    let next;
    if (direction === 'right') {
        markAsLearned(currentFact.id);
        if (currentFact.id === dailyFact?.id && !hasSeenDailyFact) {
            let today = new Date().toDateString();
            localStorage.setItem('dailySeen_' + today, 'true');
            hasSeenDailyFact = true;
            let reminder = document.getElementById('dailyReminder');
            if (reminder) reminder.style.display = 'flex';
        }
        next = getNextUnlearnedFact(true);
    } else {
        markAsSeen(currentFact.id);
        next = getNextUnlearnedFact(true);
    }
    
    if (next) {
        card.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.3s';
        card.style.transform = direction === 'right' ? 'translateX(120%) rotate(8deg)' : 'translateX(-120%) rotate(-8deg)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            loadFact(next);
            card.style.transition = 'none';
            card.style.transform = direction === 'right' ? 'translateX(-120%) rotate(-8deg)' : 'translateX(120%) rotate(8deg)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.3s';
                card.style.transform = 'translateX(0) rotate(0)';
                card.style.opacity = '1';
            }, 10);
        }, 300);
    }
}

// Gestion du swipe progressif
function setupSwipe() {
    card = document.getElementById('card');
    
    card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        card.style.transition = 'none';
    });
    
    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        let deltaX = currentX - startX;
        let rotation = deltaX / 20;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        card.style.opacity = `${1 - Math.abs(deltaX) / 500}`;
    });
    
    card.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        let deltaX = e.changedTouches[0].clientX - startX;
        
        if (Math.abs(deltaX) > 100) {
            nextFact(deltaX > 0 ? 'right' : 'left');
        } else {
            card.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.3s';
            card.style.transform = 'translateX(0) rotate(0)';
            card.style.opacity = '1';
        }
    });
}

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
    let progress = Math.round((learnedFacts.length / FACTS.length) * 100);
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learnedFacts.length}</div>
            <div>faits appris</div>
            <div style="margin-top:10px;background:#1e293b;border-radius:10px;height:8px;">
                <div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div>
            </div>
        </div>
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
        loadFact(dailyFact);
    } else {
        loadDailyFact();
    }
}

function updateActiveMenu() {
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    let activeBtn = document.querySelector(`[data-view="${currentView}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

// ==================== ÉVÉNEMENTS ====================
document.getElementById('infoBtn').addEventListener('click', () => {
    if (currentFact) {
        showPopup(currentFact.title, currentFact.moreInfo || currentFact.text);
    }
});

let reminder = document.getElementById('dailyReminder');
if (reminder) reminder.addEventListener('click', showDailyReminder);

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
    setupSwipe();
}

window.closeHistory = closeHistory;
window.closeStats = closeStats;
window.showFactDetail = showFactDetail;
window.showDefinition = showDefinition;

init();
