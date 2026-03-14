import * as db from "./db.js";
import { pagDiario } from "./diary.js";

export function initNewTask(){

/*MOSTRA/NASCONDE HUD*/
  const annulla = document.getElementById("annulla-task");
  annulla.addEventListener("click", () => {
    const hud = document.getElementById("hud"); 
    hud.classList.add("invisible");
  });
  
//INIZIALIZZA I VALORI
const desc = document.getElementById("task-desc");
const materia = document.getElementById("task-subject");
const isTest = document.getElementById("isTest");
const priority = document.getElementById("task-priority");

desc.value = "";
materia.value = "Seleziona";
isTest.value = "0";
priority.value = "2";
  

/*SALVA TASK*/
const salva = document.getElementById("save-task");
const fresh_salva = salva.cloneNode(true);
salva.replaceWith(fresh_salva);//clona e sostituisce il nodo = elimina event listener precedenti
fresh_salva.addEventListener("click", () => {
  
  // raccogli valori dall'HUD
  const scadenza = new Date(pagDiario);
  const isCompleted = false;
  const desc = document.getElementById("task-desc").value.trim();
  const materia = document.getElementById("task-subject").value;
  const isTest = document.getElementById("isTest").value === "0" ? false : true;
  const priority = parseInt(document.getElementById("task-priority").value);
  
  //chiudi hud
  const hud = document.getElementById("hud"); 
    hud.classList.add("invisible");

  // costruisci un array task
  const newTask = [ scadenza, materia, isTest, priority, desc, isCompleted  ];

  //salva in firestore
  db.createTask(newTask);

  document.getElementById("hud").classList.add("invisible");
});

}
