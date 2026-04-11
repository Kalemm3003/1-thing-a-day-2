const FACTS = [
  {
    id: 1,
    dayOfYear: 1,
    title: "Pourquoi le 1er janvier est le Nouvel An",
    text: "Le 1er janvier a été fixé comme début de l'année par Jules César en 46 av. J.-C.",
    moreInfo: "Avant cela, l'année commençait en mars dans le calendrier romain. La réforme julienne a aligné l'année civile sur le cycle solaire.",
    category: "histoire",
    difficulty: 1,
    hardWords: [
      { word: "réforme", definition: "Changement important apporté à un système." },
      { word: "civile", definition: "Qui concerne la vie quotidienne des citoyens." }
    ]
  },
  {
    id: 2,
    dayOfYear: 2,
    title: "La vitesse de la lumière",
    text: "La lumière voyage à environ 300 000 kilomètres par seconde.",
    moreInfo: "Cette vitesse est une constante fondamentale de la physique et limite la vitesse maximale de toute information.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "constante", definition: "Valeur fixe qui ne change pas." }
    ]
  },
  {
    id: 3,
    dayOfYear: 3,
    title: "Origine du mot 'alphabet'",
    text: "Le mot 'alphabet' vient des deux premières lettres grecques : alpha et bêta.",
    moreInfo: "L'alphabet grec a servi de base à de nombreux systèmes d'écriture modernes.",
    category: "langue",
    difficulty: 1,
    hardWords: [
      { word: "système", definition: "Ensemble organisé d’éléments." }
    ]
  },
  {
    id: 4,
    dayOfYear: 4,
    title: "Le plus grand désert du monde",
    text: "Le plus grand désert du monde n'est pas le Sahara, mais l'Antarctique.",
    moreInfo: "Un désert est défini par son faible taux de précipitations, pas par sa température.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "précipitations", definition: "Eau provenant de l'atmosphère sous forme de pluie, neige, etc." }
    ]
  },
  {
    id: 5,
    dayOfYear: 5,
    title: "La Joconde n'a pas de sourcils",
    text: "La Joconde de Léonard de Vinci semble ne pas avoir de sourcils.",
    moreInfo: "Certains experts pensent qu'ils ont disparu avec le temps à cause du nettoyage des couches de peinture.",
    category: "culture",
    difficulty: 1,
    hardWords: []
  },
  {
    id: 6,
    dayOfYear: 6,
    title: "Pourquoi dit-on 'OK' ?",
    text: "Le mot 'OK' viendrait d'une blague américaine du 19e siècle signifiant 'Oll Korrect'.",
    moreInfo: "C'était une manière humoristique d'écrire 'All Correct'. Le terme s'est ensuite répandu mondialement.",
    category: "langue",
    difficulty: 1,
    hardWords: []
  },
  {
    id: 7,
    dayOfYear: 7,
    title: "Le plus vieil arbre du monde",
    text: "Le plus vieil arbre connu est un pin de plus de 4 800 ans.",
    moreInfo: "Il se trouve en Californie et son emplacement exact est gardé secret pour le protéger.",
    category: "science",
    difficulty: 2,
    hardWords: []
  },
  {
    id: 8,
    dayOfYear: 8,
    title: "Pourquoi les chats ronronnent",
    text: "Les chats ronronnent pour communiquer, se calmer et même se soigner.",
    moreInfo: "Le ronronnement produit des vibrations qui peuvent favoriser la guérison des os.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "vibrations", definition: "Mouvements rapides et répétés." }
    ]
  },
  {
    id: 9,
    dayOfYear: 9,
    title: "Le mot 'robot' vient du tchèque",
    text: "Le mot 'robot' vient du mot tchèque 'robota' qui signifie 'travail forcé'.",
    moreInfo: "Il a été utilisé pour la première fois dans une pièce de théâtre en 1920.",
    category: "langue",
    difficulty: 1,
    hardWords: []
  },
  {
    id: 10,
    dayOfYear: 10,
    title: "Le plus petit pays du monde",
    text: "Le Vatican est le plus petit pays du monde avec 0,44 km².",
    moreInfo: "Il est aussi le siège de l'Église catholique et la résidence du pape.",
    category: "culture",
    difficulty: 1,
    hardWords: []
  }
];
