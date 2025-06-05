/**
 * =========================================
 * CALENDAR RENDERER - KALENDER DARSTELLUNG
 * Rendert den Jahreskalender mit allen Monaten
 * =========================================
 */

class CalendarRenderer {
    
    constructor(holidayCalculator, modalManager) {
        this.holidayCalculator = holidayCalculator;
        this.modalManager = modalManager;
        
        // Deutsche Monatsnamen
        this.monthNames = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        
        // Deutsche Wochentagsabkürzungen (Montag = erster Tag)
        this.weekdayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    }

    /* ===== KALENDER BERECHNUNG ===== */

    /**
     * ISO 8601 Kalenderwoche berechnen
     * Deutschland verwendet ISO 8601 Standard
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /* ===== KALENDER RENDERING ===== */

    /**
     * Hauptfunktion: Kompletten Jahreskalender rendern
     */
    renderCalendar(year) {
        // Seitentitel aktualisieren
        document.getElementById('page-title').textContent = `Kalender ${year}`;
        document.getElementById('calendar-title').textContent = `Kalender ${year}`;
        
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';
        
        // Aktuelles Datum für Markierung des aktuellen Monats
        const today = new Date();
        const currentMonth = today.getMonth();
        let currentMonthElement = null;
        
        // Alle 12 Monate erstellen
        for (let month = 0; month < 12; month++) {
            const monthContainer = this.renderMonth(year, month);
            
            // Aktuellen Monat markieren
            if (month === currentMonth && year === today.getFullYear()) {
                monthContainer.classList.add('current-month');
                monthContainer.id = 'current-month';
                currentMonthElement = monthContainer;
            }
            
            calendarGrid.appendChild(monthContainer);
        }
        
        // Zum aktuellen Monat scrollen, wenn Option aktiviert
        const autoFocusEnabled = this.getAutoFocusSetting();
        if (currentMonthElement && autoFocusEnabled && window.innerWidth <= 1200) {
            // Verzögerung für korrektes Rendering
            setTimeout(() => {
                currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
    
    /**
     * Auto-Focus-Einstellung laden
     */
    getAutoFocusSetting() {
        try {
            const savedValue = localStorage.getItem('autoFocusCurrentMonth');
            // Wenn kein Wert gespeichert ist oder der Wert "true" ist, true zurückgeben
            return savedValue === null || savedValue === 'true';
        } catch (e) {
            console.warn('LocalStorage nicht verfügbar:', e);
            return true; // Standard: aktiviert
        }
    }

    /**
     * Einzelnen Monat rendern
     */
    renderMonth(year, month) {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';

        // Monats-Header erstellen
        const monthHeader = this.createMonthHeader(month);
        monthContainer.appendChild(monthHeader);

        // Wochentagszeile erstellen
        const weekdays = this.createWeekdaysHeader();
        monthContainer.appendChild(weekdays);

        // Tage-Grid erstellen
        const daysGrid = this.createDaysGrid(year, month);
        monthContainer.appendChild(daysGrid);

        return monthContainer;
    }

    /**
     * Monats-Header erstellen
     */
    createMonthHeader(month) {
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        
        const monthName = document.createElement('h3');
        monthName.className = 'month-name';
        monthName.textContent = this.monthNames[month];
        
        monthHeader.appendChild(monthName);
        return monthHeader;
    }

    /**
     * Wochentagszeile erstellen
     */
    createWeekdaysHeader() {
        const weekdays = document.createElement('div');
        weekdays.className = 'weekdays';
        
        // Leere Zelle für Kalenderwoche-Spalte
        const emptyCell = document.createElement('div');
        emptyCell.className = 'weekday';
        emptyCell.textContent = 'KW';
        weekdays.appendChild(emptyCell);
        
        // Wochentagsnamen hinzufügen
        this.weekdayNames.forEach(day => {
            const weekday = document.createElement('div');
            weekday.className = 'weekday';
            weekday.textContent = day;
            weekdays.appendChild(weekday);
        });
        
        return weekdays;
    }

    /**
     * Tage-Grid für einen Monat erstellen
     */
    createDaysGrid(year, month) {
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        // Ersten Tag des Monats ermitteln
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Wochentag des ersten Tags (Montag = 0, Sonntag = 6)
        let startDay = (firstDay.getDay() + 6) % 7;
        
        // Alle Tage sammeln (vorherige + aktuelle + nächste Monate)
        const allDays = [];
        
        // Tage vom vorherigen Monat
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            allDays.push({
                date: prevMonthDays - i,
                type: 'other-month',
                actualDate: new Date(year, month - 1, prevMonthDays - i)
            });
        }
        
        // Tage des aktuellen Monats
        const today = new Date();
        const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
        
        for (let date = 1; date <= lastDay.getDate(); date++) {
            const currentDate = new Date(year, month, date);
            allDays.push({
                date: date,
                type: 'current-month',
                actualDate: currentDate,
                isCurrentMonth: isCurrentMonth,
                isToday: isCurrentMonth && date === today.getDate()
            });
        }
        
        // Tage vom nächsten Monat hinzufügen (um komplette Wochen zu haben)
        let nextMonthDate = 1;
        while (allDays.length % 7 !== 0) {
            allDays.push({
                date: nextMonthDate,
                type: 'other-month',
                actualDate: new Date(year, month + 1, nextMonthDate)
            });
            nextMonthDate++;
        }
        
        // Grid mit Kalenderwochen und Tagen füllen
        for (let i = 0; i < allDays.length; i++) {
            // Am Anfang jeder Woche (jede 7 Tage) eine Kalenderwoche hinzufügen
            if (i % 7 === 0) {
                const weekNum = this.getWeekNumber(allDays[i].actualDate);
                const weekCell = document.createElement('div');
                weekCell.className = 'week-number';
                weekCell.textContent = weekNum;
                daysGrid.appendChild(weekCell);
            }
            
            // Tag hinzufügen
            const dayInfo = allDays[i];
            const day = document.createElement('div');
            day.textContent = dayInfo.date;
            
            if (dayInfo.type === 'other-month') {
                day.className = 'day other-month';
            } else {
                day.className = 'day';
                
                // Heutiger Tag markieren
                if (dayInfo.isToday) {
                    day.classList.add('current-day');
                }
                
                // Feiertage prüfen und markieren
                const holiday = this.holidayCalculator.getHoliday(year, month, dayInfo.date);
                if (holiday) {
                    day.classList.add(`holiday-${holiday.type}`);
                    
                    // Klick-Event für Feiertagsdetails
                    day.addEventListener('click', () => {
                        this.modalManager.showHolidayModal(
                            holiday.name, 
                            `${dayInfo.date}.${month + 1}.${year}`,
                            holiday.description
                        );
                    });
                    day.style.cursor = 'pointer';
                    day.title = holiday.name;
                }
            }
            
            daysGrid.appendChild(day);
        }

        return daysGrid;
    }
}  