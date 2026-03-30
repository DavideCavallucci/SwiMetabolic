// =========================================
// RESPONSIVE E INIT
// =========================================
function adattaSchermo() {
    const contenitore = document.getElementById('canvas-wrapper');
    let larghezzaDisponibile = contenitore.clientWidth;
    
    if (larghezzaDisponibile < canvasWidth) {
        const fattoreScala = larghezzaDisponibile / canvasWidth;
        canvas.setWidth(canvasWidth * fattoreScala);
        canvas.setHeight(canvasHeight * fattoreScala);
        canvas.setZoom(fattoreScala);
    } else {
        canvas.setWidth(canvasWidth);
        canvas.setHeight(canvasHeight);
        canvas.setZoom(1);
    }
    canvas.calcOffset();

    // Aggiorna l'indicatore magnetico al resize così non si sballa!
    const activeBtn = document.querySelector('.tab-btn.active');
    if(activeBtn) muoviIndicatore(activeBtn);
}

window.addEventListener('load', () => {
    impostaVista('meta');
    
    // Attende un micro-istante per assicurarsi che i font e i box siano renderizzati 
    // prima di piazzare l'indicatore magnetico.
    setTimeout(() => {
        const activeBtn = document.querySelector('.tab-btn.active');
        if(activeBtn) muoviIndicatore(activeBtn);
    }, 100);
    
    const yearElem = document.getElementById('currentYear');
    if (yearElem) yearElem.textContent = new Date().getFullYear();
    
    canvas.on('object:modified', salvaStoria);

    canvas.on('path:created', function(opt) { 
        opt.path.set({ selectable: true, hoverCursor: 'pointer', isUserObject: true });
        if (usaTratteggio) opt.path.set({ strokeDashArray: [12, 12] });
        salvaStoria(); 
    });
});

window.addEventListener('resize', adattaSchermo);