const facts = [
{
title:"Origine du mot quiz",
category:"Langue",
short:"Le mot quiz vient de l’anglais du 19e siècle lié à l’idée d’interrogation.",
long:"Le mot apparaît vers 1800 en anglais. Il vient probablement d’un argot lié à ‘to quiz’ = interroger. Une légende raconte qu’il aurait été inventé à Dublin comme un pari, mais cela n’est pas prouvé."
},
{
title:"Pourquoi le ciel est bleu ?",
category:"Science",
short:"La lumière du soleil est diffusée par l’atmosphère.",
long:"Les molécules de l’air diffusent davantage la lumière bleue que les autres couleurs (diffusion Rayleigh)."
},
{
title:"Capitale du Canada",
category:"Géographie",
short:"Ottawa est la capitale du Canada.",
long:"Ottawa a été choisie en 1857 par la reine Victoria pour éviter la rivalité entre Toronto et Montréal."
}
];

let i = 0;

const title = document.getElementById("title");
const short = document.getElementById("short");
const long = document.getElementById("long");
const category = document.getElementById("category");
const card = document.getElementById("card");

function load(){
let f = facts[i];
title.innerText = f.title;
short.innerText = f.short;
long.innerText = f.long;
category.innerText = f.category;
}

load();

// swipe
let startX = 0;

document.addEventListener("touchstart",e=>{
startX = e.touches[0].clientX;
});

document.addEventListener("touchend",e=>{
let endX = e.changedTouches[0].clientX;
let diff = endX - startX;

if(diff > 80){
next(true); // appris
}
if(diff < -80){
next(false); // suivant
}
});

function next(saved){
card.style.transform = "scale(0.9)";
setTimeout(()=>{
i = (i+1)%facts.length;
load();
card.style.transform = "scale(1)";
},200);
}
