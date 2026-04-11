/* ============================================================
   UTILITAIRES LOCALSTORAGE
============================================================ */

function load(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================
   VARIABLES GLOBALES
============================================================ */

let learnedFacts = load("learnedFacts", []);   // IDs appris
let seenFacts = load("seenFacts", []);         // IDs déjà vus
let currentStreak = load("currentStreak", 0);
let lastLearnDate = load("lastLearnDate", null);

let startX = 0;
let endX = 0;
const SWIPE_THRESHOLD = 50;

let currentFact = null;

/* ============================================================
   CALCUL DU FAIT DU JOUR
============================================================ */

function getDayOfYear() {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1);
    return Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getDailyFact() {
    const day = getDayOfYear();
    return FACTS.find(f => f.dayOfYear === day);
}

/* ============================================================
   CHOIX D’UN NOUVEAU FAIT (jamais vu)
============================================================ */

function getNextFact() {
    const candidates = FACTS.filter(f =>
        !learnedFacts.includes(f.id) &&
        !seenFacts.includes(f.id) &&
        f.id !== getDailyFact().id
    );

    if (candidates.length === 0) {
        return null;
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
}

/* ============================================================
   AFFICHAGE D’UN FAIT
============================================================ */

function renderFact(fact) {
    currentFact = fact;

    const card = document.getElementById("dailyCard");
    const category = card.querySelector(".fact-category");
    const title = card.querySelector(".fact-title");
    const text = card.querySelector(".fact-text");

    category.textContent = fact.category.toUpperCase();
    title.textContent = fact.title;

    // Mots compliqués cliquables
    let html = fact.text;
    fact.hardWords.forEach(hw => {
        html = html.replace(
            new RegExp(hw.word, "gi"),
            `<span class="hard-word" data-word="${hw.word}">${hw.word}</span>`
        );
    });

    text.innerHTML = html;

    // Ajout listeners mots compliqués
    document.querySelectorAll(".hard-word").forEach(el => {
        el.addEventListener("click", () => {
            const word = el.dataset.word;
            const def = fact.hardWords.find(h => h.word === word).definition;
            openWordPopup(word, def);
        });
    });
}

/* ============================================================
   SWIPE
============================================================ */

const card = document.getElementById("dailyCard");

card.addEventListener("touchstart", e => {
    startX = e.changedTouches[0].clientX;
});

card.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const diff = endX - startX;

    if (Math.abs(diff) < SWIPE_THRESHOLD) return;

    if (diff > 0) {
        onSwipeRight();
    } else {
        onSwipeLeft();
    }
}

/* ============================================================
   ACTIONS SWIPE
============================================================ */

function onSwipeRight() {
    // Marquer comme appris
    if (!learnedFacts.includes(currentFact.id)) {
        learnedFacts.push(currentFact.id);
        save("learnedFacts", learnedFacts);
    }

    updateStreak();
    showToast("🔥 Appris !");
    loadNextFact();
}

function onSwipeLeft() {
    // Marquer comme vu
    if (!seenFacts.includes(currentFact.id)) {
        seenFacts.push(currentFact.id);
        save("seenFacts", seenFacts);
    }

    loadNextFact();
}

/* ============================================================
   STREAK
============================================================ */

function updateStreak() {
    const today = new Date().toDateString();

    if (lastLearnDate === today) return;

    if (lastLearnDate === null) {
        currentStreak = 1;
    } else {
        const last = new Date(lastLearnDate);
        const diff = (new Date() - last) / (1000 * 60 * 60 * 24);

        if (diff < 2) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
    }

    lastLearnDate = today;

    save("currentStreak", currentStreak);
    save("lastLearnDate", lastLearnDate);
}

/* ============================================================
   TOAST
============================================================ */

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}

/* ============================================================
   POPUPS
============================================================ */

function openMoreInfoPopup() {
    document.getElementById("popupTitle").textContent = currentFact.title;
    document.getElementById("popupText").textContent = currentFact.moreInfo;
    document.getElementById("popupMoreInfo").classList.remove("hidden");
}

function openWordPopup(word, def) {
    document.getElementById("popupWordTitle").textContent = word;
    document.getElementById("popupWordDefinition").textContent = def;
    document.getElementById("popupWord").classList.remove("hidden");
}

document.querySelectorAll(".close-popup").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
    });
});

/* ============================================================
   NAVIGATION
============================================================ */

document.querySelectorAll(".bottom-menu button").forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        document.getElementById(view).classList.add("active");

        if (view === "historyView") renderHistory();
        if (view === "statsView") renderStats();
    });
});

/* ============================================================
   HISTORIQUE
============================================================ */

function renderHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    const items = learnedFacts
        .map(id => FACTS.find(f => f.id === id))
        .reverse();

    if (items.length === 0) {
        list.innerHTML = "<p>Aucun fait appris pour le moment.</p>";
        return;
    }

    items.forEach(f => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <div class="history-item-title">${f.title}</div>
            <div class="history-item-meta">${f.category} • difficulté ${f.difficulty}</div>
        `;
        list.appendChild(div);
    });
}

/* ============================================================
   STATS
============================================================ */

function renderStats() {
    const learned = learnedFacts.length;
    const progress = Math.round((learned / FACTS.length) * 100);

    const categories = new Set(
        learnedFacts.map(id => FACTS.find(f => f.id === id).category)
    );

    const avgDifficulty = learned === 0
        ? 0
        : (
            learnedFacts
                .map(id => FACTS.find(f => f.id === id).difficulty)
                .reduce((a, b) => a + b, 0) / learned
        ).toFixed(1);

    document.getElementById("statsLearned").textContent = learned;
    document.getElementById("statsProgress").textContent = progress + "%";
    document.getElementById("statsStreak").textContent = currentStreak + "🔥";
    document.getElementById("statsCategories").textContent = categories.size;
    document.getElementById("statsDifficulty").textContent = avgDifficulty;
}

/* ============================================================
   CHARGEMENT INITIAL
============================================================ */

function loadNextFact() {
    const next = getNextFact();
    if (!next) {
        showToast("🎉 Plus de nouveaux faits !");
        return;
    }
    renderFact(next);
}

function init() {
    const daily = getDailyFact();
    renderFact(daily);

    document.getElementById("moreInfoBtn").addEventListener("click", openMoreInfoPopup);
}

init();
