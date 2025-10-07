
import * as db from "./db.js";
import * as utils from "./utils.js";


/*CAMBIA TEMA*/
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-theme");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
});

/*IMPOSTAZIONI*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settings");
  settingsBtn.addEventListener("click", () => {
    await utils.loadPage("settings");
  });
});

/*DASHBOARD*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("dashboard");
  settingsBtn.addEventListener("click", () => {
     await utils.loadPage("dashboard");
  });
});

/*CALENDARIO*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("calendar");
  settingsBtn.addEventListener("click", () => {
     await utils.loadPage("calendar");
  });
});

/*AGENDA*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("diary");
  settingsBtn.addEventListener("click", () => {
     await utils.loadPage("diary");
  });
});

/*ORARIO*/
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("timetable");
  settingsBtn.addEventListener("click", () => {
     await utils.loadPage("timetable");
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

