/**
 * =========================================
 * MODAL MANAGER - MODAL VERWALTUNG
 * Verwaltet alle Modal-Dialoge
 * =========================================
 */

class ModalManager {
    
    constructor() {
        this.setupModalEvents();
    }

    /* ===== MODAL EVENT SETUP ===== */

    /**
     * Event Listener für Modal-Funktionen einrichten
     */
    setupModalEvents() {
        // Modal schließen bei Klick auf Overlay oder Close-Button
        document.getElementById('holiday-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                this.hideHolidayModal();
            }
        });

        // ESC-Taste für Modal abfangen (wird bereits global behandelt)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideHolidayModal();
            }
        });
    }

    /* ===== MODAL FUNKTIONEN ===== */

    /**
     * Modal mit Feiertagsdetails anzeigen
     */
    showHolidayModal(holidayName, dateString) {
        const modal = document.getElementById('holiday-modal');
        const nameElement = document.getElementById('holiday-name');
        const dateElement = document.getElementById('holiday-date');
        
        // Modal-Inhalt setzen
        nameElement.textContent = holidayName;
        dateElement.textContent = `Datum: ${dateString}`;
        
        // Modal anzeigen
        modal.classList.remove('hidden');
        
        // Fokus auf Modal setzen für bessere Accessibility
        modal.focus();
    }

    /**
     * Holiday Modal verstecken
     */
    hideHolidayModal() {
        const modal = document.getElementById('holiday-modal');
        modal.classList.add('hidden');
    }

    /**
     * Alle Modals schließen
     */
    closeAllModals() {
        this.hideHolidayModal();
    }
} 