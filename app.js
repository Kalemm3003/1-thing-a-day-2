// ==================== STOCKAGE ====================
let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let seenFacts = JSON.parse(localStorage.getItem('seenFacts')) || [];
let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
let lastLearnDate = localStorage.getItem('lastLearnDate');
let currentFact = null;
let currentView = 'daily';

// ==================== FONCTIONS UTILITAIRES ====================
function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function showDefinition(word, definition) {
    // Supprimer l'ancienne popup si elle existe
    let oldPopup = document.querySelector('.definition-popup');
    if (oldPopup) oldPopup.remove();
    
    let popup = document.createElement('div');
    popup.className = 'definition-popup';
    popup.innerHTML = `
        <h4>📖 ${word}</h4>
        <p>${definition}</p>
        <button onclick="this.parentElement.remove()">Fermer</button>
    `;
    document.body.appendChild(popup);
    
    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
        if (popup.parentElement) popup.remove();
    }, 5000);
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
    
    // Chercher le fait correspondant au jour de l'année
    let dailyFact = FACTS.find(f => f.dayOfYear === dayOfYear);
    
    // Si pas trouvé (jours > 30 dans notre base), prendre un bonus aléatoire
    if (!dailyFact) {
        let bonusFacts = FACTS.filter(f => f.dayOfYear === null);
        dailyFact = bonusFacts[Math.floor(Math.random() * bonusFacts.length)];
    }
    
    return dailyFact;
}

// ==================== PROCHAIN FAIT NON VU ====================
function getNextUnlearnedFact() {
    // Exclure les faits déjà appris ET déjà vus (swipe gauche)
    let availableFacts = FACTS.filter(f => 
        !learnedFacts.includes(f.id) && !seenFacts.includes(f.id)
    );
    
    if (availableFacts.length === 0) {
        // Si tout a été vu, on recommence mais sans les appris
        let resetFacts = FACTS.filter(f => !learnedFacts.includes(f.id));
        if (resetFacts.length === 0) {
            showToast('🏆 Félicitations ! Tu as tout appris !');
            return FACTS[Math.floor(Math.random() * FACTS.length)];
        }
        // Réinitialiser les vus
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

// ==================== MARQUER COMME VU (swipe gauche) ====================
function markAsSeen(factId) {
    if (!seenFacts.includes(factId) && !learnedFacts.includes(factId)) {
        seenFacts.push(factId);
        localStorage.setItem('seenFacts', JSON.stringify(seenFacts));
    }
}

// ==================== AFFICHAGE DU TEXTE AVEC MOTS CLIQUABLES ====================
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
    
    // Stocker le moreInfo pour le bouton "En savoir plus"
    document.getElementById('infoBtn').dataset.moreInfo = fact.moreInfo || fact.text;
    
    attachWordClickHandlers();
}

// ==================== SWIPE ====================
function nextFact(direction) {
    let next;
    if (direction === 'right') {
        markAsLearned(currentFact.id);
        next = getNextUnlearnedFact();
    } else {
        markAsSeen(currentFact.id);
        next = getNextUnlearnedFact();
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

// ==================== GESTION DES SWIPES TACTILES ====================
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
        showToast(`${fact.title}\n\n${fact.moreInfo || fact.text}`);
    }
}

function closeHistory() {
    document.getElementById('historyView').classList.remove('open');
}

function showStats() {
    let uniqueCategories = new Set(FACTS.filter(f => learnedFacts.includes(f.id)).map(f => f.category));
    let progress = Math.round((learnedFacts.length / FACTS.filter(f => f.dayOfYear !== null || !learnedFacts.includes(f.id)).length) * 100);
    
    document.getElementById('statsContainer').innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${learnedFacts.length}</div>
            <div>faits appris</div>
            <div style="margin-top:10px;background:#1e293b;border-radius:10px;height:8px;">
                <div style="width:${progress}%;background:#60a5fa;height:100%;border-radius:10px;"></div>
            </div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${currentStreak}</div>
            <div>jours consécutifs 🔥</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${uniqueCategories.size}</div>
            <div>catégories explorées</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${FACTS.length}</div>
            <div>faits disponibles</div>
        </div>
    `;
    document.getElementById('statsView').classList.add('open');
}

function closeStats() {
    document.getElementById('statsView').classList.remove('open');
}

function showDaily() {
    currentView = 'daily';
    updateActiveMenu();
    let dailyFact = getDailyFact();
    loadFact(dailyFact, true);
}

function updateActiveMenu() {
    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${currentView}"]`).classList.add('active');
}

// ==================== BOUTON INFO ====================
document.getElementById('infoBtn').addEventListener('click', () => {
    if (currentFact) {
        let moreInfo = currentFact.moreInfo || currentFact.text;
        showToast(`${currentFact.title}\n\n${moreInfo}`);
    }
});

// ==================== MENU ====================
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
    let dailyFact = getDailyFact();
    loadFact(dailyFact, true);
}

// Rendre globales les fonctions nécessaires
window.closeHistory = closeHistory;
window.closeStats = closeStats;
window.showFactDetail = showFactDetail;
window.showDefinition = showDefinition;

init();
