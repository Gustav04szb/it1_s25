/**
 * =========================================
 * KALENDER SACHSEN - PROGRESSIVE WEB APP
 * Hauptklasse für die Kalender-Anwendung
 * =========================================
 */

class CalendarApp {
    
    /**
     * Konstruktor - Initialisiert die Kalender-Anwendung
     */
    constructor() {
        // Aktuelles Jahr als Standard
        this.currentYear = new Date().getFullYear();
        
        // Komponenten initialisieren
        this.holidayCalculator = new HolidayCalculator();
        this.modalManager = new ModalManager();
        this.calendarRenderer = new CalendarRenderer(this.holidayCalculator, this.modalManager);
        this.uiManager = new UIManager(this);
        
        // Anwendung starten
        this.init();
    }

    /* ===== HAUPTINITIALISIERUNG ===== */

    /**
     * Hauptinitialisierung der Anwendung
     */
    async init() {
        console.log('Kalender Sachsen PWA wird gestartet...');
        
        // UI Setup
        this.uiManager.setupEventListeners();
        this.uiManager.populateYearSelect();
        
        // Feiertage laden
        this.holidayCalculator.loadHolidaysFallback();      // Fallback-Feiertage laden
        
        // Ersten Kalender rendern
        this.calendarRenderer.renderCalendar(this.currentYear);
        
        // Versuche JSON zu laden (optional)
        const jsonLoaded = await this.holidayCalculator.tryLoadHolidaysFromJSON();
        if (jsonLoaded) {
            // Kalender mit JSON-Daten neu rendern
            this.calendarRenderer.renderCalendar(this.currentYear);
        }
        
        console.log('Kalender erfolgreich initialisiert');
    }

    /* ===== JAHR VERWALTUNG ===== */

    /**
     * Jahr aktualisieren und Kalender neu rendern
     */
    updateYear(newYear) {
        if (newYear >= 2000 && newYear <= 2099) {
            this.currentYear = newYear;
            this.calendarRenderer.renderCalendar(newYear);
            console.log(`Jahr geändert zu: ${newYear}`);
        } else {
            console.warn('Jahr muss zwischen 2000 und 2099 liegen');
        }
    }

    /**
     * Aktuelles Jahr abrufen
     */
    getCurrentYear() {
        return this.currentYear;
    }

    /* ===== KOMPONENTEN ZUGRIFF ===== */

    /**
     * Holiday Calculator Instanz abrufen
     */
    getHolidayCalculator() {
        return this.holidayCalculator;
    }

    /**
     * Calendar Renderer Instanz abrufen
     */
    getCalendarRenderer() {
        return this.calendarRenderer;
    }

    /**
     * UI Manager Instanz abrufen
     */
    getUIManager() {
        return this.uiManager;
    }

    /**
     * Modal Manager Instanz abrufen
     */
    getModalManager() {
        return this.modalManager;
    }
}

/* ===== ANWENDUNG STARTEN ===== */

// Kalender-App initialisieren sobald DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    // Globale App-Instanz für Debugging
    window.calendarApp = new CalendarApp();
}); 