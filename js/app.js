
import * as db from "./db.js";
import * as utils from "./utils.js";

export var currentPage = "dashboard", lastPage = "dashboard"; //pagina corrente per tornare indietro

/*CAMBIA TEMA*/
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-theme");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
});

/*IMPOSTAZIONI*/
document.addEventListener("DOMContentLoaded",  () => {
  const settingsBtn = document.getElementById("settings");
  settingsBtn.addEventListener("click", async () => {
    await utils.loadPage("settings");
    lastPage = currentPage;
    currentPage = "settings";
  });
});

/*DASHBOARD*/
document.addEventListener("DOMContentLoaded",  () => {
  const settingsBtn = document.getElementById("dashboard");
  settingsBtn.addEventListener("click", async () => {
     await utils.loadPage("dashboard");
    lastPage = currentPage;
    currentPage = "dashboard";
  });
});

/*CALENDARIO*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("calendar");
  settingsBtn.addEventListener("click", async () => {
     await utils.loadPage("calendar");
    lastPage = currentPage;
    currentPage = "calendar";
  });
});

/*AGENDA*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("diary");
  settingsBtn.addEventListener("click", async () => {
     await utils.loadPage("diary");
    lastPage = currentPage;
    currentPage = "diary";
  });
});

/*ORARIO*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("timetable");
  settingsBtn.addEventListener("click", async () => {
     await utils.loadPage("timetable");
    lastPage = currentPage;
    currentPage = "timetable";
  });
});


// registra il service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker registrato"))
    .catch(err => console.error("Errore Service Worker:", err));
}

/*REFRESHA LA CACHE DEL BROWSER*/
if (navigator.onLine && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage("refreshCache");
} // all'avvio

setInterval(() => {
  if (navigator.online && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage("refreshCache");
  }
}, 10 * 60 * 1000); // ogni 10 minuti



db.archiveTasks(); //archivia i task passati
utils.loadAllHTML();
utils.loadAllCSS();
document.addEventListener("DOMContentLoaded", async () => {
  await utils.loadPage("dashboard"); //carica la dashboard all'avvio
});

