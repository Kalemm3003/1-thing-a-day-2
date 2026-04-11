import { FACTS, CATEGORIES } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let currentTheme = "Tout";
let startX = 0;

const card = document.getElementById('card');
const themeLabel = document.getElementById('current-theme-label');
const categorySelect = document.getElementById('category-select');

function init() {
    loadFactOfDay();
    setupGestures();
    updateStatsUI(); // Charge le compteur au démarrage
    
    categorySelect.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        themeLabel.innerText = currentTheme;
        nextFact();
    });
}

function updateStatsUI() {
    const streakEl = document.getElementById('streak');
    if (streakEl) {
        streakEl.innerText = `🔥 ${learnedFacts.length} appris`;
    }
}

function loadFactOfDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    
    // On cherche d'abord le fait du jour précis
    let fact = FACTS.find(f => f.dayOfYear === dayOfYear);
    
    // Si déjà appris ou inexistant, on prend le premier non appris
    if (!fact || learnedFacts.includes(fact.id)) {
        fact = FACTS.find(f => !learnedFacts.includes(f.id));
    }

    currentFact = fact || FACTS[0];
    renderFact();
}

function renderFact() {
    let text = currentFact.text;
    currentFact.hardWords.forEach(hw => {
        const regex = new RegExp(`(${hw.word})`, 'gi');
        text = text.replace(regex, `<span class="hard-word" onclick="window.showDef('${hw.definition}')">$1</span>`);
    });

    card.innerHTML = `
        <div class="category-badge">${currentFact.category}</div>
        <h1 style="font-size: 1.8rem; margin-bottom: 15px;">${currentFact.title}</h1>
        <p style="font-size: 1.1rem; line-height: 1.6;">${text}</p>
        <button class="more-btn" onclick="window.showMore()">En savoir plus</button>
    `;
    card.style.transform = 'translateX(0) rotate(0)';
    card.style.opacity = '1';
}

window.showDef = (def) => alert(`Définition : ${def}`);
window.showMore = () => alert(currentFact.moreInfo);

function setupGestures() {
    card.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        card.style.transition = 'none';
    }, {passive: true});

    card.addEventListener('touchmove', e => {
        const move = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${move}px) rotate(${move / 20}deg)`;
    }, {passive: true});

    card.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        if (Math.abs(diff) > 100) {
            if (diff > 0) learned(currentFact.id);
            nextFact();
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
        }
    });
}

function learned(id) {
    if (!learnedFacts.includes(id)) {
        learnedFacts.push(id);
        localStorage.setItem('learnedFacts', JSON.stringify(learnedFacts));
        updateStatsUI();
    }
}

function nextFact() {
    card.style.opacity = '0';
    setTimeout(() => {
        let pool = FACTS;
        if (currentTheme !== "Tout") {
            pool = FACTS.filter(f => f.category === currentTheme);
        }

        let next = pool.find(f => !learnedFacts.includes(f.id) && f.id !== currentFact.id);
        if (!next) next = pool[Math.floor(Math.random() * pool.length)];
        
        currentFact = next || FACTS[0];
        renderFact();
    }, 300);
}

init();
