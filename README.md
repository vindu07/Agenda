# Agenda

/ (root)
├── index.html
├── favicon.ico
├── manifest.json
├── sw.js
│
├── assets/
│   ├── icons/
│   └── fonts/
│
├── css/
│   ├── style.css           ← stili globali (tema, variabili, layout base)
│   ├── dashboard.css
│   ├── calendar.css
│   ├── diary.css
│   ├── timetable.css
│   ├── settings.css
│   └── new-task.css
│
├── js/
│   ├── app.js              ← gestisce routing SPA, caricamento componenti, ecc.
│   ├── dashboard.js
│   ├── calendar.js
│   ├── diary.js
│   ├── timetable.js
│   ├── settings.js
│   ├── new-task.js
│   ├── db.js               ← funzioni Firebase / IndexedDB / cache
│   └── utils.js            ← helper generici (date, colori, formattazione)
│
└── html/
    ├── dashboard.html
    ├── calendar.html
    ├── diary.html
    ├── timetable.html
    ├── settings.html
    └── new-task.html
