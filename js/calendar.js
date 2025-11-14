import { national_holidays, year_2025_holidays, initDiary } from "./diary.js";
import { loadPage } from "./utils.js";
import * as db from "./db.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const holidayYear = 2025; //modificare se si cambiano le vacanze
const today = new Date();



export function initCalendar(){


setEventListeners();
renderCalendar(today);

}


async function renderCalendar(day){

  //metto i selettori di mese/anno sui valori corretti
  const select = document.querySelectorAll("#calendar--main select");
  const month = select[0], year = select[1];
  month.value = day.getMonth();
  year.value = day.getFullYear();

  //costanti e variabili utili
  const currentYear = day.getFullYear();
  const currentMonth = day.getMonth(); //0-11
  const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();//giorno 0 = ultimo del mese precedente
  const dayFirstDay = new Date(currentYear,currentMonth, 1).getUTCDay();//0-6 giorno della settimana del primo del mese (lun-dom  )

  //elementi del DOM
  const days_span = document.querySelectorAll("#calendar--main .day .number");//span contenenti il numero
  const days_div = document.querySelectorAll("#calendar--main .day");//div del giorno
  const days_task = document.querySelectorAll("#calendar--main .day .tasks");//div dei pallini
  
  //data per event listener (il giorno parte da 1 e si incrementa fino a fine mese nel for)
  var date_el = {year: currentYear, month: currentMonth, day: 1};

  //ottengo i task dei giorni
  const dayTasks = await getDayTasks(currentYear, currentMonth, daysInMonth);
  /*console.log("DEBUG--CALENDARIO array dayTasks in renderCalendar: ", dayTasks);*/
  
  //ripulisco tutte le classi tranne .day
  days_div.forEach((dayDiv, i) => {dayDiv.classList.remove("day_hidden", "day_sunday", "day_holiday", "day_today", "day_past", "day_test"); });

  // metto i numeri ai giorni incolonnandoli giusti e aggiungendo le classi
  days_span.forEach((daySpan, i) => {
    
    const dayDiv = days_div[i];
    const taskDiv = days_task[i];

    //rendo invisibili le celle non utilizzate
    if(i<dayFirstDay || i>=dayFirstDay+daysInMonth) {dayDiv.classList.add("day_hidden")} 
    
    //metto il numero e le classi giuste alle celle utilizzate
    else{ 
      
      daySpan.textContent = i-dayFirstDay+1;//numero
      dayDiv.id = i-dayFirstDay+1;

      // Controllo giorni passati
      if( (today.getDate() > date_el.day && today.getMonth() === currentMonth && today.getFullYear() === currentYear)||( today.getMonth() > currentMonth && today.getFullYear() === currentYear)||(today.getFullYear() > currentYear) ){
        dayDiv.classList.add("day_past");
      }
      // Controllo giorno corrente
      else if(today.getDate() === date_el.day && today.getMonth() === currentMonth && today.getFullYear() === currentYear){
        dayDiv.classList.add("day_today");
      }
      // Controllo domenica
      else if((i+1)%7 === 0){
        dayDiv.classList.add("day_sunday");
      }
      //controllo festa nazionale
      else if (national_holidays.includes(`${date_el.month+1}-${date_el.day}`)) {
        dayDiv.classList.add("day_sunday");
      }
      //controllo vacanza
      else if((currentYear === holidayYear || currentYear == holidayYear+1) && year_2025_holidays.includes(`${date_el.month+1}-${date_el.day}`)){
        dayDiv.classList.add("day_holiday");
      }
      
      //tolgo le classi al taskDiv
      taskDiv.classList.remove("priority_1", "priority_2", "priority_3")
      //CONTROLLO I TASK E EVENTUALMENTE AGGIUNGO PALLINI O CLASSI
      const index = Number(i-dayFirstDay); /*console.log("DEBUG--CALENDARIO index: ", index);*/
      if(dayTasks[index].test === true) dayDiv.classList.add("day_test");
      if(dayTasks[index].priority_3 === true) taskDiv.classList.add("priority-3");
      else if(dayTasks[index].priority_2 === true) taskDiv.classList.add("priority-2");
      else if(dayTasks[index].priority_1 === true) taskDiv.classList.add("priority-1");
      
      //svuoto il taskDiv
      taskDiv.innerHTML = "";
      //se ci sono compiti creo un paragrafo con il numero
      if(dayTasks[index].tasks > 0){
        const numero_task = document.createElement("p");
        numero_task.innerText = dayTasks[index].tasks;
        taskDiv.appendChild(numero_task);      
      }


      //event listener per passare al diario -> mettere a posto
      dayDiv.addEventListener("click", () => {
        goToDiary(currentYear, currentMonth, dayDiv.id); 
      });
      date_el.day++;

    }
   
    

  });
  
}

function setEventListeners(){
  
  //elemeti del DOM da impostare
  const select = document.querySelectorAll("#calendar--main select");
  const month = select[0], year = select[1];
  const prev_month = document.querySelector("#calendar--main #prev-month");
  const next_month = document.querySelector("#calendar--main #next-month");

  //debug
  if(!select)console.error("Casella di selezione mese/anno non trovata!");
  if(!prev_month || !next_month)console.error("Pulsanti scorrimento mesi non trovati!");
  
  //ogni volta che clicco le caselle di selezione aggiorna il calendario con il mese/anno corretto
  month.addEventListener("change", () => {renderCalendar(new Date(Number(year.value), Number(month.value), 1)); });
  year.addEventListener("change", () => {renderCalendar(new Date(Number(year.value), Number(month.value), 1)); });
   
  //cambio mese se clicco prev/next
  const fresh_prev_month = prev_month.cloneNode(true);
  prev_month.replaceWith(fresh_prev_month);
  const fresh_next_month = next_month.cloneNode(true);
  next_month.replaceWith(fresh_next_month);
  
  fresh_prev_month.addEventListener("click", funcA);
  fresh_next_month.addEventListener("click", funcB);

  function funcA(){renderCalendar(new Date(Number(year.value), Number(month.value)-1, 1)); }
  function funcB(){renderCalendar(new Date(Number(year.value), Number(month.value)+1, 1)); }
}


async function goToDiary(year, month, day){ await loadPage("diary"); initDiary(new Date(year, month, day)); }


async function getDayTasks(year, month, daysInMonth){

  const dayTasks = [{}];//array di oggetti con i task da completare: giorno(1,2,3...31) => {tasks: numero, test: booleano, priority_1: booleano, priority_2: booleano, priority_3: booleano;}

  const tasks = await db.sortTasks({dataInizio: new Date(year, month, 1), dataFine: new Date(year, month+1, 0), isCompleted: false });
  console.log("DEBUG--CALENDARIO risultato sortTasks: ", tasks);
  
  //scorre tutti i task e crea un oggetto per giorno del mese
  for(let i=0; i<daysInMonth; i++){

    //inizializzo tutto a 0 = niente task per oggi
    dayTasks[i] = {tasks: 0, test: false, priority_1: false, priority_2: false, priority_3: false}; 
    
    tasks.forEach((task) => {

      if( Number(task.scadenza.toDate().getDate()) === i+1){//controlla se il giorno di scadenza task corrisponde alla pos. nell'array - non modificare, funziona
        
        dayTasks[i].tasks = dayTasks[i].tasks + 1;//aggiunge 1 ai task se la data corrisponde
        //controlla se è verifica o altrimenti la priorità
        if(task.isTest === true) dayTasks[i].test = true;
        else if(task.priority == 1) dayTasks[i].priority_1 = true;
        else if(task.priority == 2) dayTasks[i].priority_2 = true;
        else if(task.priority == 3) dayTasks[i].priority_3 = true;
      }
    });
  }
  
  console.log("DEBUG--CALENDARIO risultato getDayTasks: ", dayTasks);
  return dayTasks;
}