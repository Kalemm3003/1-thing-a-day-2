export const CATEGORIES = {
    ALL: "Tout",
    TECH: "Technologie",
    HIST: "Histoire",
    SCI: "Science",
    NAT: "Nature",
    INS: "Insolite"
};

export const FACTS = [
  {
    id: 1,
    dayOfYear: 101,
    category: CATEGORIES.TECH,
    title: "Le Bluetooth",
    text: "Le nom Bluetooth vient d'un roi viking nommé Harald à la dent bleue.",
    moreInfo: "Détails sur Harald Blåtand...",
    difficulty: 1,
    hardWords: [{ word: "viking", definition: "Guerrier scandinave." }]
  },
  {
    id: 2,
    dayOfYear: 102,
    category: CATEGORIES.SCI,
    title: "Pluie de diamants",
    text: "Sur Neptune et Uranus, il pleut littéralement des diamants.",
    moreInfo: "Pression atmosphérique extrême...",
    difficulty: 2,
    hardWords: [{ word: "littéralement", definition: "Au sens propre." }]
  }
  // Ajoute tes 10 faits ici en utilisant CATEGORIES.NOM
];
