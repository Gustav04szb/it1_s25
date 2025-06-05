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
     * JSON-Datei laden
     */
    async loadHolidaysFromJSON() {
        try {
            const response = await fetch('./data/holidays.json');
            if (!response.ok) throw new Error('JSON nicht verfügbar');
            
            const data = await response.json();
            this.processHolidayData(data);
            console.log('Feiertage aus JSON geladen');
            return true;
        } catch (error) {
            console.error('Fehler beim Laden der Feiertage:', error);
            return false;
        }
    }

    /**
     * Feiertage für alle Jahre berechnen
     */
    processHolidayData(holidayData) {
        this.holidays = {};
        
        // Jahresbereich aus Metadaten oder Standard verwenden
        const startYear = holidayData?.metadata?.year_range?.start || 2000;
        const endYear = holidayData?.metadata?.year_range?.end || 2099;
        
        for (let year = startYear; year <= endYear; year++) {
            this.holidays[year] = {};
            
            // Statische Feiertage aus JSON übernehmen
            if (holidayData?.static_holidays && Array.isArray(holidayData.static_holidays)) {
                holidayData.static_holidays.forEach(holiday => {
                    const key = `${holiday.month}-${holiday.day}`;
                    this.holidays[year][key] = {
                        name: holiday.name,
                        type: holiday.type || 'static',
                        description: holiday.description || ''
                    };
                });
            }
            
            // Dynamische Feiertage berechnen basierend auf JSON-Definitionen
            if (holidayData?.dynamic_holidays && Array.isArray(holidayData.dynamic_holidays)) {
                // Ostersonntag berechnen (Basis für viele dynamische Feiertage)
                const easter = this.calculateEaster(year);
                
                holidayData.dynamic_holidays.forEach(holiday => {
                    let holidayDate;
                    
                    // Berechnung basierend auf Ostern-Offset
                    if (holiday.easter_offset !== undefined) {
                        holidayDate = new Date(easter);
                        holidayDate.setDate(easter.getDate() + holiday.easter_offset);
                    } 
                    // Spezielle Berechnungen
                    else if (holiday.calculation === 'wednesday_before_november_23') {
                        holidayDate = this.calculateBussUndBettag(year);
                    }
                    
                    if (holidayDate) {
                        const key = `${holidayDate.getMonth() + 1}-${holidayDate.getDate()}`;
                        this.holidays[year][key] = {
                            name: holiday.name,
                            type: holiday.type || 'dynamic',
                            description: holiday.description || ''
                        };
                    }
                });
            }
        }
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