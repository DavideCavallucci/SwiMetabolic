// ==========================================
// DISEGNO DEL CAMPO (Metà e Intero)
// ==========================================

function disegnaCampo() {
    canvas.backgroundColor = '#bae6fd'; 

    // Se il campo a metà esiste già, non facciamo nulla
    if (canvas.getObjects().some(obj => obj.isCampo && obj.vista === 'meta')) return;

    // FUNZIONE MAGICA: Aggiunge l'oggetto e gli mette l'etichetta "isCampo"
    const addC = (obj) => {
        obj.isCampo = true;
        obj.vista = 'meta';
        canvas.add(obj);
    };

    const sideW = 15; 
    const giallo = '#f3ca12';

    const creaFascia = (y, altezza, colore) => {
        addC(new fabric.Rect({ left: 0, top: y, width: sideW, height: altezza, fill: colore, selectable: false, evented: false }));
        addC(new fabric.Rect({ left: canvasWidth - sideW, top: y, width: sideW, height: altezza, fill: colore, selectable: false, evented: false }));
    };

    const creaLineaFondo = (x1, x2, colore) => {
        const startX = Math.max(sideW, x1);
        const endX = Math.min(canvasWidth - sideW, x2);
        addC(new fabric.Line([startX, goalLine, endX, goalLine], { stroke: colore, strokeWidth: 4, selectable: false, evented: false }));
    };

    const creaMarkerOrizzontale = (yPos, colore) => {
        const mH = 3; 
        const params = { width: sideW, height: mH, fill: colore, selectable: false, evented: false, top: yPos - (mH / 2) };
        addC(new fabric.Rect({ left: 0, ...params }));
        addC(new fabric.Rect({ left: canvasWidth - sideW, ...params }));
    };

    const lineaTratteggiata = (y, col) => addC(new fabric.Line([sideW, y, canvasWidth - sideW, y], { stroke: col, strokeWidth: 2.5, strokeDashArray: [10, 6], selectable: false, evented: false }));

    creaFascia(0, goalLine, '#38bdf8'); 
    creaFascia(goalLine, dist2m, '#ef4444'); 
    creaFascia(goalLine + dist2m, dist5m - dist2m, giallo); 
    creaFascia(goalLine + dist5m, dist6m - dist5m, giallo); 
    creaFascia(goalLine + dist6m, canvasHeight - (goalLine + dist6m), '#10b981'); 

    const paloSinistro = centerW - 75;
    const paloDestro = centerW + 75;
    
    creaLineaFondo(0, paloSinistro - dist2m, 'white'); 
    creaLineaFondo(paloSinistro - dist2m, paloSinistro, '#ef4444'); 
    creaLineaFondo(paloSinistro, paloDestro, 'white'); 
    creaLineaFondo(paloDestro, paloDestro + dist2m, '#ef4444'); 
    creaLineaFondo(paloDestro + dist2m, canvasWidth, 'white'); 

    creaMarkerOrizzontale(goalLine, 'white');            
    creaMarkerOrizzontale(goalLine + dist2m, '#ef4444'); 
    creaMarkerOrizzontale(goalLine + dist5m, '#ef4444'); 
    creaMarkerOrizzontale(goalLine + dist6m, giallo); 

    const portaProfondita = 45;
    const portaCoords = [
        { x: paloSinistro, y: goalLine }, { x: paloSinistro, y: goalLine - portaProfondita },
        { x: paloDestro, y: goalLine - portaProfondita }, { x: paloDestro, y: goalLine }
    ];
    
    addC(new fabric.Polyline(portaCoords, { stroke: '#0f172a', strokeWidth: 8, fill: 'transparent', strokeLineJoin: 'round', strokeLineCap: 'round', selectable: false, evented: false }));
    addC(new fabric.Polyline(portaCoords, { stroke: 'white', strokeWidth: 5, fill: 'transparent', strokeLineJoin: 'round', strokeLineCap: 'round', selectable: false, evented: false }));

    lineaTratteggiata(goalLine + dist2m, '#ef4444'); 
    lineaTratteggiata(goalLine + dist5m, '#ef4444'); 
    lineaTratteggiata(goalLine + dist6m, giallo); 

    const labelStyle = { fontSize: 16, fontFamily: 'Montserrat', fontWeight: '800', selectable: false, evented: false, originY: 'bottom' };
    addC(new fabric.Text("2m", { left: 22, top: goalLine + dist2m - 5, fill: '#ef4444', ...labelStyle }));
    addC(new fabric.Text("5m", { left: 22, top: goalLine + dist5m - 5, fill: '#ef4444', ...labelStyle })); 
    addC(new fabric.Text("6m", { left: 22, top: goalLine + dist6m - 5, fill: giallo, ...labelStyle }));

    const offW = 160; 
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 20; patternCanvas.height = 20;
    const pCtx = patternCanvas.getContext('2d');
    pCtx.fillStyle = 'rgba(239, 68, 68, 0.1)'; pCtx.fillRect(0, 0, 20, 20);
    pCtx.strokeStyle = 'rgba(239, 68, 68, 0.3)'; pCtx.lineWidth = 2;
    pCtx.beginPath(); pCtx.moveTo(0, 20); pCtx.lineTo(20, 0); pCtx.stroke();
    const hatchingPattern = new fabric.Pattern({ source: patternCanvas, repeat: 'repeat' });

    addC(new fabric.Rect({ left: centerW - offW, top: goalLine, width: offW * 2, height: dist2m, fill: hatchingPattern, selectable: false, evented: false }));
    const offS = { stroke: '#ef4444', strokeWidth: 2.5, strokeDashArray: [8, 6], selectable: false, evented: false };
    addC(new fabric.Line([centerW - offW, goalLine, centerW - offW, goalLine + dist2m], offS));
    addC(new fabric.Line([centerW + offW, goalLine, centerW + offW, goalLine + dist2m], offS));

    const pozzettoW = 100; const pozzettoH = 70;
    const pX_dx = canvasWidth - sideW; const pX_sx = canvasWidth - sideW - pozzettoW;
    const pY_top = goalLine - pozzettoH; const pY_bottom = goalLine; 
    const pozzettoCoords = [{ x: pX_dx, y: pY_bottom }, { x: pX_sx, y: pY_bottom }, { x: pX_sx, y: pY_top }, { x: pX_dx, y: pY_top }];

    addC(new fabric.Polyline(pozzettoCoords, { stroke: '#ef4444', strokeWidth: 2.5, strokeDashArray: [8, 6], fill: 'rgba(239, 68, 68, 0.15)', strokeLineJoin: 'round', selectable: false, evented: false }));
    addC(new fabric.Text("POZZETTO", { left: pX_sx + (pozzettoW / 2), top: pY_top + (pozzettoH / 2), fontSize: 12, fontFamily: 'Montserrat', fontWeight: '800', fill: '#ef4444', originX: 'center', originY: 'center', selectable: false, evented: false }));

    // TIRA SU LE PEDINE: Siccome abbiamo appena disegnato il campo "sopra" tutto,
    // diciamo alle pedine di tornare in prima fila.
    canvas.getObjects().forEach(obj => {
        if (obj.isBase || obj.isUserObject) {
            canvas.bringToFront(obj);
        }
    });
}

function disegnaCampoIntero() {
    canvas.backgroundColor = '#bae6fd'; 

    // Se il campo intero esiste già, non facciamo nulla
    if (canvas.getObjects().some(obj => obj.isCampo && obj.vista === 'intero')) return;

    // FUNZIONE MAGICA
    const addC = (obj) => {
        obj.isCampo = true;
        obj.vista = 'intero';
        canvas.add(obj);
    };

    const sideH = 15; 
    const giallo = '#f3ca12';

    const drawFasciaX = (x, width, color) => {
        addC(new fabric.Rect({ left: x, top: 0, width: width, height: sideH, fill: color, selectable: false, evented: false }));
        addC(new fabric.Rect({ left: x, top: canvasHeight - sideH, width: width, height: sideH, fill: color, selectable: false, evented: false }));
    };

    drawFasciaX(0, gX, '#38bdf8');
    drawFasciaX(gX, f_d2m, '#ef4444');
    drawFasciaX(gX + f_d2m, f_d5m - f_d2m, giallo);
    drawFasciaX(gX + f_d5m, f_d6m - f_d5m, giallo);
    drawFasciaX(gX + f_d6m, centerW - (gX + f_d6m), '#10b981');
    drawFasciaX(centerW, centerW - (gX + f_d6m), '#10b981');
    drawFasciaX(canvasWidth - gX - f_d6m, f_d6m - f_d5m, giallo);
    drawFasciaX(canvasWidth - gX - f_d5m, f_d5m - f_d2m, giallo);
    drawFasciaX(canvasWidth - gX - f_d2m, f_d2m, '#ef4444');
    drawFasciaX(canvasWidth - gX, gX, '#38bdf8');

    addC(new fabric.Line([centerW, sideH, centerW, canvasHeight - sideH], { stroke: 'white', strokeWidth: 4, selectable: false, evented: false }));

    const drawDashedY = (x, color) => addC(new fabric.Line([x, sideH, x, canvasHeight - sideH], { stroke: color, strokeWidth: 2, strokeDashArray: [10, 6], selectable: false, evented: false }));
    drawDashedY(gX + f_d2m, '#ef4444'); drawDashedY(gX + f_d5m, '#ef4444'); drawDashedY(gX + f_d6m, giallo);
    drawDashedY(canvasWidth - gX - f_d2m, '#ef4444'); drawDashedY(canvasWidth - gX - f_d5m, '#ef4444'); drawDashedY(canvasWidth - gX - f_d6m, giallo);

    const offW = 130; 
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 20; pCanvas.height = 20;
    const pCtx = pCanvas.getContext('2d');
    pCtx.fillStyle = 'rgba(239, 68, 68, 0.1)'; pCtx.fillRect(0, 0, 20, 20);
    pCtx.strokeStyle = 'rgba(239, 68, 68, 0.3)'; pCtx.lineWidth = 2;
    pCtx.beginPath(); pCtx.moveTo(0, 20); pCtx.lineTo(20, 0); pCtx.stroke();
    const hPattern = new fabric.Pattern({ source: pCanvas, repeat: 'repeat' });

    addC(new fabric.Rect({ left: gX, top: centerH - offW, width: f_d2m, height: offW * 2, fill: hPattern, selectable: false, evented: false }));
    addC(new fabric.Rect({ left: canvasWidth - gX - f_d2m, top: centerH - offW, width: f_d2m, height: offW * 2, fill: hPattern, selectable: false, evented: false }));
    
    const offS = { stroke: '#ef4444', strokeWidth: 2.5, strokeDashArray: [8, 6], selectable: false, evented: false };
    addC(new fabric.Line([gX, centerH - offW, gX + f_d2m, centerH - offW], offS));
    addC(new fabric.Line([gX, centerH + offW, gX + f_d2m, centerH + offW], offS));
    addC(new fabric.Line([canvasWidth - gX - f_d2m, centerH - offW, canvasWidth - gX, centerH - offW], offS));
    addC(new fabric.Line([canvasWidth - gX - f_d2m, centerH + offW, canvasWidth - gX, centerH + offW], offS));

    const portaW = 45; const mezzaPortaY = 75; 
    const pSxCoords = [{x: gX, y: centerH - mezzaPortaY}, {x: gX - portaW, y: centerH - mezzaPortaY}, {x: gX - portaW, y: centerH + mezzaPortaY}, {x: gX, y: centerH + mezzaPortaY}];
    addC(new fabric.Polyline(pSxCoords, { stroke: '#0f172a', strokeWidth: 8, fill: 'transparent', strokeLineJoin: 'round', strokeLineCap: 'round', selectable: false, evented: false }));
    addC(new fabric.Polyline(pSxCoords, { stroke: 'white', strokeWidth: 5, fill: 'transparent', strokeLineJoin: 'round', strokeLineCap: 'round', selectable: false, evented: false }));

    const pDxCoords = [{x: canvasWidth - gX, y: centerH - mezzaPortaY}, {x: canvasWidth - gX + portaW, y: centerH - mezzaPortaY}, {x: canvasWidth - gX + portaW, y: centerH + mezzaPortaY}, {x: canvasWidth - gX, y: centerH + mezzaPortaY}];
    addC(new fabric.Polyline(pDxCoords, { stroke: '#0f172a', strokeWidth: 8, fill: 'transparent', strokeLineJoin: 'round', strokeLineCap: 'round', selectable: false, evented: false }));
    addC(new fabric.Polyline(pDxCoords, { stroke: 'white', strokeWidth: 5, fill: 'transparent', strokeLineJoin: 'round', strokeLineCap: 'round', selectable: false, evented: false }));

    const drawFondoY = (x) => {
        addC(new fabric.Line([x, sideH, x, centerH - mezzaPortaY], { stroke: 'white', strokeWidth: 4, selectable: false, evented: false }));
        addC(new fabric.Line([x, centerH + mezzaPortaY, x, canvasHeight - sideH], { stroke: 'white', strokeWidth: 4, selectable: false, evented: false }));
    };
    drawFondoY(gX); drawFondoY(canvasWidth - gX);

    const pW = gX - sideH; 
    const pH = 75;
    addC(new fabric.Rect({ left: sideH, top: canvasHeight - sideH - pH, width: pW, height: pH, fill: 'rgba(239, 68, 68, 0.15)', stroke: '#ef4444', strokeWidth: 2, strokeDashArray: [6, 4], selectable: false, evented: false }));
    addC(new fabric.Text("POZ.", { left: sideH + pW/2, top: canvasHeight - sideH - pH/2, fontSize: 16, fontFamily: 'Montserrat', fontWeight: '800', fill: '#ef4444', originX: 'center', originY: 'center', angle: -90, selectable: false, evented: false }));

    addC(new fabric.Rect({ left: canvasWidth - gX, top: canvasHeight - sideH - pH, width: pW, height: pH, fill: 'rgba(239, 68, 68, 0.15)', stroke: '#ef4444', strokeWidth: 2, strokeDashArray: [6, 4], selectable: false, evented: false }));
    addC(new fabric.Text("POZ.", { left: canvasWidth - gX + pW/2, top: canvasHeight - sideH - pH + pH/2, fontSize: 16, fontFamily: 'Montserrat', fontWeight: '800', fill: '#ef4444', originX: 'center', originY: 'center', angle: 90, selectable: false, evented: false }));

    // TIRA SU LE PEDINE
    canvas.getObjects().forEach(obj => {
        if (obj.isBase || obj.isUserObject) {
            canvas.bringToFront(obj);
        }
    });
}