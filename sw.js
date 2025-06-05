/**
 * =========================================
 * SERVICE WORKER - KALENDER SACHSEN PWA
 * Offline-Funktionalität und Caching
 * =========================================
 */

/* ===== CACHE KONFIGURATION ===== */

// Cache-Name mit Versionsnummer für einfache Updates
const CACHE_NAME = 'kalender-sachsen-v2';

// Alle wichtigen Dateien die gecacht werden sollen
const urlsToCache = [
  // Basis-Dateien
  './',
  './index.html',
  './manifest.json',
  
  // Stylesheets und Scripts
  './css/styles.css',
  './js/script.js',
  
  // Daten
  './data/holidays.json',
  
  // SVG Icons
  './assets/menu_24dp_8B5CF6_FILL0_wght400_GRAD0_opsz24.svg',
  './assets/menu_open_24dp_8B5CF6_FILL0_wght400_GRAD0_opsz24.svg',
  './assets/home_24dp_8B5CF6_FILL0_wght400_GRAD0_opsz24.svg',
  './assets/info_24dp_8B5CF6_FILL0_wght400_GRAD0_opsz24.svg',
  
  // Wichtigste Favicons
  './assets/favicons/favicon-16x16.png',
  './assets/favicons/favicon-32x32.png',
  './assets/favicons/favicon-96x96.png',
  './assets/favicons/android-icon-192x192.png',
  './assets/favicons/apple-icon-180x180.png'
];

/* ===== SERVICE WORKER EVENTS ===== */

/**
 * INSTALL EVENT
 * Wird ausgeführt wenn Service Worker zum ersten Mal installiert wird
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache wird erstellt und Dateien werden hinzugefügt');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Alle Dateien erfolgreich gecacht');
        return self.skipWaiting(); // Sofort aktivieren
      })
  );
});

/**
 * ACTIVATE EVENT
 * Wird ausgeführt wenn Service Worker aktiviert wird
 * Bereinigt alte Caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Alte Caches werden bereinigt');
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker übernimmt Kontrolle');
      return self.clients.claim();
    }).then(() => {
      console.log('Service Worker Aktivierung abgeschlossen');
    })
  );
});

/**
 * FETCH EVENT
 * Intercepted alle Netzwerk-Anfragen
 * Cache-First Strategie für bessere Performance
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Wenn Datei im Cache gefunden, verwende Cache-Version
        if (response) {
          console.log('Lade aus Cache:', event.request.url);
          return response;
        }
        
        // Sonst vom Netzwerk laden
        console.log('Lade vom Netzwerk:', event.request.url);
        return fetch(event.request);
      })
      .catch(() => {
        // Fallback für Navigation-Requests wenn offline
        if (event.request.mode === 'navigate') {
          console.log('Offline-Fallback: Lade cached index.html');
          return caches.match('./index.html');
        }
      })
  );
}); 