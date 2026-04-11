import { FACTS } from './data.js';

let learnedFacts = JSON.parse(localStorage.getItem('learnedFacts')) || [];
let currentFact = null;
let startX = 0;

const card = document.getElementById('card');

function init() {
    loadFactOfDay();
    setupGestures();
}

function loadFactOfDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    
    // Priorité au fait du jour, sinon un fait non appris
    currentFact = FACTS.find(f => f.dayOfYear === dayOfYear) || 
                  FACTS.find(f => !learnedFacts.includes(f.id)) || 
                  FACTS[0];
    
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
    });

    card.addEventListener('touchmove', e => {
        const move = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${move}px) rotate(${move / 20}deg)`;
    });

    card.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        card.style.transition = 'all 0.4s ease';
        
        if (Math.abs(diff) > 120) {
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
    }
}

function nextFact() {
    card.style.opacity = '0';
    setTimeout(() => {
        const next = FACTS.find(f => !learnedFacts.includes(f.id) && f.id !== currentFact.id);
        currentFact = next || FACTS[Math.floor(Math.random() * FACTS.length)];
        renderFact();
    }, 300);
}

init();
