/**
 * =========================================
 * UI MANAGER - BENUTZEROBERFLÄCHEN VERWALTUNG
 * Event Listeners und UI-Interaktionen
 * =========================================
 */

class UIManager {
    
    constructor(calendarApp) {
        this.calendarApp = calendarApp;
        // Standard-Einstellung für automatische Fokussierung des aktuellen Monats
        this.autoFocusCurrentMonth = this.loadAutoFocusSetting();
    }

    /* ===== EVENT LISTENER SETUP ===== */

    /**
     * Event Listener für alle Benutzerinteraktionen einrichten
     */
    setupEventListeners() {
        // Jahresauswahl Overlay Toggle
        this.setupTopbarToggle();
        
        // Info-Box Toggle
        this.setupInfoBoxToggle();
        
        // Custom Select Events
        this.setupCustomSelect();
        
        // Navigation Events
        this.setupNavigationEvents();
        
        // Fokus-Option Events
        this.setupFocusOptionEvents();
        
        // Global Events (Außerhalb klicken, ESC)
        this.setupGlobalEvents();
    }

    /**
     * Topbar (Jahresauswahl) Toggle Events
     */
    setupTopbarToggle() {
        document.getElementById('toggle-topbar').addEventListener('click', () => {
            const topbar = document.getElementById('topbar');
            topbar.classList.toggle('hidden');
            this.updateMenuIcon(!topbar.classList.contains('hidden'));
        });
    }

    /**
     * Info-Box Toggle Events
     */
    setupInfoBoxToggle() {
        // Info-Box anzeigen
        document.getElementById('show-info').addEventListener('click', () => {
            const infoBox = document.getElementById('info-box');
            infoBox.classList.toggle('hidden');
        });

        // Info-Box schließen
        document.getElementById('close-info').addEventListener('click', () => {
            const infoBox = document.getElementById('info-box');
            infoBox.classList.add('hidden');
        });
    }

    /**
     * Custom Select Events einrichten
     */
    setupCustomSelect() {
        // Custom Select Toggle
        document.getElementById('year-select').addEventListener('click', (e) => {
            e.stopPropagation();
            const select = document.getElementById('year-select');
            const options = document.getElementById('year-options');
            
            select.classList.toggle('active');
            options.classList.toggle('hidden');
        });
    }

    /**
     * Navigation Events einrichten
     */
    setupNavigationEvents() {
        // Zum aktuellen Jahr zurückkehren
        document.getElementById('reload-calendar').addEventListener('click', () => {
            const currentYear = new Date().getFullYear();
            this.calendarApp.updateYear(currentYear);
            this.updateSelectedYear(currentYear);
            
            // Nach dem Rendern zum aktuellen Monat scrollen auf mobilen Geräten
            if (this.autoFocusCurrentMonth && window.innerWidth <= 768) {
                setTimeout(() => {
                    const currentMonthElement = document.getElementById('current-month');
                    if (currentMonthElement) {
                        currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        });

        // Jahr anwenden
        document.getElementById('apply-year').addEventListener('click', () => {
            const selectedYear = parseInt(document.getElementById('year-select').getAttribute('data-value'));
            this.calendarApp.updateYear(selectedYear);
            document.getElementById('topbar').classList.add('hidden');
            this.updateMenuIcon(false);
            this.closeCustomSelect();
            
            // Bei aktuellem Jahr zum aktuellen Monat scrollen auf mobilen Geräten
            if (this.autoFocusCurrentMonth && selectedYear === new Date().getFullYear() && window.innerWidth <= 768) {
                setTimeout(() => {
                    const currentMonthElement = document.getElementById('current-month');
                    if (currentMonthElement) {
                        currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        });
    }

    /**
     * Fokus-Option Events einrichten
     */
    setupFocusOptionEvents() {
        const checkbox = document.getElementById('auto-focus-month');
        
        // Checkbox-Status aus localStorage laden
        checkbox.checked = this.autoFocusCurrentMonth;
        
        // Änderungen speichern
        checkbox.addEventListener('change', () => {
            this.autoFocusCurrentMonth = checkbox.checked;
            this.saveAutoFocusSetting(checkbox.checked);
        });
    }

    /**
     * Globale Events (Außerhalb klicken, ESC) einrichten
     */
    setupGlobalEvents() {
        // Außerhalb klicken - Overlays schließen
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // ESC-Taste - Alle Overlays schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllOverlays();
            }
        });
        
        // Fenster-Größenänderung - Aktuellen Monat fokussieren auf mobilen Geräten
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Behandlung von Fenster-Größenänderungen
     */
    handleResize() {
        // Nur auf mobilen Geräten zum aktuellen Monat scrollen, wenn Option aktiviert
        if (this.autoFocusCurrentMonth && window.innerWidth <= 768) {
            const currentMonthElement = document.getElementById('current-month');
            if (currentMonthElement) {
                setTimeout(() => {
                    currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }

    /* ===== UI HILFSFUNKTIONEN ===== */

    /**
     * Behandlung von Klicks außerhalb der Overlays
     */
    handleOutsideClick(e) {
        const topbar = document.getElementById('topbar');
        const toggleButton = document.getElementById('toggle-topbar');
        const customSelect = document.getElementById('year-select');
        const options = document.getElementById('year-options');
        const infoBox = document.getElementById('info-box');
        const infoButton = document.getElementById('show-info');
        
        // Custom Select schließen wenn außerhalb geklickt
        if (!customSelect.contains(e.target) && !options.contains(e.target)) {
            this.closeCustomSelect();
        }
        
        // Topbar schließen wenn außerhalb geklickt
        if (!topbar.classList.contains('hidden') && 
            !topbar.contains(e.target) && 
            !toggleButton.contains(e.target)) {
            topbar.classList.add('hidden');
            this.updateMenuIcon(false);
            this.closeCustomSelect();
        }

        // Info-Box schließen wenn außerhalb geklickt
        if (!infoBox.classList.contains('hidden') && 
            !infoBox.contains(e.target) && 
            !infoButton.contains(e.target)) {
            infoBox.classList.add('hidden');
        }
    }

    /**
     * Alle Overlays schließen (für ESC-Taste)
     */
    closeAllOverlays() {
        document.getElementById('topbar').classList.add('hidden');
        document.getElementById('info-box').classList.add('hidden');
        this.updateMenuIcon(false);
        this.closeCustomSelect();
    }

    /**
     * Menu Icon zwischen normal und geöffnet wechseln
     */
    updateMenuIcon(isOpen) {
        const menuButton = document.getElementById('toggle-topbar');
        const iconImg = menuButton.querySelector('.icon-svg');
        
        if (isOpen) {
            iconImg.src = 'assets/menu_open_24dp_8B5CF6_FILL0_wght400_GRAD0_opsz24.svg';
            iconImg.alt = 'Menu Open';
        } else {
            iconImg.src = 'assets/menu_24dp_8B5CF6_FILL0_wght400_GRAD0_opsz24.svg';
            iconImg.alt = 'Menu';
        }
    }

    /**
     * Custom Select Dropdown schließen
     */
    closeCustomSelect() {
        const select = document.getElementById('year-select');
        const options = document.getElementById('year-options');
        select.classList.remove('active');
        options.classList.add('hidden');
    }

    /**
     * Gewähltes Jahr in der Custom Select aktualisieren
     */
    updateSelectedYear(year) {
        const select = document.getElementById('year-select');
        const selectedValue = select.querySelector('.selected-value');
        
        select.setAttribute('data-value', year);
        if (selectedValue) {
            selectedValue.textContent = year;
        }
        
        // Markierung in den Optionen aktualisieren
        const options = document.querySelectorAll('.select-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (parseInt(option.getAttribute('data-value')) === year) {
                option.classList.add('selected');
            }
        });
    }

    /* ===== EINSTELLUNGEN SPEICHERN/LADEN ===== */
    
    /**
     * Auto-Focus-Einstellung speichern
     */
    saveAutoFocusSetting(value) {
        try {
            localStorage.setItem('autoFocusCurrentMonth', value);
        } catch (e) {
            console.warn('LocalStorage nicht verfügbar:', e);
        }
    }
    
    /**
     * Auto-Focus-Einstellung laden
     */
    loadAutoFocusSetting() {
        try {
            const savedValue = localStorage.getItem('autoFocusCurrentMonth');
            // Wenn kein Wert gespeichert ist oder der Wert "true" ist, true zurückgeben
            return savedValue === null || savedValue === 'true';
        } catch (e) {
            console.warn('LocalStorage nicht verfügbar:', e);
            return true; // Standard: aktiviert
        }
    }

    /* ===== JAHRESAUSWAHL SETUP ===== */

    /**
     * Custom Select mit Jahren 2000-2099 befüllen
     */
    populateYearSelect() {
        const optionsContainer = document.getElementById('year-options');
        const currentYear = new Date().getFullYear();
        
        // Sofort das aktuelle Jahr anzeigen
        this.updateSelectedYear(currentYear);
        
        // Alle Jahre von 2000 bis 2099 erstellen
        for (let year = 2000; year <= 2099; year++) {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.setAttribute('data-value', year);
            option.textContent = year;
            
            // Aktuelles Jahr markieren
            if (year === currentYear) {
                option.classList.add('selected');
            }
            
            // Klick-Event für jede Option
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedYear = parseInt(option.getAttribute('data-value'));
                this.updateSelectedYear(selectedYear);
                this.closeCustomSelect();
            });
            
            optionsContainer.appendChild(option);
        }
    }
} 