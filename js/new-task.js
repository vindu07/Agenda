export function initNewTask(){

/*MOSTRA/NASCONDE HUD*/
  const annulla = document.getElementById("annulla-task");
  annulla.addEventListener("click", () => {
    const hud = document.getElementById("hud"); 
    hud.classList.add("invisible");
  });
});

/*SALVA TASK*/

document.getElementById("save-task").addEventListener("click", () => {
  
  // raccogli valori dall'HUD
  const scadenza = new Date(pagDiario);
  const isCompleted = false;
  const desc = document.getElementById("task-desc").value.trim();
  const materia = document.getElementById("task-subject").value;
  const isTest = document.getElementById("isTest").value === "0" ? false : true;
  const priority = parseInt(document.getElementById("task-priority").value);
  
  //chiudi hud
  const hud = document.getElementById("hud"); 
    hud.classList.toggle("invisible");

  // costruisci un array task
  const newTask = [ scadenza, materia, isTest, priority, desc, isCompleted  ];

  //salva in firestore
  db.createTask(newTask);

  const salva = document.getElementById("save-task");
  salva.addEventListener("click", () => {
    const hud = document.getElementById("hud"); 
    hud.classList.toggle("invisible");
  });
});

}
