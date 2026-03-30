// ==========================================
// CRONOLOGIA E AZIONI (Annulla, Pulisci, Esporta)
// ==========================================
function salvaStoria() {
    if (isRedoing) return; 
    
    if (cronologiaStati.length > 20) cronologiaStati.shift();
    
    // FIX FONDAMENTALE: Abbiamo aggiunto 'id' e 'name' nell'elenco delle cose 
    // da NON cancellare durante la creazione della "fotografia" dello stato.
    cronologiaStati.push(JSON.stringify(canvas.toJSON([
        'id', 'name', 'isUserObject', 'isBase', 'selectable', 
        'evented', 'hoverCursor', 'hasControls', 'hasBorders', 'isTemp'
    ])));
}

function annullaUltimo() {
    if (cronologiaStati.length <= 1) return; 

    isRedoing = true;
    cronologiaStati.pop(); 
    const statoPrecedente = cronologiaStati[cronologiaStati.length - 1]; 

    canvas.loadFromJSON(statoPrecedente, function() {
        
        // FIX FONDAMENTALE: Dopo un "Annulla", dobbiamo aggiornare la memoria globale
        // del roster leggendo i nomi visualizzati nel frame appena caricato.
        rosterMemoria = {};
        canvas.getObjects().forEach(obj => {
            if (obj.isBase && obj.type === 'group' && obj.id) {
                const badgeGroup = obj.getObjects().find(o => o.name === 'badgeNome');
                if (badgeGroup && badgeGroup.visible) {
                    const badgeTxt = badgeGroup.item(1); // Il testo è il secondo elemento
                    if (badgeTxt && badgeTxt.text) {
                        rosterMemoria[obj.id] = badgeTxt.text;
                    }
                }
            }
        });

        canvas.renderAll();
        isRedoing = false;
    });
}

function pulisciLavagna() {
    if (confirm("Vuoi cancellare tutti i disegni, frecce, testi extra e i NOMI dei giocatori? Le pedine rimarranno nelle loro posizioni.")) {
        const oggetti = canvas.getObjects();
        
        for (let i = oggetti.length - 1; i >= 0; i--) {
            const obj = oggetti[i];
            
            // 1. Rimuovi disegni, frecce e testi aggiunti a mano
            if (obj.isUserObject) {
                canvas.remove(obj);
            }
            
            // 2. Trova le pedine (isBase) e nascondi le loro etichette
            if (obj.isBase && obj.type === 'group') {
                // Controllo di sicurezza: verifichiamo che l'oggetto sia integro
                const badgeGroup = obj.getObjects ? obj.getObjects().find(o => o.name === 'badgeNome') : null;
                if (badgeGroup) {
                    badgeGroup.set({ visible: false });     
                    if(badgeGroup.item(1)) badgeGroup.item(1).set({ text: "" });   
                    obj.addWithUpdate();                    
                }
            }
        }
        
        // 3. Svuota la memoria globale
        rosterMemoria = {};
        
        canvas.renderAll();
        salvaStoria(); 
    }
}

function salvaImmagine() {
    const titleInput = document.getElementById('schema-title');
    const titleText = titleInput.value.trim();

    if (!titleText) { exportCanvas(); return; }

    const tempTitle = new fabric.Text(titleText, {
        left: centerW, top: 30, fontFamily: 'Montserrat', fontSize: 26, fontWeight: '800',
        fill: '#0c4a6e', originX: 'center', originY: 'center', selectable: false, evented: false
    });

    const titleBg = new fabric.Rect({
        left: tempTitle.left, top: tempTitle.top, width: tempTitle.width + 40, height: tempTitle.height + 15,
        fill: 'white', originX: 'center', originY: 'center', rx: 5, ry: 5, selectable: false, evented: false
    });

    canvas.add(titleBg); canvas.add(tempTitle);
    canvas.bringToFront(titleBg); canvas.bringToFront(tempTitle);
    canvas.renderAll();

    setTimeout(() => {
        exportCanvas(titleText); 
        canvas.remove(tempTitle); canvas.remove(titleBg); canvas.renderAll();
    }, 50); 
}

function exportCanvas(title = 'TacticBoard') {
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const link = document.createElement('a');
    link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    link.href = dataURL;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}