const CACHE_NAME = "agenda-cache-v2";
const FILES_TO_CACHE = [
  "sw.js",
  "index.html",
  "html/timetable.html",
  "html/diary.html",
  "html/calendar.html",
  "html/dashboard.html",
  "html/settings.html",
  "html/new-task.html",
  "css/style.css",
  "css/calendar.css",
  "css/dashboard.css",
  "css/diary.css",
  "css/timetable.css",
  "css/settings.css",
  "css/new-task.css",
  "js/app.js",
  "js/calendar.js",
  "js/dashboard.js",
  "js/db.js",
  "js/diary.js",
  "js/timetable.js",
  "js/settings.js",
  "js/new-task.js",
  "js/utils.js",
  "assets/icons/canc.png",
  "assets/icons/icon-192.png",
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap",
  "https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap",
  "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js",
  "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"
];

/*CONTROLLA UNO A UNO I FILE E MANDA ERRORE SE NON RIESCE A SALVARLI- SOLO PER DEBUG
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (let asset of FILES_TO_CACHE) {
        try {
          await cache.add(asset);
          console.log("Cachato:", asset);
        } catch (err) {
          console.error("Errore cache:", asset, err);
        }
      }
    })
  );
});*/


// installazione → cache dei file base
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// attivazione → elimina cache vecchie
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// fetch → serve i file dalla cache se disponibili
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Listener per aggiornare cache
self.addEventListener("message", (event) => {
  if (event.data === "refreshCache") {
    refreshCache();
  }
});

// Funzione che aggiorna la cache
async function refreshCache() {
  const cache = await caches.open(CACHE_NAME);
  FILES_TO_CACHE.forEach(async (url) => {
    try {
      const response = await fetch(url, { cache: "no-store" });
      await cache.put(url, response);
      console.log("Cache aggiornata:", url);
    } catch (err) {
      console.error("Errore aggiornamento cache:", url, err);
    }
  });
}
