# Kalender Sachsen - Progressive Web App

Jahreskalender für Sachsen (2000-2099) mit allen sächsischen Feiertagen als Progressive Web App.

## 🎯 Funktionen

### ✅ Kernfunktionen
- **Jahresansicht**: Vollständiger Kalender mit 12 Monaten in responsive Grid
- **Jahresauswahl**: Dropdown für Jahre 2000-2099
- **Aktuelle Tag Hervorhebung**: Grüne Markierung des heutigen Datums
- **Kalenderwochen**: ISO 8601 konforme KW-Anzeige
- **Feiertage Sachsen**:
  - **Statische Feiertage** (rot): Neujahr, Tag der Arbeit, Tag der Deutschen Einheit, Reformationstag, Weihnachten
  - **Dynamische Feiertage** (orange): Karfreitag, Ostermontag, Himmelfahrt, Pfingstmontag, Buß- und Bettag
- **Feiertag-Details**: Modal mit Feiertagsname und Datum bei Klick
- **Responsive Design**: 
  - Desktop: 4×3 Grid
  - Tablet: 3×4 Grid  
  - Mobile: 1×12 Grid

### 🚀 PWA Features
- **Installierbar**: Als native App installierbar
- **Offline-fähig**: Funktioniert ohne Internetverbindung
- **Service Worker**: Caching für bessere Performance
- **Manifest**: PWA-Metadaten für Installation

## 📁 Projektstruktur

```
📦 Kalender Sachsen PWA
├── 📄 index.html          # Haupt-HTML-Datei
├── 📄 manifest.json       # PWA Manifest
├── 📄 sw.js              # Service Worker
├── 📄 README.md          # Diese Datei
├── 📂 css/
│   └── 📄 styles.css     # Haupt-Stylesheet
├── 📂 js/
│   └── 📄 script.js      # Haupt-JavaScript
├── 📂 data/
│   └── 📄 holidays.json  # Feiertag-Daten (AJAX)
└── 📂 assets/
    ├── 🖼️ menu_24dp...svg      # Menu Icon
    ├── 🖼️ menu_open_24dp...svg # Menu Open Icon
    └── 🖼️ home_24dp...svg      # Home Icon
```

## 🛠️ Installation & Nutzung

### Lokale Entwicklung
1. Dateien herunterladen
2. Mit lokalem Webserver starten (z.B. Live Server in VS Code)
3. Im Browser öffnen: `http://localhost:5500`

### Als PWA installieren
1. Website im Browser öffnen
2. Browser-Installationsaufforderung folgen
3. **Chrome/Edge**: Menü → "App installieren"
4. **Mobile**: "Zum Startbildschirm hinzufügen"

## 🔧 Technische Details

### Architektur
- **Frontend**: Vanilla JavaScript (ES6+), CSS3, HTML5
- **Datenquelle**: JSON-Datei (AJAX), Fallback hardcoded
- **Caching**: Service Worker mit Cache-First Strategie
- **Responsive**: CSS Grid + Media Queries

### Feiertag-Berechnung
- **Statische Feiertage**: Fest definierte Daten
- **Osterabhängige Feiertage**: Gaußsche Osterformel
- **Buß- und Bettag**: Mittwoch vor dem 23. November

### Responsive Breakpoints
```css
Desktop:    > 1200px  → 4×3 Grid
Tablet:     ≤ 1200px  → 3×4 Grid
Mobile:     ≤ 768px   → 1×12 Grid
Small:      ≤ 480px   → Optimiert für kleine Displays
```

## 📋 Aufgaben-Erfüllung

### ✅ Pflichtanforderungen
- [x] Progressive Web App
- [x] Jahreskalender 2000-2099
- [x] Sachsen-spezifische Feiertage
- [x] Responsive Design (4×3, 3×4, 1×12)
- [x] Aktuelle Tag Hervorhebung
- [x] Kalenderwochen (KW)
- [x] Feiertag-Modal bei Klick
- [x] Jahr-Auswahl via Dropdown
- [x] Gaußsche Osterformel

### 🌟 Zusatzfunktionen
- [x] PWA Manifest + Service Worker
- [x] Externe JSON-Datei (AJAX)
- [x] Material Design Icons
- [x] Offline-Funktionalität

---

**Entwickelt für**: IT1 Internetechnik Kurs  
**Version**: 1.0 