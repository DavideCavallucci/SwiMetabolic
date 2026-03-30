// ==========================================
// app.js - LOGICA CENTRALE E PROTOCOLLO FIN
// ==========================================

import { fetchAthletes, saveAthleteApi, deleteAthleteApi } from './api.js';
import { renderTable, updateRadarChart, exportToCSV } from './ui.js';

// Inizializza tutto e collega le funzioni all'oggetto globale (window) per l'HTML
document.addEventListener('DOMContentLoaded', () => {
    fetchAthletes(); // Carica subito la squadra
    
    const form = document.getElementById('calcForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculate();
        });
    }

    // Rendiamo globali le funzioni chiamate direttamente dai bottoni HTML
    window.calculate = calculate;
    window.saveAthlete = handleSaveAthlete;
    window.deleteAthlete = handleDeleteAthlete;
    window.loadAthleteData = loadAthleteData;
    window.exportToCSV = exportToCSV;
});

// Controllo rigoroso Protocollo FIN (Solo 400-200 o 200-100)
function isValidFINPair(d1, d2) {
    const allowed = [[400, 200], [200, 400], [200, 100], [100, 200]];
    return allowed.some(pair => pair[0] === d1 && pair[1] === d2);
}

function calculate() {
    const d1 = parseInt(document.getElementById('d1').value);
    const d2 = parseInt(document.getElementById('d2').value);
    
    // 1. Controllo distanze ammesse (Protocollo FIN)
    const allowed = [[400, 200], [200, 400], [200, 100], [100, 200]];
    if (!allowed.some(p => p[0] === d1 && p[1] === d2)) {
        alert("PROTOCOLLO FIN: Sono ammesse solo coppie 400-200 o 200-100.");
        return;
    }

    const t1 = getSeconds('1'), t2 = getSeconds('2');
    if (t1 <= 0 || t2 <= 0) return;

    // 2. Identificazione Test Corto e Test Lungo (per gestire l'ordine di inserimento)
    let d_short, t_short, d_long, t_long;
    if (d1 < d2) {
        [d_short, t_short, d_long, t_long] = [d1, t1, d2, t2];
    } else {
        [d_short, t_short, d_long, t_long] = [d2, t2, d1, t1];
    }

    // 3. CALCOLO DIFFERENZIALE (Delta)
    // Formula SIT: Tempo Lungo - (Tempo Corto * 2)
    const differential = t_long - (t_short * 2);

    // 4. DETERMINAZIONE ANDATURA B2 (Pace 100m)
    let b2_100;
    if (d_short === 100 && d_long === 200) {
        // Coppia 100-200: B2 = Tempo 100m + Differenziale
        b2_100 = t_short + differential;
    } else if (d_short === 200 && d_long === 400) {
        // Coppia 200-400: B2 = (Tempo 200m + (Differenziale / 1.02)) / 2
        // Il coefficiente 1.02 compensa la perdita di efficienza sulla distanza doppia
        b2_100 = (t_short + (differential / 1.02)) / 2;
    } else {
        // Fallback: media semplice (non dovrebbe succedere con i filtri sopra)
        b2_100 = t_long / (d_long / 100);
    }

    // 5. DEFINIZIONE ZONE METABOLICHE (Moltiplicatori SIT)
    const zones = [
        { id: 'A1', m: 1.1576, label: 'Aerobico Blando' },
        { id: 'A2', m: 1.1025, label: 'Aerobico Adattativo' },
        { id: 'B1', m: 1.05, label: 'Soglia Aerobica' },
        { id: 'B2', m: 1.0, label: 'VO2 Max' },
        { id: 'C1', m: 0.95, label: 'Tolleranza Lattacida' },
        { id: 'C2', m: 0.90, label: 'Picco di Lattato' }
    ];

    // 6. AGGIORNAMENTO UI
    renderTable(b2_100, zones);
    updateRadarChart(b2_100, differential);
}

function handleSaveAthlete() {
    const d1 = parseInt(document.getElementById('d1').value);
    const d2 = parseInt(document.getElementById('d2').value);
    
    if (!isValidFINPair(d1, d2)) {
        alert("Impossibile salvare: Distanze non valide per il Protocollo FIN.");
        return;
    }

    const getS = (id) => (parseInt(document.getElementById('m'+id).value) || 0) * 60 + (parseInt(document.getElementById('s'+id).value) || 0) + (parseInt(document.getElementById('c'+id).value) || 0) / 100;
    const t1 = getS('1');
    const t2 = getS('2');

    if (t1 <= 0 || t2 <= 0) return alert("Inserisci i tempi prima di salvare!");

    const name = prompt("Nome dell'atleta da aggiungere alla squadra:");
    if(!name || name.trim() === '') return;

    const data = { name, d1, t1, d2, t2 };
    
    saveAthleteApi(data);
    document.getElementById('db-section').scrollIntoView({behavior: 'smooth'});
}

async function handleDeleteAthlete(id) {
    if (!confirm("Sei sicuro di voler rimuovere questo atleta dalla squadra?")) return;
    deleteAthleteApi(id);
}

function getSeconds(id) {
    const m = parseInt(document.getElementById('m'+id).value) || 0;
    const s = parseInt(document.getElementById('s'+id).value) || 0;
    const c = parseInt(document.getElementById('c'+id).value) || 0;
    return (m * 60) + s + (c / 100);
}

function loadAthleteData(d1, t1, d2, t2) {
    document.getElementById('d1').value = d1;
    document.getElementById('d2').value = d2;
    
    const setTime = (id, totalSeconds) => {
        let m = Math.floor(totalSeconds / 60);
        let s = Math.floor(totalSeconds % 60);
        let c = Math.round((totalSeconds - Math.floor(totalSeconds)) * 100);
        if (c >= 100) { s++; c = 0; }
        document.getElementById('m'+id).value = m > 0 ? m : '';
        document.getElementById('s'+id).value = s;
        document.getElementById('c'+id).value = c;
    };
    
    setTime('1', t1);
    setTime('2', t2);
    
    calculate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}