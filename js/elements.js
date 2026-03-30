// ==========================================
// CREAZIONE OGGETTI BASE
// ==========================================
function creaGiocatore(x, y, label, isDark, nomeGiocatore = "") {
    const stringLabel = label.toString();
    const isGoalie = (stringLabel === '13' || stringLabel === 'P');
    
    // 1. ID UNIVOCO: Fondamentale per ritrovare la pedina e animarla
    const playerID = (isDark ? "DIF_" : "ATT_") + stringLabel;

    // 2. LOGICA COLORI (Definiamo le variabili che mancavano)
    let capBg = isDark ? '#0c4a6e' : '#ffffff'; 
    let capTxt = isDark ? '#ffffff' : '#0c4a6e';
    let capBorder = isDark ? '#ffffff' : '#0c4a6e'; 

    // --- NUOVO: CONTROLLA LA MEMORIA ---
    if (rosterMemoria[playerID]) {
        nomeGiocatore = rosterMemoria[playerID]; // Forza il nome salvato in memoria
    }
    
    if (isGoalie) { 
        capBg = '#ef4444'; 
        capTxt = '#ffffff'; 
        capBorder = isDark ? '#0c4a6e' : '#ffffff'; 
    }

    // 3. CONTROLLO ESISTENZA: Se esiste, lo animiamo e usciamo
    const esistente = canvas.getObjects().find(obj => obj.id === playerID);
    if (esistente) {
        esistente.animate({ left: x, top: y }, {
            duration: 600,
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease.easeInOutCubic
        });
        
        // Aggiorniamo il badge se presente
        const badgeGroup = esistente.getObjects().find(obj => obj.name === 'badgeNome');
        if (badgeGroup) {
            const badgeTxt = badgeGroup.item(1);
            if (nomeGiocatore && badgeTxt.text !== nomeGiocatore.toUpperCase()) {
                badgeTxt.set({ text: nomeGiocatore.toUpperCase() });
                badgeGroup.item(0).set({ width: badgeTxt.width + 12 });
                badgeGroup.set({ visible: true });
                badgeGroup.addWithUpdate();
            }
        }
        return; 
    }

    // 4. CREAZIONE NUOVA PEDINA (Se non esiste)
    
    // Calottina
    const cerchio = new fabric.Circle({ 
        radius: 24, fill: capBg, stroke: capBorder, strokeWidth: 2, 
        originX: 'center', originY: 'center' 
    });

    // Numero
    const testoNumero = new fabric.Text(stringLabel, { 
        fontFamily: 'Montserrat', fontSize: 26, fontWeight: '900', 
        fill: capTxt, originX: 'center', originY: 'center' 
    });

    // Badge Nome
    const paddingH = 12;
    const paddingV = 4;
    const badgeTxt = new fabric.Text(nomeGiocatore.toUpperCase(), {
        fontFamily: 'Montserrat', fontSize: 10, fontWeight: '800',
        fill: isDark ? '#0c4a6e' : '#ffffff',
        originX: 'center', originY: 'center'
    });

    const badgeBg = new fabric.Rect({
        fill: isDark ? '#ffffff' : '#0c4a6e',
        rx: 8, ry: 8,
        width: badgeTxt.width + paddingH,
        height: badgeTxt.height + paddingV,
        originX: 'center', originY: 'center'
    });

    const badgeGroup = new fabric.Group([badgeBg, badgeTxt], {
        top: 28,
        originX: 'center',
        visible: nomeGiocatore.length > 0,
        name: 'badgeNome'
    });

    // Gruppo Finale
    const playerGroup = new fabric.Group([cerchio, testoNumero, badgeGroup], { 
        left: x, top: y, originX: 'center', originY: 'center', 
        hasControls: false, hasBorders: false, hoverCursor: 'pointer' 
    });

    // Proprietà Identificative
    playerGroup.id = playerID;
    playerGroup.isBase = true; 
    
    canvas.add(playerGroup);
    canvas.renderAll();
}

function generaPalla(x, y, isUserObj = false) {
    const pallaID = isUserObj ? "palla_user_" + Date.now() : "palla_tattica";
    
    // Animazione fluida se la palla tattica esiste già
    const esistente = canvas.getObjects().find(obj => obj.id === "palla_tattica");
    if (esistente && !isUserObj) {
        esistente.animate({ left: x, top: y }, {
            duration: 600,
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease.easeInOutCubic
        });
        return;
    }
    
    const r = 15; const strokeW = 1.2; const gialloPalla = '#FFD700'; 
    const base = new fabric.Circle({ radius: r, fill: gialloPalla, stroke: '#222', strokeWidth: 1.5, originX: 'center', originY: 'center' });
    const sTop = new fabric.Path('M -15 0 A 15 8 0 0 1 15 0 Z', { stroke: '#222', strokeWidth: strokeW, fill: gialloPalla, originX: 'center', originY: 'center', top: -4 });
    const sBot = new fabric.Path('M -15 0 A 15 8 0 0 0 15 0 Z', { stroke: '#222', strokeWidth: strokeW, fill: gialloPalla, originX: 'center', originY: 'center', top: 4 });
    const sLeft = new fabric.Path('M 0 -15 A 8 15 0 0 0 0 15 Z', { stroke: '#222', strokeWidth: strokeW, fill: gialloPalla, originX: 'center', originY: 'center', left: -4 });
    const sRight = new fabric.Path('M 0 -15 A 8 15 0 0 1 0 15 Z', { stroke: '#222', strokeWidth: strokeW, fill: gialloPalla, originX: 'center', originY: 'center', left: 4 });

    const palla = new fabric.Group([base, sTop, sBot, sLeft, sRight], { 
        left: x, top: y, originX: 'center', originY: 'center', 
        hasControls: isUserObj, hasBorders: isUserObj, hoverCursor: 'pointer', isUserObject: isUserObj 
    });
    
    palla.id = pallaID; 
    
    // FONDAMENTALE PER IL PLAYBOOK: 
    // Diciamo che la palla tattica fa parte degli elementi "base" da salvare nei frame
    if (!isUserObj) {
        palla.isBase = true;
    }
    
    canvas.add(palla);
}

function creaPalla(x, y) {
    generaPalla(x, y, false);
}