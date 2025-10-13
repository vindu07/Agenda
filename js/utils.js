import * as db from "./db.js";

import { initDashboard } from "./dashboard.js";
import { initCalendar } from "./calendar.js";
import { initDiary } from "./diary.js";
import { initTimetable } from "./timetable.js";
import { initSettings } from "./settings.js";
import { initNewTask } from "./new-task.js";

export function renderTasks(tasksArray) {
  const c = document.querySelectorAll(".task-container");
  for(let container in c){
  container.innerHTML = ""; // pulisco prima

  tasksArray.forEach((task, index) => { 
    // contenitore principale
    const div = document.createElement("div");
    div.classList.add(task.isTest ? "verifica" : "compito"); //true verifica, false compito
    div.id = task.id;

    

    if (task.isTest) {
      // sezione tag
      const tagDiv = document.createElement("div");
      tagDiv.classList.add("tag");
      const p = document.createElement("p");
      p.textContent = "VERIFICA";
      div.appendChild(tagDiv);
      tagDiv.appendChild(p);
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("checkbox");
      checkbox.id = task.id;
      checkbox.checked = task.isCompleted || false;
      checkbox.addEventListener("change", async () => {
        task.isCompleted = checkbox.checked; // aggiorna array
       
        
        await db.completeTask(task.id); //aggiorna db

        div.classList.toggle("isCompleted");//aggiunge .isCompleted alla classe

         console.log("Task aggiornata:", thisTask.className);
         renderTasks(tasksArray);       // ricarica la lista
      });
      div.appendChild(checkbox);
      div.classList.add("priority-" + task.priority.toString());
      //console.log("Task salvato con classe= ", div.className);
    }

    if (task.isCompleted) { div.classList.add("isCompleted"); }

    // sezione contenuto
    const bo1Div = document.createElement("div");
    bo1Div.classList.add("bo1");

    const h3 = document.createElement("h3");
    h3.textContent = task.materia;
    const pDescr = document.createElement("p");
    pDescr.textContent = task.desc;

    bo1Div.appendChild(h3);
    bo1Div.appendChild(pDescr);

    // bottone cestino
    const btn = document.createElement("button");
    btn.classList.add("cestino");
    btn.id = task.id;
    const img = document.createElement("img");
    img.src = "assets/icons/canc.png";
    img.alt = "Elimina";
    btn.appendChild(img);

    btn.addEventListener("click", async () => {
    
    const conferma = confirm("Vuoi davvero eliminare il compito?");
    if (!conferma) return; // se annulla, stoppa
      
    await db.deleteTask(btn.id);      // cancella da Firestore
    tasksArray.splice(index, 1);   // cancella dall’array locale
    renderTasks(tasksArray);       // ricarica la lista
    });


    // assemblo tutto
    
    div.appendChild(bo1Div);
    div.appendChild(btn);
    container.appendChild(div);
  });
  }
}



//carica tutti gli html nel main
export async function loadAllHTML() {
  const files = ["dashboard.html", "calendar.html", "diary.html", "timetable.html", "settings.html", "new-task.html", "filters.html" ];
  const container = document.querySelector("main");
  container.replaceChildren(); //elimina eventuale contenuto

  for (const f of files) {
    try {
      const res = await fetch(`html/${f}`);//scarica il file
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text(); //lo trascrive

      const temp = document.createElement("div");
      temp.innerHTML = html.trim(); //crea un html temporaneo coi nodi

      // qui prendi direttamente il div principale dentro il file
      const section = temp.firstElementChild;
      if (section) {
        container.appendChild(section);//carica la sezione nel main senza errori(in teoria)
        console.log(`✅ Caricato ${f}`);
      } else {
        console.warn(`⚠️ Nessun nodo valido in ${f}`);
      }
    } catch (err) {
      console.error(`❌ Errore caricamento ${f}:`, err);
    }
  }
}

export async function loadAllCSS() {
  const files = ["dashboard.css", "calendar.css", "diary.css", "timetable.css", "settings.css", "new-task.css" ];
  //elimina eventuali css
  const container = document.getElementById("css-container");
  container.replaceChildren();
  //carica i file
  for (const f of files) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `css/${f}`;

  link.onload = () => console.log(`✅ CSS caricato: ${f}`);
  link.onerror = () => console.error(`❌ Errore nel caricamento del CSS: ${f}`);
  
  container.appendChild(link);
  }
}

let currentModule = null;

export async function loadJS(name) {
 // Attiva solo lo script della pagina
  switch (name) {
    case "dashboard": await initDashboard(); break;
    case "calendar": await initCalendar(); break;
    case "diary": await initDiary(); break;
    case "timetable": await initTimetable(); break;
    case "settings": await initSettings(); break;
    case "new-task": await initNewTask(); break;
    default: console.warn("Modulo non trovato:", name);
  }
  console.log(`JS caricato: ${name}.js`);
}


export async function setTitle(name) {
  const nomi = {
    dashboard: "IN SCADENZA",
    calendar: "CALENDARIO",
    diary: "AGENDA",
    timetable: "ORARIO",
    settings: "IMPOSTAZIONI",
    "new-task": "CREA COMPITO"
  };

  const testo = nomi[name];

  if (!testo) {
    console.log("Titolo non trovato");
    return;
  }

  const titolo = document.getElementById("titolo");
  if (!titolo) {
    console.error("⚠️ Elemento con id='titolo' non trovato!");
    return;
  }

  titolo.innerText = testo;
}

/*export async function setMainName(name) {
  const main = document.querySelector("main");
  if (!main) return;

  main.className = "";               // rimuove tutte le classi
  main.classList.add(`${name}-main`);
}*/

export async function showPage(name) {
  document.querySelectorAll("div.main").forEach(m => m.classList.add("invisible"));
  
  const target = document.getElementById(`${name}-main`);
  if (target) target.classList.remove("invisible");
  else console.error(`❌ Pagina "${name}" non trovata`);
}

export async function loadPage(name) {
  await setTitle(name);
  //await setMainName(name);
  await showPage(name);
  await loadJS(name);
  
}
