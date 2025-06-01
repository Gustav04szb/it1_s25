/**
 * =========================================
 * HOLIDAY CALCULATOR - FEIERTAGE BERECHNUNG
 * Berechnet alle Feiertage für Sachsen
 * =========================================
 */

class HolidayCalculator {
    
    constructor() {
        this.holidays = {};
    }

    /* ===== FEIERTAGE BERECHNUNG ===== */

    /**
     * Gaußsche Osterformel - berechnet Ostersonntag
     */
    calculateEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(year, month - 1, day);
    }

    /**
     * Buß- und Bettag - letzter Mittwoch vor 1. Advent (nur in Sachsen)
     */
    calculateBussUndBettag(year) {
        const december24 = new Date(year, 11, 24);
        const december24Weekday = december24.getDay();
        const daysToSubtract = december24Weekday === 0 ? 21 : december24Weekday + 21;
        const firstAdvent = new Date(year, 11, 24 - daysToSubtract);
        const bussUndBettag = new Date(firstAdvent);

        bussUndBettag.setDate(firstAdvent.getDate() - 11);
        
        return bussUndBettag;
    }

    /* ===== FEIERTAGE LADEN ===== */

    /**
     * JSON-Datei laden (optional)
     */
    async tryLoadHolidaysFromJSON() {
        try {
            const response = await fetch('./data/holidays.json');
            if (!response.ok) throw new Error('JSON nicht verfügbar');
            
            const data = await response.json();
            this.processHolidayData(data);
            console.log('Feiertage aus JSON geladen');
            return true;
        } catch (error) {
            console.log('JSON nicht verfügbar, verwende Fallback-Feiertage');
            return false;
        }
    }

    /**
     * Feiertage für alle Jahre berechnen
     */
    processHolidayData(holidayData) {
        this.holidays = {};
        
        for (let year = 2000; year <= 2099; year++) {
            const easter = this.calculateEaster(year);
            
            // Dynamische Feiertage basierend auf Ostern
            const goodFriday = new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000); // -2 Tage
            const easterMonday = new Date(easter.getTime() + 1 * 24 * 60 * 60 * 1000); // +1 Tag
            const ascensionDay = new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000); // +39 Tage
            const whitMonday = new Date(easter.getTime() + 50 * 24 * 60 * 60 * 1000); // +50 Tage
            const bussUndBettag = this.calculateBussUndBettag(year);
            
            this.holidays[year] = {
                // Statische Feiertage
                '1-1': { name: 'Neujahr', type: 'static' },
                '5-1': { name: 'Tag der Arbeit', type: 'static' },
                '10-3': { name: 'Tag der Deutschen Einheit', type: 'static' },
                '10-31': { name: 'Reformationstag', type: 'static' },
                '12-25': { name: '1. Weihnachtsfeiertag', type: 'static' },
                '12-26': { name: '2. Weihnachtsfeiertag', type: 'static' },
                
                // Dynamische Feiertage
                [`${goodFriday.getMonth() + 1}-${goodFriday.getDate()}`]: { name: 'Karfreitag', type: 'dynamic' },
                [`${easterMonday.getMonth() + 1}-${easterMonday.getDate()}`]: { name: 'Ostermontag', type: 'dynamic' },
                [`${ascensionDay.getMonth() + 1}-${ascensionDay.getDate()}`]: { name: 'Christi Himmelfahrt', type: 'dynamic' },
                [`${whitMonday.getMonth() + 1}-${whitMonday.getDate()}`]: { name: 'Pfingstmontag', type: 'dynamic' },
                [`${bussUndBettag.getMonth() + 1}-${bussUndBettag.getDate()}`]: { name: 'Buß- und Bettag', type: 'dynamic' }
            };
        }
    }

    /**
     * Fallback-Feiertage laden
     */
    loadHolidaysFallback() {
        console.log('Lade Fallback-Feiertage...');
        this.processHolidayData({});
        console.log('Fallback-Feiertage geladen');
    }

    /**
     * Feiertag für bestimmtes Datum abrufen
     */
    getHoliday(year, month, date) {
        const holidayKey = `${month + 1}-${date}`;
        return this.holidays[year]?.[holidayKey] || null;
    }

    /**
     * Alle Feiertage abrufen
     */
    getAllHolidays() {
        return this.holidays;
    }
} 