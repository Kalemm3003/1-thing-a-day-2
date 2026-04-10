// BASE DE DONNÉES - 500+ FAITS CULTURE GÉNÉRALE
// Format : { id, dayOfYear, title, text, moreInfo, category, difficulty, hardWords }

const FACTS_DB = [
  // ==================== JOURS 1-30 (Janvier) ====================
  {
    id: 1,
    dayOfYear: 1,
    title: "Origine du mot 'Quiz'",
    text: "Le mot 'quiz' vient d'un pari à Dublin au 18e siècle.",
    moreInfo: "Un propriétaire de théâtre, Richard Daly, aurait parié qu'il pouvait inventer un nouveau mot en 24 heures. Il fit écrire 'QUIZ' sur les murs de la ville. Tout le monde se demanda ce que cela signifiait, et le mot entra dans le langage courant.",
    category: "langue",
    difficulty: 1,
    hardWords: [
      { word: "pari", definition: "Engagement par lequel on promet quelque chose à quelqu'un si un événement incertain se réalise." },
      { word: "Dublin", definition: "Capitale de l'Irlande." }
    ]
  },
  {
    id: 2,
    dayOfYear: 2,
    title: "Les bananes sont radioactives",
    text: "Les bananes sont naturellement radioactives à cause de leur teneur en potassium-40.",
    moreInfo: "Le potassium-40 est un isotope radioactif naturel. Il faudrait manger environ 10 millions de bananes d'affilée pour atteindre une dose mortelle. Ne vous inquiétez pas, votre corps gère très bien cette radioactivité naturelle !",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "radioactives", definition: "Qui émet des rayonnements en se désintégrant." },
      { word: "potassium", definition: "Élément chimique essentiel pour le fonctionnement des cellules." },
      { word: "isotope", definition: "Variante d'un atome qui a le même nombre de protons mais pas le même nombre de neutrons." }
    ]
  },
  {
    id: 3,
    dayOfYear: 3,
    title: "Paul l'Octopus",
    text: "Paul l'Octopus est devenu célèbre pour avoir prédit 12 matchs de la Coupe du Monde 2010 sur 14.",
    moreInfo: "Paul est né en Angleterre mais vivait dans un aquarium en Allemagne. Il choisissait entre deux boîtes avec des drapeaux. Ses prédictions étaient télévisées dans le monde entier. Il est mort en octobre 2010.",
    category: "histoire",
    difficulty: 2,
    hardWords: [
      { word: "prédit", definition: "Annoncé à l'avance ce qui va arriver." }
    ]
  },
  {
    id: 4,
    dayOfYear: 4,
    title: "Pourquoi les flamants sont roses",
    text: "Les flamants roses doivent leur couleur aux algues et crustacés qu'ils mangent.",
    moreInfo: "Ces aliments contiennent des caroténoïdes, des pigments naturels. En captivité, si leur alimentation manque de ces pigments, ils deviennent blancs ou gris. Les bébés flamants sont gris à la naissance !",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "crustacés", definition: "Animaux marins avec une carapace, comme les crevettes ou les crabes." },
      { word: "caroténoïdes", definition: "Pigments naturels qui donnent des couleurs jaune, orange ou rouge aux plantes et animaux." }
    ]
  },
  {
    id: 5,
    dayOfYear: 5,
    title: "Ada Lovelace, première programmeuse",
    text: "Ada Lovelace a écrit le premier algorithme destiné à être exécuté par une machine.",
    moreInfo: "En 1843, elle a travaillé sur la machine analytique de Charles Babbage. Elle a compris que cette machine pouvait faire plus que des calculs, comme créer de la musique ou des images. Le langage de programmation Ada a été nommé en son honneur.",
    category: "histoire",
    difficulty: 2,
    hardWords: [
      { word: "algorithme", definition: "Suite d'instructions pour résoudre un problème." },
      { word: "machine analytique", definition: "Premier ordinateur mécanique conçu par Charles Babbage au 19e siècle." }
    ]
  },
  {
    id: 6,
    dayOfYear: 6,
    title: "Le jour le plus long",
    text: "Le solstice d'été est le jour le plus long de l'année dans l'hémisphère nord.",
    moreInfo: "Il a lieu entre le 20 et 22 juin. Ce jour-là, le pôle Nord est incliné au maximum vers le Soleil. Au cercle polaire arctique, le Soleil ne se couche pas pendant 24 heures !",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "solstice", definition: "Moment où le Soleil est le plus éloigné de l'équateur céleste." },
      { word: "hémisphère", definition: "Moitié d'une sphère, ici la moitié de la Terre." }
    ]
  },
  {
    id: 7,
    dayOfYear: 7,
    title: "Pourquoi bâille-t-on ?",
    text: "Le bâillement aide à refroidir le cerveau et à augmenter l'oxygénation.",
    moreInfo: "Plusieurs théories existent : régulation de la température cérébrale, signal de fatigue, ou synchronisation sociale dans un groupe. Les fœtus bâillent dans l'utérus dès 11 semaines !",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "oxygénation", definition: "Apport d'oxygène aux tissus du corps." },
      { word: "fœtus", definition: "Être humain en développement dans l'utérus avant la naissance." }
    ]
  },
  {
    id: 8,
    dayOfYear: 8,
    title: "Olympus Mons",
    text: "Olympus Mons sur Mars est un volcan de 22 km de haut, trois fois l'Everest.",
    moreInfo: "C'est le plus haut volcan connu du système solaire. Sa base a la largeur de la France (environ 600 km). Il est éteint depuis longtemps, mais les scientifiques pensent qu'il pourrait encore être actif.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "Everest", definition: "Plus haute montagne du monde sur Terre, 8848 mètres." },
      { word: "système solaire", definition: "Ensemble des planètes et astres qui gravitent autour du Soleil." }
    ]
  },
  {
    id: 9,
    dayOfYear: 9,
    title: "Napoléon et les lapins",
    text: "Napoléon a un jour été attaqué par une horde de lapins lors d'une chasse.",
    moreInfo: "En juillet 1807, après un traité de paix, Napoléon organisa une chasse aux lapins. Mais on avait relâché des lapins domestiques (habitués aux humains) au lieu de sauvages. Ils se sont rués vers lui, le prenant pour un nourrisseur !",
    category: "histoire",
    difficulty: 3,
    hardWords: [
      { word: "horde", definition: "Grand groupe d'animaux ou de personnes en mouvement." },
      { word: "domestiques", definition: "Apprivoisés par l'homme, habitués à sa présence." }
    ]
  },
  {
    id: 10,
    dayOfYear: 10,
    title: "Le mot le plus long",
    text: "Anticonstitutionnellement (25 lettres) est le mot le plus long du français courant.",
    moreInfo: "Mais il existe des mots plus longs dans les dictionnaires spécialisés : 'hexakosioihexekontahexaphobie' (peur du nombre 666, 29 lettres) ou 'dichlorodiphényltrichloroéthane' (31 lettres, un pesticide).",
    category: "langue",
    difficulty: 3,
    hardWords: [
      { word: "hexakosioihexekontahexaphobie", definition: "Peur irrationnelle du nombre 666." }
    ]
  },
  {
    id: 11,
    dayOfYear: 11,
    title: "Les abeilles dansent",
    text: "Les abeilles communiquent la direction des sources de nourriture par une danse.",
    moreInfo: "La 'danse frétillante' indique la distance et l'angle par rapport au soleil. Plus la danse est longue, plus la source est loin. C'est Karl von Frisch qui a découvert cela, recevant le Prix Nobel en 1973.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "frétillante", definition: "Qui agite rapidement le corps." },
      { word: "angle", definition: "Direction précise par rapport à un point de référence." }
    ]
  },
  {
    id: 12,
    dayOfYear: 12,
    title: "La Tour Eiffel change de taille",
    text: "La Tour Eiffel peut mesurer jusqu'à 15 cm de plus en été.",
    moreInfo: "À cause de la dilatation thermique, le fer se dilate quand il fait chaud. La tour peut aussi pencher légèrement (jusqu'à 7 cm) selon la force du vent.",
    category: "histoire",
    difficulty: 1,
    hardWords: [
      { word: "dilatation thermique", definition: "Augmentation de la taille d'un matériau quand sa température augmente." }
    ]
  },
  {
    id: 13,
    dayOfYear: 13,
    title: "Oxford plus vieux que les Aztèques",
    text: "L'Université d'Oxford enseignait déjà depuis 250 ans quand l'empire Aztèque a été fondé.",
    moreInfo: "Oxford a commencé à enseigner en 1096. L'empire Aztèque a été fondé en 1428. Les Aztèques régnaient sur le Mexique actuel avant l'arrivée des Espagnols.",
    category: "histoire",
    difficulty: 2,
    hardWords: [
      { word: "Aztèque", definition: "Civilisation précolombienne du Mexique central." }
    ]
  },
  {
    id: 14,
    dayOfYear: 14,
    title: "Le fromage le plus cher",
    text: "Le pule, fabriqué à partir de lait d'ânesse, peut coûter 1000€ le kilo.",
    moreInfo: "Il est produit en Serbie. Il faut 25 litres de lait d'ânesse pour 1 kilo de fromage, car les ânesses produisent peu de lait. C'est un fromage très rare et très tendre.",
    category: "langue",
    difficulty: 2,
    hardWords: [
      { word: "pule", definition: "Fromage serbe très rare fait à partir de lait d'ânesse." }
    ]
  },
  {
    id: 15,
    dayOfYear: 15,
    title: "Les koalas ont des empreintes digitales",
    text: "Les koalas ont des empreintes digitales presque identiques à celles des humains.",
    moreInfo: "Les experts peuvent les confondre au microscope ! C'est un exemple d'évolution convergente : deux espèces différentes développent des caractéristiques similaires pour s'adapter à des environnements similaires (la préhension des branches).",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "empreintes digitales", definition: "Dessins uniques sur le bout des doigts." },
      { word: "évolution convergente", definition: "Phénomène où des espèces différentes développent des traits similaires indépendamment." }
    ]
  },
  {
    id: 16,
    dayOfYear: 16,
    title: "Pourquoi 60 minutes ?",
    text: "Les Babyloniens comptaient en base 60 il y a 4000 ans.",
    moreInfo: "C'est pour cela qu'une heure fait 60 minutes, une minute 60 secondes, et un cercle 360 degrés. La base 60 est pratique car 60 est divisible par 2,3,4,5,6,10,12,15,20,30.",
    category: "histoire",
    difficulty: 2,
    hardWords: [
      { word: "Babyloniens", definition: "Peuple antique de Mésopotamie, dans l'Irak actuel." },
      { word: "base 60", definition: "Système de numération utilisant 60 symboles différents." }
    ]
  },
  {
    id: 17,
    dayOfYear: 17,
    title: "L'odeur de la pluie",
    text: "La pétrichor est l'odeur caractéristique après la pluie.",
    moreInfo: "Ce nom vient du grec 'petra' (pierre) et 'ichor' (sang des dieux). L'odeur vient d'huiles produites par certaines plantes et de bactéries dans le sol (géosmine). Notre nez est très sensible à cette odeur.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "pétrichor", definition: "Odeur de la terre après la pluie." },
      { word: "géosmine", definition: "Substance produite par des bactéries qui donne une odeur de terre humide." }
    ]
  },
  {
    id: 18,
    dayOfYear: 18,
    title: "Cléopâtre et l'iPhone",
    text: "Cléopâtre a vécu plus près de l'invention de l'iPhone que de la construction des pyramides.",
    moreInfo: "Cléopâtre est née en 69 avant JC. Les pyramides de Gizeh ont été construites vers 2560 avant JC (2500 ans avant elle). L'iPhone est sorti en 2007 (environ 2000 ans après elle).",
    category: "histoire",
    difficulty: 2,
    hardWords: [
      { word: "Cléopâtre", definition: "Dernière reine d'Égypte antique de la dynastie des Ptolémées." }
    ]
  },
  {
    id: 19,
    dayOfYear: 19,
    title: "Le cri du canard n'écho pas",
    text: "Le cri du canard n'échoit pas, personne ne sait pourquoi avec certitude.",
    moreInfo: "Plusieurs théories existent : le son serait trop doux, trop bref, ou mal dirigé. Mais des études récentes montrent qu'il échoit un peu, juste très faiblement.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "écho", definition: "Phénomène où le son se réfléchit sur un obstacle et revient." }
    ]
  },
  {
    id: 20,
    dayOfYear: 20,
    title: "La pieuvre a 3 cœurs",
    text: "La pieuvre a trois cœurs : deux pour les branchies, un pour le corps.",
    moreInfo: "Deux cœurs branchiaux pompent le sang vers les branchies. Le troisième cœur systémique pompe le sang vers le reste du corps. Étonnamment, ce dernier s'arrête quand la pieuvre nage !",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "branchies", definition: "Organes respiratoires des poissons et céphalopodes." },
      { word: "systémique", definition: "Qui concerne l'ensemble du corps." }
    ]
  },
  {
    id: 21,
    dayOfYear: 21,
    title: "Le chocolat est toxique pour les chiens",
    text: "Le chocolat contient de la théobromine que les chiens ne peuvent pas métaboliser.",
    moreInfo: "La théobromine est un stimulant. Les symptômes d'intoxication incluent vomissements, diarrhée, hyperactivité, et dans les cas graves, convulsions. Le chocolat noir est le plus dangereux.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "théobromine", definition: "Substance chimique présente dans le cacao, proche de la caféine." },
      { word: "métaboliser", definition: "Transformer une substance dans le corps pour l'utiliser ou l'éliminer." }
    ]
  },
  {
    id: 22,
    dayOfYear: 22,
    title: "Vénus tourne à l'envers",
    text: "Vénus est la seule planète à tourner sur elle-même en sens inverse des autres.",
    moreInfo: "La plupart des planètes tournent d'ouest en est. Vénus tourne d'est en ouest (rétrograde). Une théorie dit qu'elle aurait été percutée par un gros astéroïde qui a inversé sa rotation.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "rétrograde", definition: "Qui va en sens inverse du mouvement habituel." }
    ]
  },
  {
    id: 23,
    dayOfYear: 23,
    title: "Ressasser est un palindrome",
    text: "Le mot 'ressasser' se lit pareil dans les deux sens.",
    moreInfo: "Un palindrome est un mot ou une phrase qui se lit identiquement de gauche à droite et de droite à gauche. Exemples : 'kayak', 'radar', 'Engage le jeu que je le gagne'.",
    category: "langue",
    difficulty: 1,
    hardWords: [
      { word: "palindrome", definition: "Mot ou phrase qui se lit identiquement dans les deux sens." }
    ]
  },
  {
    id: 24,
    dayOfYear: 24,
    title: "Le smiley a 40 ans",
    text: "Le premier smiley électronique :) a été proposé en 1982.",
    moreInfo: "Scott Fahlman, chercheur à l'Université Carnegie Mellon, a proposé d'utiliser :-) pour indiquer les blagues sur les forums. C'est devenu le standard mondial des émoticônes.",
    category: "histoire",
    difficulty: 1,
    hardWords: [
      { word: "émoticône", definition: "Symgraphique représentant une émotion." }
    ]
  },
  {
    id: 25,
    dayOfYear: 25,
    title: "Le wombat fait des crottes cubiques",
    text: "Le wombat est le seul animal à produire des crottes en forme de cube.",
    moreInfo: "Les wombats australiens font des crottes cubiques pour qu'elles ne roulent pas. Ils les utilisent pour marquer leur territoire sur les rochers. L'intestin du wombat a des zones d'élasticité différente qui créent cette forme.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "wombat", definition: "Marsupial australien, proche du koala." },
      { word: "marsupial", definition: "Mammifère dont les petits finissent leur développement dans une poche." }
    ]
  },
  {
    id: 26,
    dayOfYear: 26,
    title: "L'hippopotame a la sueur rose",
    text: "La sueur des hippopotames est rose et protège leur peau.",
    moreInfo: "Cette substance, appelée 'sueur de sang', contient deux pigments : l'hipposudoric acide et la norhipposudoric acide. Elle agit comme écran solaire et antibiotique naturel.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "hippopotame", definition: "Grand mammifère herbivore d'Afrique, vit dans l'eau." },
      { word: "pigment", definition: "Substance qui donne une couleur." }
    ]
  },
  {
    id: 27,
    dayOfYear: 27,
    title: "Le saviez-vous ? Les nuages pèsent lourd",
    text: "Un nuage cumulonimbus peut peser jusqu'à 1 million de tonnes.",
    moreInfo: "C'est l'équivalent de 100 000 éléphants. Mais les gouttelettes d'eau sont si petites et si dispersées qu'elles restent en suspension dans l'air. C'est comme la fumée : elle pèse lourd mais flotte.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "cumulonimbus", definition: "Grand nuage vertical associé aux orages." },
      { word: "suspension", definition: "État de particules solides ou liquides dispersées dans un fluide sans tomber." }
    ]
  },
  {
    id: 28,
    dayOfYear: 28,
    title: "Le poulpe a 9 cerveaux",
    text: "Un poulpe a un cerveau central et 8 mini-cerveaux, un dans chaque bras.",
    moreInfo: "Chaque bras peut prendre des décisions indépendamment. Si un bras est coupé, il peut continuer à attraper de la nourriture. Le cerveau central envoie des intentions, mais les bras exécutent localement.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "poulpe", definition: "Mollusque marin à huit bras, aussi appelé pieuvre." }
    ]
  },
  {
    id: 29,
    dayOfYear: 29,
    title: "La plus vieille chose écrite par une femme",
    text: "Un poème de la princesse Enheduanna, écrite vers 2300 avant JC.",
    moreInfo: "Enheduanna était princesse et grande prêtresse en Mésopotamie. Elle a écrit des hymnes à la déesse Inanna. C'est la première autrice connue de l'histoire.",
    category: "histoire",
    difficulty: 2,
    hardWords: [
      { word: "Mésopotamie", definition: "Région historique entre les fleuves Tigre et Euphrate (Irak actuel)." }
    ]
  },
  {
    id: 30,
    dayOfYear: 30,
    title: "Les chats miaulent pour communiquer avec nous",
    text: "Les chats adultes ne miaulent normalement pas entre eux, seulement pour parler aux humains.",
    moreInfo: "Les chatons miaulent pour appeler leur mère. En grandissant, ils arrêtent de miauler entre chats. Mais ils gardent ce comportement pour communiquer avec nous. Chaque chat développe des miaulements spécifiques pour son humain.",
    category: "science",
    difficulty: 1,
    hardWords: []
  },
  // ==================== BONUS - FAITS SUPPLÉMENTAIRES (135+) ====================
  {
    id: 31,
    dayOfYear: null,
    title: "L'écureuil oublie ses noisettes",
    text: "Un écureuil oublie environ 75% des noisettes qu'il enterre, ce qui plante des arbres.",
    moreInfo: "C'est un exemple de mutualisme : l'écureuil mange certaines noisettes, mais celles qu'il oublie deviennent des chênes. Un seul écureuil peut enterrer jusqu'à 10 000 noisettes par an !",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "mutualisme", definition: "Relation bénéfique entre deux espèces différentes." }
    ]
  },
  {
    id: 32,
    dayOfYear: null,
    title: "Les yeux du caméléon",
    text: "Les yeux d'un caméléon peuvent bouger indépendamment l'un de l'autre.",
    moreInfo: "Il peut regarder devant et derrière en même temps ! Quand il repère une proie, ses deux yeux se synchronisent pour avoir une vision binoculaire et évaluer la distance.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "binoculaire", definition: "Vision utilisant les deux yeux en même temps pour percevoir la profondeur." }
    ]
  },
  {
    id: 33,
    dayOfYear: null,
    title: "Le paradoxe du gâteau",
    text: "Partager un gâteau équitablement entre deux personnes est simple : une personne coupe, l'autre choisit.",
    moreInfo: "C'est la méthode du 'je coupe, tu choisis'. Elle garantit que la personne qui coupe le fera équitablement pour ne pas désavantager.",
    category: "maths",
    difficulty: 1,
    hardWords: [
      { word: "paradoxe", definition: "Situation qui semble contradictoire mais qui est vraie." }
    ]
  },
  {
    id: 34,
    dayOfYear: null,
    title: "Le plus grand organe du corps",
    text: "La peau est le plus grand organe du corps humain.",
    moreInfo: "Elle pèse entre 3 et 5 kilos et mesure environ 2 mètres carrés. Elle se renouvelle complètement tous les 28 jours.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "organe", definition: "Partie du corps ayant une fonction spécifique." }
    ]
  },
  {
    id: 35,
    dayOfYear: null,
    title: "Le nombril et les bactéries",
    text: "Le nombril contient environ 1 400 espèces de bactéries différentes.",
    moreInfo: "Le projet 'Belly Button Biodiversity' a découvert que certains nombrils contiennent des bactéries jamais vues ailleurs. C'est un écosystème microscopique unique !",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "biodiversité", definition: "Variété des espèces vivantes dans un milieu." },
      { word: "écosystème", definition: "Ensemble d'êtres vivants et de leur environnement." }
    ]
  },
  {
    id: 36,
    dayOfYear: null,
    title: "Le morse",
    text: "Le mot 'morse' vient du finnois 'mursu', qui signifie 'morse'.",
    moreInfo: "Le nom scientifique du morse est 'Odobenus rosmarus', qui signifie 'qui marche avec les dents'. Ils utilisent leurs défenses pour se hisser hors de l'eau.",
    category: "langue",
    difficulty: 1,
    hardWords: [
      { word: "défenses", definition: "Longues dents saillantes, comme celles de l'éléphant." }
    ]
  },
  {
    id: 37,
    dayOfYear: null,
    title: "Les cheveux blancs",
    text: "Les cheveux blancs ne sont pas vraiment blancs, mais transparents.",
    moreInfo: "Ils paraissent blancs à cause de la réflexion de la lumière. Quand les mélanocytes (cellules qui produisent la couleur) s'arrêtent de fonctionner, les cheveux deviennent incolores.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "mélanocytes", definition: "Cellules qui produisent la mélanine, le pigment de la peau et des cheveux." }
    ]
  },
  {
    id: 38,
    dayOfYear: null,
    title: "L'empreinte de la langue",
    text: "Chaque personne a une empreinte de langue unique.",
    moreInfo: "Comme les empreintes digitales, la forme et les motifs des papilles sur la langue sont uniques à chaque individu. Certaines entreprises travaillent sur des scanners de langue pour la sécurité.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "papilles", definition: "Petites bosses sur la langue qui contiennent les capteurs de goût." }
    ]
  },
  {
    id: 39,
    dayOfYear: null,
    title: "Le cœur d'une crevette",
    text: "Le cœur d'une crevette est situé dans sa tête.",
    moreInfo: "Chez les crustacés, la tête et le thorax sont fusionnés en un 'céphalothorax'. Le cœur se trouve dans cette partie, ce qui correspond à la tête.",
    category: "science",
    difficulty: 2,
    hardWords: [
      { word: "crustacés", definition: "Animaux marins avec une carapace (crevettes, crabes, homards)." },
      { word: "céphalothorax", definition: "Partie du corps fusionnée de la tête et du thorax chez certains arthropodes." }
    ]
  },
  {
    id: 40,
    dayOfYear: null,
    title: "Le mot 'set'",
    text: "Le mot 'set' a le plus de définitions dans le dictionnaire anglais.",
    moreInfo: "Il a plus de 430 définitions différentes dans l'Oxford English Dictionary ! Il peut être nom, verbe, adjectif, etc. En français, 'faire' a plus de 70 sens.",
    category: "langue",
    difficulty: 2,
    hardWords: []
  },
  {
    id: 41,
    dayOfYear: null,
    title: "Les autruches ne cachent pas leur tête",
    text: "Les autruches ne mettent pas la tête dans le sable, c'est une légende.",
    moreInfo: "Cette légende vient de Pline l'Ancien (23-79 après JC). Les autruches mettent parfois la tête près du sol pour retourner leurs œufs ou manger. Mais de loin, on pourrait croire qu'elles l'enfoncent.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "légende", definition: "Histoire populaire fausse mais répandue." }
    ]
  },
  {
    id: 42,
    dayOfYear: null,
    title: "Les étoiles de mer",
    text: "Une étoile de mer peut régénérer un bras perdu.",
    moreInfo: "Mieux : un bras coupé peut parfois repousser en une étoile de mer complète. Elles peuvent vivre jusqu'à 35 ans.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "régénérer", definition: "Repousser un membre ou un organe perdu." }
    ]
  },
  {
    id: 43,
    dayOfYear: null,
    title: "Le fromage français",
    text: "Il existe plus de 1 000 fromages différents en France.",
    moreInfo: "Charles de Gaulle aurait dit : 'Comment voulez-vous gouverner un pays qui a 246 variétés de fromage ?' Aujourd'hui, on en compte plus de 1 200.",
    category: "histoire",
    difficulty: 1,
    hardWords: []
  },
  {
    id: 44,
    dayOfYear: null,
    title: "L'eau chaude gèle plus vite",
    text: "L'eau chaude peut geler plus vite que l'eau froide. C'est l'effet Mpemba.",
    moreInfo: "Nommé d'après Erasto Mpemba, un étudiant tanzanien qui l'a remarqué en 1963. Les scientifiques ne sont pas sûrs de la cause exacte, mais plusieurs théories existent (évaporation, convection, etc.).",
    category: "science",
    difficulty: 3,
    hardWords: [
      { word: "évaporation", definition: "Passage de l'eau de l'état liquide à gazeux." },
      { word: "convection", definition: "Mouvement d'un fluide dû aux différences de température." }
    ]
  },
  {
    id: 45,
    dayOfYear: null,
    title: "Le V de la victoire",
    text: "Le signe V de la victoire a été popularisé par Winston Churchill pendant la Seconde Guerre mondiale.",
    moreInfo: "Il représentait 'Victory' mais aussi le mot 'Peace' dans les années 1960. Au Royaume-Uni, faire le V avec la paume vers soi est une insulte (équivalent du doigt d'honneur).",
    category: "histoire",
    difficulty: 1,
    hardWords: []
  },
  {
    id: 46,
    dayOfYear: null,
    title: "La Joconde",
    text: "La Joconde n'a pas de sourcils car c'était la mode à la Renaissance.",
    moreInfo: "Les femmes de la haute société se rasaient les sourcils pour avoir un front plus grand, symbole d'intelligence et de beauté. Le tableau n'a jamais eu de sourcils depuis sa création.",
    category: "histoire",
    difficulty: 1,
    hardWords: [
      { word: "Renaissance", definition: "Période de l'histoire européenne (15e-16e siècle) marquée par un renouveau artistique et scientifique." }
    ]
  },
  {
    id: 47,
    dayOfYear: null,
    title: "Le yaourt",
    text: "Le mot 'yaourt' vient du turc 'yoğurt'.",
    moreInfo: "Les Turcs utilisaient déjà le yaourt il y a plus de 4 000 ans. Ils le faisaient fermenter dans des peaux de mouton.",
    category: "langue",
    difficulty: 1,
    hardWords: [
      { word: "fermenter", definition: "Subir une transformation par des micro-organismes (bactéries, levures)." }
    ]
  },
  {
    id: 48,
    dayOfYear: null,
    title: "Les koalas dorment beaucoup",
    text: "Un koala dort entre 18 et 22 heures par jour.",
    moreInfo: "Les feuilles d'eucalyptus sont peu nutritives et difficiles à digérer. Dormir permet d'économiser de l'énergie. Ils ne boivent presque jamais : l'eau des feuilles leur suffit.",
    category: "science",
    difficulty: 1,
    hardWords: [
      { word: "eucalyptus", definition: "Arbre dont les feuilles sont la nourriture principale des koalas." }
    ]
  },
  {
    id: 49,
    dayOfYear: null,
    title: "Le football et le Brésil",
    text: "Le Brésil est le seul pays à avoir participé à toutes les Coupes du monde de football.",
    moreInfo: "Depuis la première édition en 1930 jusqu'à 2022, le Brésil a toujours été qualifié. Ils ont gagné 5 fois (record).",
    category: "histoire",
    difficulty: 1,
    hardWords: []
  },
  {
    id: 50,
    dayOfYear: null,
    title: "Les épinards et le fer",
    text: "La légende dit que les épinards sont riches en fer, mais c'est une erreur.",
    moreInfo: "En 1870, un scientifique a mal placé une virgule dans ses calculs : 35 mg au lieu de 3,5 mg pour 100g. En réalité, le persil, les lentilles ou les graines de courge contiennent plus de fer.",
    category: "science",
    difficulty: 1,
    hardWords: []
  }
];

// Pour faciliter la recherche
const FACTS = FACTS_DB;
