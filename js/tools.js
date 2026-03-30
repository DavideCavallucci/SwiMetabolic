// ==========================================
// LOGICA DI NAVIGAZIONE E SCENARI
// ==========================================
function proteggiOggettiBase() {
    canvas.getObjects().forEach(obj => { obj.isBase = true; });
}

function muoviIndicatore(elemento) {
    const indicatore = document.getElementById('navIndicator');
    if(!indicatore || window.innerWidth <= 900) {
        if(indicatore) indicatore.style.width = '0px'; 
        return; 
    }
    indicatore.style.width = elemento.offsetWidth + 'px';
    indicatore.style.left = elemento.offsetLeft + 'px';
}

function impostaVista(vista) {
    vistaAttuale = vista;
    cronologiaStati = []; 
    
    document.getElementById('btnViewHalf').classList.toggle('active-tool', vista === 'meta');
    document.getElementById('btnViewFull').classList.toggle('active-tool', vista === 'intero');
    
    const tabsContainer = document.querySelector('.tabs-container');
    if(tabsContainer) tabsContainer.style.display = ''; 

    // Rimuoviamo le linee del campo precedente e i disegni utente, MA SALVIAMO I GIOCATORI
    const oggetti = canvas.getObjects();
    for (let i = oggetti.length - 1; i >= 0; i--) {
        if (oggetti[i].isCampo || oggetti[i].isUserObject) {
            canvas.remove(oggetti[i]);
        }
    }

    if (scenarioCorrente === 'intero_sprint') {
        scenarioCorrente = 'pressing'; 
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const firstBtn = document.querySelector('.tab-btn');
        if (firstBtn) {
            firstBtn.classList.add('active'); 
            muoviIndicatore(firstBtn);
        }
    }

    // Ridisegniamo il nuovo campo e riposizioniamo i giocatori
    if (vista === 'intero') {
        if(typeof disegnaCampoIntero === "function") disegnaCampoIntero(); 
        const nomeSchemaIntero = 'intero_' + scenarioCorrente;
        if (posizioni[nomeSchemaIntero]) posizioni[nomeSchemaIntero]();
        else posizioni['intero_pressing'](); 
    } else {
        if(typeof disegnaCampo === "function") disegnaCampo();
        if (posizioni[scenarioCorrente]) posizioni[scenarioCorrente]();
    }
    
    proteggiOggettiBase();
    impostaModalita('muovi');
    setTimeout(adattaSchermo, 50); 
    salvaStoria(); 
}

function cambiaScenario(tipo, btn) {
    scenarioCorrente = tipo;
    
    const oggetti = canvas.getObjects();
    for (let i = oggetti.length - 1; i >= 0; i--) {
        if (oggetti[i].isUserObject) {
            canvas.remove(oggetti[i]);
        }
    }

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) {
        btn.classList.add('active');
        muoviIndicatore(btn);
    }
    
    if (vistaAttuale === 'intero') {
        const nomeSchemaIntero = 'intero_' + tipo;
        if (posizioni[nomeSchemaIntero]) posizioni[nomeSchemaIntero]();
    } else {
        if (posizioni[tipo]) posizioni[tipo]();
    }
    
    canvas.renderAll();
    salvaStoria();
}

// ==========================================
// STRUMENTI E DISEGNO LIBERO
// ==========================================
function impostaModalita(mode) {
    modalitaAttuale = mode;
    canvas.isDrawingMode = (mode === 'disegna');
    
    const bottoniStrumenti = ['btnMuovi', 'btnDisegna', 'btnFreccia', 'btnCurva'];
    bottoniStrumenti.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('active-tool');
    });

    const activeId = 'btn' + mode.charAt(0).toUpperCase() + mode.slice(1);
    const btn = document.getElementById(activeId);
    if(btn) btn.classList.add('active-tool');

    if (mode === 'disegna') {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 4;
        canvas.freeDrawingBrush.color = coloreAttuale;
        canvas.freeDrawingBrush.strokeDashArray = usaTratteggio ? [12, 12] : null;
    }
    
    const sidebar = document.getElementById('mainSidebar');
    if(sidebar) sidebar.classList.toggle('is-drawing', mode === 'disegna' || mode === 'freccia' || mode === 'curva');
    
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'pointer';

    if (mode !== 'curva') {
        const temps = canvas.getObjects().filter(obj => obj.isTemp);
        canvas.remove(...temps);
        curvePoints = [];
    }
}

function cambiaColore(hexColor, elementoHtml) {
    if (modalitaAttuale === 'muovi') return; 
    coloreAttuale = hexColor;
    if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.color = coloreAttuale;
    document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active-color'));
    if(elementoHtml) elementoHtml.classList.add('active-color');
}

function impostaStileLinea(isDashed) {
    usaTratteggio = isDashed;
    const btnSolid = document.getElementById('btnSolid');
    const btnDashed = document.getElementById('btnDashed');
    if(btnSolid) btnSolid.classList.toggle('active-tool', !isDashed);
    if(btnDashed) btnDashed.classList.toggle('active-tool', isDashed);
    if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.strokeDashArray = isDashed ? [12, 12] : null; 
}

// ==========================================
// CANCELLAZIONE TRAMITE TASTIERA
// ==========================================
window.addEventListener('keydown', function(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
        
        const activeObj = canvas.getActiveObject();
        if (activeObj && activeObj.isUserObject) {
            canvas.remove(activeObj);
            canvas.discardActiveObject();
            canvas.renderAll();
            salvaStoria();
        }
    }
});

// ==========================================
// DISEGNO: FRECCE RETTE E CURVE
// ==========================================
let isDrawingArrow = false;
let arrowLine, arrowHead;
let curvePoints = []; 

canvas.on('mouse:down', function(options) {
    // GESTIONE FRECCIA RETTA
    if (modalitaAttuale === 'freccia') {
        isDrawingArrow = true;
        const pointer = canvas.getPointer(options.e);
        
        arrowLine = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            strokeWidth: 4, fill: coloreAttuale, stroke: coloreAttuale,
            originX: 'center', originY: 'center', strokeDashArray: usaTratteggio ? [12, 12] : null,
            selectable: false, evented: false
        });
        
        arrowHead = new fabric.Triangle({
            width: 16, height: 16, fill: coloreAttuale, left: pointer.x, top: pointer.y,
            originX: 'center', originY: 'center', selectable: false, evented: false, angle: 90
        });
        
        canvas.add(arrowLine, arrowHead);
        return;
    }

    // GESTIONE FRECCIA CURVA
    if (modalitaAttuale === 'curva') {
        const pointer = canvas.getPointer(options.e);
        curvePoints.push({ x: pointer.x, y: pointer.y });

        if (curvePoints.length === 3) {
            disegnaFrecciaCurva(curvePoints[0], curvePoints[1], curvePoints[2]);
            curvePoints = []; 
        } else {
            const dot = new fabric.Circle({
                radius: 4, fill: coloreAttuale, left: pointer.x, top: pointer.y,
                originX: 'center', originY: 'center', selectable: false, isTemp: true
            });
            canvas.add(dot);
        }
        return;
    }
});

canvas.on('mouse:move', function(options) {
    if (!isDrawingArrow || modalitaAttuale !== 'freccia') return;
    const pointer = canvas.getPointer(options.e);
    arrowLine.set({ x2: pointer.x, y2: pointer.y });
    arrowHead.set({ left: pointer.x, top: pointer.y });
    
    const dx = pointer.x - arrowLine.x1;
    const dy = pointer.y - arrowLine.y1;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    arrowHead.set({ angle: angle + 90 });
    canvas.renderAll();
});

canvas.on('mouse:up', function() {
    if (modalitaAttuale !== 'freccia' || !isDrawingArrow) return;
    isDrawingArrow = false;
    
    const dx = arrowLine.x2 - arrowLine.x1;
    const dy = arrowLine.y2 - arrowLine.y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 15) {
        canvas.remove(arrowLine, arrowHead);
        canvas.renderAll();
        return; 
    }
    
    arrowLine.setCoords(); arrowHead.setCoords();
    const arrowGroup = new fabric.Group([arrowLine, arrowHead], { selectable: true, evented: true, hoverCursor: 'pointer', isUserObject: true });
    canvas.remove(arrowLine, arrowHead);
    canvas.add(arrowGroup);
    canvas.renderAll();
    
    salvaStoria(); 
});

function disegnaFrecciaCurva(p1, p2, p3) {
    const temps = canvas.getObjects().filter(obj => obj.isTemp);
    canvas.remove(...temps);

    const pathData = `M ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    const curva = new fabric.Path(pathData, {
        fill: '', stroke: coloreAttuale, strokeWidth: 4,
        strokeDashArray: usaTratteggio ? [12, 12] : null,
        selectable: false, evented: false
    });

    const angle = Math.atan2(p3.y - p2.y, p3.x - p2.x) * 180 / Math.PI;
    const punta = new fabric.Triangle({
        width: 16, height: 16, fill: coloreAttuale, left: p3.x, top: p3.y,
        originX: 'center', originY: 'center', angle: angle + 90,
        selectable: false, evented: false
    });

    const gruppoCurva = new fabric.Group([curva, punta], {
        isUserObject: true, selectable: true, hoverCursor: 'pointer'
    });

    canvas.add(gruppoCurva);
    canvas.renderAll();
    salvaStoria();
}

// ==========================================
// LIMITI DEL CAMPO E OGGETTI
// ==========================================
canvas.on('object:moving', function(e) {
    const obj = e.target;
    const halfWidth = (obj.width * (obj.scaleX || 1)) / 2;
    const halfHeight = (obj.height * (obj.scaleY || 1)) / 2;
    if (obj.left < halfWidth) obj.left = halfWidth;
    else if (obj.left > canvasWidth - halfWidth) obj.left = canvasWidth - halfWidth;
    if (obj.top < halfHeight) obj.top = halfHeight;
    else if (obj.top > canvasHeight - halfHeight) obj.top = canvasHeight - halfHeight;
});

// ==========================================
// ROSTER E RINOMINAZIONE AL VOLO (Con Memoria)
// ==========================================
canvas.on('mouse:dblclick', function(options) {
    const target = options.target;
    if (target && target.isBase) {
        
        const badgeGroup = target.getObjects().find(obj => obj.name === 'badgeNome');
        if(!badgeGroup) return; 
        
        const badgeBg = badgeGroup.item(0);
        const badgeTxt = badgeGroup.item(1);

        const nuovoNome = prompt("Inserisci il cognome del giocatore:", badgeTxt.text);
        
        if (nuovoNome !== null) {
            const nomePulito = nuovoNome.trim().toUpperCase();
            
            if (nomePulito === "") {
                badgeGroup.set({ visible: false });
                delete rosterMemoria[target.id]; 
            } else {
                badgeTxt.set({ text: nomePulito });
                
                const paddingH = 12;
                badgeBg.set({ width: badgeTxt.width + paddingH });
                
                badgeGroup.set({ visible: true });
                badgeGroup.addWithUpdate(); 
                
                rosterMemoria[target.id] = nomePulito; 
            }

            target.addWithUpdate(); 
            canvas.renderAll();
            salvaStoria();
        }
    }
});

// ==========================================
// ELEMENTI EXTRA
// ==========================================
function aggiungiTesto() {
    const testo = new fabric.IText('Scrivi...', {
        left: centerW, top: centerH, fontFamily: 'Montserrat', fontSize: 24, fontWeight: '800', fill: '#0f172a',
        originX: 'center', originY: 'center', hasControls: true, hasBorders: true, transparentCorners: false, cornerColor: '#38bdf8', isUserObject: true
    });
    canvas.add(testo); canvas.setActiveObject(testo); testo.enterEditing(); testo.selectAll(); 
    impostaModalita('muovi');
    salvaStoria();
}

function aggiungiCono() {
    const cono = new fabric.Triangle({
        width: 26, height: 34, fill: '#f39c12', stroke: '#d68910', strokeWidth: 2,
        left: centerW, top: centerH, originX: 'center', originY: 'center', hasControls: true, hasBorders: true, isUserObject: true 
    });
    canvas.add(cono); 
    impostaModalita('muovi');
    salvaStoria();
}

function aggiungiPalla() { 
    generaPalla(centerW, centerH, true); 
    impostaModalita('muovi'); 
    salvaStoria();
}

function aggiungiBersaglio() {
    const line1 = new fabric.Line([-15, 0, 15, 0], { stroke: '#ef4444', strokeWidth: 3, originX: 'center', originY: 'center' });
    const line2 = new fabric.Line([0, -15, 0, 15], { stroke: '#ef4444', strokeWidth: 3, originX: 'center', originY: 'center' });
    const circle = new fabric.Circle({ radius: 10, fill: 'transparent', stroke: '#ef4444', strokeWidth: 2, originX: 'center', originY: 'center' });
    
    const targetGroup = new fabric.Group([line1, line2, circle], { 
        left: centerW, top: centerH, originX: 'center', originY: 'center', 
        hasControls: true, hasBorders: true, isUserObject: true 
    });
    
    canvas.add(targetGroup);
    impostaModalita('muovi');
    salvaStoria();
}