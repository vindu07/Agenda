
import * as db from "./db.js";
import * as utils from "./utils.js";
import * as settings from "./settings.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

export function initDashboard(){
const numGiorni = 4; //quanti giorni visualizza


let oggi = Timestamp.fromDate(new Date());
let termine = new Date(); termine.setDate(termine.getDate() + numGiorni); termine = Timestamp.fromDate(termine);

const parametri = { isCompleted: false, dataInizio: oggi, dataFine: termine, collection: "tasks"}


db.sortTasks(parametri)
  .then(sortedTasks => {
    // qui sortedTasks è l'array ordinato
    utils.renderTasks(sortedTasks);
  })
  .catch(err => {
    console.error("Errore nel caricamento/ordinamento dei task:", err);
  });

  
  addEventListeners();
}



function addEventListeners(){

 
  
  //ELEMENTI DEL DOM
  const filters = document.querySelector("#dashboard--main #filtri");
  const filter_container = document.querySelector("#dashboard--main #filter-container");
  const filter_filtra = document.querySelector("#dashboard--main #filtra");
  const filter_start_day = document.getElementById("filter-start-day");
  const filter_start_month = document.getElementById("filter-start-month");
  const filter_start_year = document.getElementById("filter-start-year");
  const filter_end_day = document.getElementById("filter-end-day");
  const filter_end_month = document.getElementById("filter-end-month");
  const filter_end_year = document.getElementById("filter-end-year");
  const filter_isCompleted = document.getElementById("filter-isCompleted");
  const filter_isTest = document.getElementById("filter-isTest");
  const filter_subject = document.getElementById("filter-subject");
  //console.log({filter_start_day, filter_start_month, filter_start_year, filter_end_day, filter_end_month, filter_end_year});

  //aggiungo opzioni per giorni,mesi,anni in filtri
  addOptions();

  //valori di default: a 4 giorni, da completare, tutti
  const oggi = new Date();
  filter_start_day.value = oggi.getDate();
  filter_start_month.value = oggi.getMonth();
  filter_start_year.value = oggi.getFullYear();
  filter_end_day.value = Number(oggi.getDate())+4;
  filter_end_month.value = oggi.getMonth();
  filter_end_year.value = oggi.getFullYear();
  filter_isCompleted.value = 0;
  filter_isTest.value = 2;
  filter_subject.value = 0;


  //EVENT LISTENER
  const fresh_filters = filters.cloneNode(true);//clono il nodo per eliminare i vecchi e. l.
  filters.replaceWith(fresh_filters);
  fresh_filters.addEventListener("click", () => {filter_container.classList.toggle("filter-hidden"); });//apre o chiude i filtri

  filter_filtra.addEventListener("click", filterDashboard);//click sul pulsante "filtra" ricarica la dashboard coi filtri
 


  function filterDashboard(){/*funzione per gli event listener dei filtri*/ 

    filter_container.classList.add("filter-hidden");//chiudo la hud

    const parametri1 = { isCompleted: null, isTest: null, dataInizio: Timestamp.fromDate(new Date(filter_start_year.value, filter_start_month.value, filter_start_day.value, 12)), dataFine: Timestamp.fromDate(new Date(filter_end_year.value, filter_end_month.value, filter_end_day.value, 12)), collection: "archive"}
    if(Number(filter_isCompleted.value) === 0 || Number(filter_isCompleted.value) === 1)parametri1.isCompleted = Boolean(Number(filter_isCompleted.value));
    if(Number(filter_isTest.value) === 0 || Number(filter_isTest.value) === 1)parametri1.isTest = Boolean(Number(filter_isTest.value));
    if(Number(filter_subject.value) != 0)parametri1.materia = String(filter_subject.value);
    db.sortTasks(parametri1).then(sortedTasks => {utils.renderTasks(sortedTasks); }).catch(err => {console.error("Errore nel caricamento/ordinamento dei task:", err); });
  }

  function addOptions(){

    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    
    //svuoto tutto
    filter_start_month.innerHTML = "";
    filter_end_month.innerHTML = "";
    filter_start_day.innerHTML = "";
    filter_end_day.innerHTML = "";
    filter_start_year.innerHTML = "";
    filter_end_year.innerHTML = "";
    
    //aggiungo le opzioni per giorni,mesi,anni
    mesi.forEach((mese, i) => {
      const option = document.createElement("option");
      const option1 = document.createElement("option");
      option.value = i; option.innerText = String(mese);
      option1.value = i; option1.innerText = String(mese);
      filter_start_month.appendChild(option);
      filter_end_month.appendChild(option1);
    });
    for(let i=1; i<=31; i++){
      const option = document.createElement("option");
      const option1 = document.createElement("option");
      option.value = i; option.innerText = i;
      option1.value = i; option1.innerText = i;
      filter_start_day.appendChild(option);
      filter_end_day.appendChild(option1);
    }
    for(let i=2020; i<=2050; i++){
      const option = document.createElement("option");
      const option1 = document.createElement("option");
      option.value = i; option.innerText = String(i);
      option1.value = i; option1.innerText = String(i);
      filter_start_year.appendChild(option);
      filter_end_year.appendChild(option1);
    }

  }
  
}