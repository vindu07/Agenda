
import * as db from "./db.js";
import * as utils from "./utils.js";
import * as settings from "./settings.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

export function initDashboard(){
const numGiorni = 3; //quanti giorni visualizza


let oggi = Timestamp.fromDate(new Date());
let termine = new Date(); termine.setDate(termine.getDate() + numGiorni); termine = Timestamp.fromDate(termine);

const parametri = { isCompleted: false ,dataInizio: oggi, dataFine: termine, collection: "tasks"}


db.sortTasks(parametri)
  .then(sortedTasks => {
    // qui sortedTasks è l'array ordinato
    utils.renderTasks(sortedTasks);
  })
  .catch(err => {
    console.error("Errore nel caricamento/ordinamento dei task:", err);
  });
}
