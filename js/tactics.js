// ==========================================
// SCHIERAMENTI TATTICI
// ==========================================
const posizioni = {
    // --- META' CAMPO ---
    'pressing': () => {
        creaGiocatore(centerW, goalLine + 12, 'P', true); 
        [
            [0, dist2m + 20, '6'], [230, dist2m + 40, '1'], [-230, dist2m + 40, '5'], 
            [140, dist5m + 20, '2'], [0, dist6m + 30, '3'], [-140, dist5m + 20, '4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [0, dist2m + 55, 'M'], [190, dist2m + 10, '-1'], [-190, dist2m + 10, '-5'], 
            [110, dist5m - 20, '-2'], [0, dist6m - 10, '-3'], [-110, dist5m - 20, '-4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaPalla(centerW + 40, goalLine + dist6m + 50);
    },
    'zona_totale': () => {
        creaGiocatore(centerW, goalLine + 12, 'P', true);
        [
            [0, dist2m + 20, '6'], [230, dist2m + 40, '1'], [-230, dist2m + 40, '5'], 
            [140, dist5m + 20, '2'], [0, dist6m + 30, '3'], [-140, dist5m + 20, '4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [0, dist2m - 15, 'M'], [120, dist2m + 10, '-1'], [-120, dist2m + 10, '-5'], 
            [60, dist5m - 50, '-2'], [0, dist5m, '-3'], [-60, dist5m - 50, '-4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaPalla(centerW + 40, goalLine + dist6m + 50);
    },
    'zona_m': () => {
        creaGiocatore(centerW, goalLine + 12, 'P', true);
        [
            [0, dist2m + 20, '6'], [230, dist2m + 40, '1'], [-230, dist2m + 40, '5'], 
            [140, dist5m + 20, '2'], [0, dist6m + 30, '3'], [-140, dist5m + 20, '4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [0, dist2m - 15, 'M'], [190, dist2m + 30, '-1'], [-190, dist2m + 30, '-5'], 
            [65, dist5m + 45, '-2'], [0, dist5m - 80, '-3'], [-65, dist5m + 45, '-4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaPalla(centerW + 40, goalLine + dist6m + 50);
    },
    'zona_1_2': () => { 
        creaGiocatore(centerW, goalLine + 12, 'P', true);
        [
            [0, dist2m + 20, '6'], [230, dist2m + 40, '1'], [-230, dist2m + 40, '5'], 
            [140, dist5m + 20, '2'], [0, dist6m + 30, '3'], [-140, dist5m + 20, '4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [-35, dist2m + 45, 'M'],   
            [100, dist2m + 20, '-1'],  
            [60, dist5m - 40, '-2'],   
            [-190, dist2m + 10, '-5'], 
            [0, dist6m - 10, '-3'],    
            [-110, dist5m - 20, '-4']  
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaPalla(centerW + 40, goalLine + dist6m + 50);
    },
    'uomo_piu_4_2': () => { 
        creaGiocatore(centerW, goalLine + 12, 'P', true);
        [
            [190, dist2m + 10, '1'], [70, dist2m + 10, '6'], [-70, dist2m + 10, '5'], 
            [-190, dist2m + 10, '4'], [100, dist5m + 20, '2'], [-100, dist5m + 20, '3']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [95, dist2m - 25, '-1'], [10, dist2m, '-2'], [-95, dist2m - 25, '-5'], 
            [60, dist5m - 30, '-3'], [-60, dist5m - 70, '-4']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaGiocatore(canvasWidth - 65, 60, 'M', true); 
        creaPalla(centerW + 100, goalLine + dist5m + 60);
    },
    'uomo_piu_3_3': () => { 
        creaGiocatore(centerW, goalLine + 12, 'P', true);
        [
            [180, dist2m + 10, '1'], [0, dist2m + 10, '6'], [-180, dist2m + 10, '5'], 
            [130, dist5m + 10, '2'], [0, dist5m + 20, '3'], [-130, dist5m + 10, '4']  
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [90, dist2m - 15, '-1'], [-90, dist2m - 15, '-5'], 
            [65, dist5m - 30, '-2'], [-65, dist5m - 30, '-4'], 
            [0, dist2m + 45, '-3'] 
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaGiocatore(canvasWidth - 65, 60, 'M', true); 
        creaPalla(centerW + 30, goalLine + dist5m + 50);
    },
    'controfuga': () => {
        creaGiocatore(centerW, goalLine + 12, 'P', true); 
        [
            [160, dist5m - 60, '2'], [-160, dist5m - 60, '4'], [0, dist6m + 60, '3']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], false));
        [
            [70, dist2m + 150, '-1'], [-90, dist2m + 70, '-2']
        ].forEach(p => creaGiocatore(centerW + p[0], goalLine + p[1], p[2], true));
        creaPalla(centerW + 30, goalLine + dist6m + 80);

        const panchinaY = goalLine + 420; 
        /* FIX: Aggiunto il giocatore '1' affianco al '5' e '6' */
        [ [-420, '1'], [-350, '5'], [-280, '6'] ].forEach(p => creaGiocatore(centerW + p[0], panchinaY, p[1], false));
        [ [140, '-3'], [210, '-4'], [280, '-5'], [350, 'M'] ].forEach(p => creaGiocatore(centerW + p[0], panchinaY, p[1], true));
    },
    'libera': () => {
        const colLeft = -350; const colRight = 350; 
        [1, 2, 3, 4, 5, 6].forEach((n, i) => creaGiocatore(centerW + colLeft, goalLine + 60 + (i * 55), n.toString(), false));
        [-1, -2, -3, -4, -5, 'M'].forEach((n, i) => creaGiocatore(centerW + colRight, goalLine + 60 + (i * 55), n.toString(), true));
        creaGiocatore(centerW + colRight, goalLine + 400, 'P', true); 
        creaPalla(centerW + colLeft, goalLine + 400);
    },

    // --- CAMPO INTERO (COORDINATE CORRETTE & SPECCHIATE) ---
    'intero_pressing': () => {
        creaGiocatore(gX + 12, centerH, 'P', true);
        [
            [f_d2m + 20, 0, '6'], [f_d2m + 40, 230, '1'], [f_d2m + 40, -230, '5'], 
            [f_d5m + 20, 140, '2'], [f_d6m + 30, 0, '3'], [f_d5m + 20, -140, '4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m + 55, 0, 'M'], [f_d2m + 10, 190, '-1'], [f_d2m + 10, -190, '-5'], 
            [f_d5m - 20, 110, '-2'], [f_d6m - 10, 0, '-3'], [f_d5m - 20, -110, '-4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaPalla(gX + f_d6m + 50, centerH - 40);
    },
    'intero_zona_totale': () => {
        creaGiocatore(gX + 12, centerH, 'P', true);
        [
            [f_d2m + 20, 0, '6'], [f_d2m + 40, 230, '1'], [f_d2m + 40, -230, '5'], 
            [f_d5m + 20, 140, '2'], [f_d6m + 30, 0, '3'], [f_d5m + 20, -140, '4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m - 15, 0, 'M'], [f_d2m + 10, 120, '-1'], [f_d2m + 10, -120, '-5'], 
            [f_d5m - 50, 60, '-2'], [f_d5m, 0, '-3'], [f_d5m - 50, -60, '-4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaPalla(gX + f_d6m + 50, centerH - 40);
    },
    'intero_zona_m': () => {
        creaGiocatore(gX + 12, centerH, 'P', true);
        [
            [f_d2m + 20, 0, '6'], [f_d2m + 40, 230, '1'], [f_d2m + 40, -230, '5'], 
            [f_d5m + 20, 140, '2'], [f_d6m + 30, 0, '3'], [f_d5m + 20, -140, '4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m - 15, 0, 'M'], [f_d2m + 30, 190, '-1'], [f_d2m + 30, -190, '-5'], 
            [f_d5m + 45, 65, '-2'], [f_d5m - 50, 0, '-3'], [f_d5m + 45, -65, '-4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaPalla(gX + f_d6m + 50, centerH - 40);
    },
    'intero_zona_1_2': () => { 
        creaGiocatore(gX + 12, centerH, 'P', true);
        [
            [f_d2m + 20, 0, '6'], [f_d2m + 40, 230, '1'], [f_d2m + 40, -230, '5'], 
            [f_d5m + 20, 140, '2'], [f_d6m + 30, 0, '3'], [f_d5m + 20, -140, '4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m + 45, -35, 'M'],    
            [f_d2m + 20, 100, '-1'],   
            [f_d5m - 40, 60, '-2'],    
            [f_d2m + 10, -190, '-5'],  
            [f_d6m - 10, 0, '-3'],     
            [f_d5m - 20, -110, '-4']   
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaPalla(gX + f_d6m + 50, centerH - 40);
    },
    'intero_uomo_piu_4_2': () => { 
        creaGiocatore(gX + 12, centerH, 'P', true);
        [
            [f_d2m + 10, 190, '1'], [f_d2m + 10, 70, '6'], [f_d2m + 10, -70, '5'], 
            [f_d2m + 10, -190, '4'], [f_d5m + 20, 100, '2'], [f_d5m + 20, -100, '3']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m - 25, 95, '-1'], [f_d2m, 10, '-2'], [f_d2m - 25, -95, '-5'], 
            [f_d5m - 30, 60, '-3'], [f_d5m - 70, -60, '-4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaGiocatore(canvasWidth - 950, centerH + 232.5, 'M', true); 
        creaPalla(gX + f_d5m + 60, centerH - 100);
    },
    'intero_uomo_piu_3_3': () => { 
        creaGiocatore(gX + 12, centerH, 'P', true);
        [
            [f_d2m + 10, 180, '1'], [f_d2m + 10, 0, '6'], [f_d2m + 10, -180, '5'], 
            [f_d5m + 10, 130, '2'], [f_d5m + 40, 0, '3'], [f_d5m + 10, -130, '4']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m - 15, 90, '-1'], [f_d2m - 15, -90, '-5'], 
            [f_d5m - 30, 65, '-2'], [f_d5m - 30, -65, '-4'], 
            [f_d2m + 45, 0, '-3'] 
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaGiocatore(canvasWidth - 950, centerH + 232.5, 'M', true); 
        creaPalla(gX + f_d5m + 70, centerH - 30);
    },
    'intero_controfuga': () => {
        creaGiocatore(gX + 12, centerH, 'P', true); 
        [
            [f_d5m - 60, 160, '2'], [f_d5m - 60, -160, '4'], [f_d6m + 60, 0, '3']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], false));
        [
            [f_d2m + 150, 70, '-1'], [f_d2m + 70, -90, '-2']
        ].forEach(p => creaGiocatore(gX + p[0], centerH - p[1], p[2], true));
        creaPalla(gX + f_d6m + 80, centerH - 30);

        /* FIX: Aggiunto il giocatore '1' affianco al '5' e '6' */
        [ [340, -230, '1'], [400, -230, '5'], [460, -230, '6'] ].forEach(p => creaGiocatore(p[0], centerH - p[1], p[2], false));
        [ [540, -230, '-3'], [600, -230, '-4'], [660, -230, '-5'], [720, -230, 'M'] ].forEach(p => creaGiocatore(p[0], centerH - p[1], p[2], true));
    },
    'intero_libera': () => {
        creaGiocatore(canvasWidth - 45, centerH, 'P', true);
        [1, 2, 3, 4, 5, 6].forEach((n, i) => creaGiocatore(80, 75 + i * 80, n.toString(), false));
        [-1, -2, -3, -4, -5, 'M'].forEach((n, i) => creaGiocatore(canvasWidth - 80, 75 + i * 80, n.toString(), true));
        creaPalla(centerW, centerH);
    }
};