// ==========================================
// MOTORE PLAYBOOK (ANIMAZIONE A FRAME)
// ==========================================
let playbookFrames = [];
let isPlayingBook = false;

function salvaFrame() {
    const flash = document.getElementById('canvas-flash');
    if(flash) {
        flash.style.opacity = '0.6';
        setTimeout(() => flash.style.opacity = '0', 100);
    }

    const frameData = canvas.getObjects()
        .filter(obj => obj.isBase && obj.id)
        .map(obj => ({ id: obj.id, left: obj.left, top: obj.top }));

    playbookFrames.push(frameData);

    const timeline = document.getElementById('timelineDots');
    
    if (playbookFrames.length === 1) {
        const placeholder = timeline.querySelector('.pb-placeholder');
        if (placeholder) placeholder.remove();
    }
    
    const dot = document.createElement('div');
    dot.className = 'frame-dot';
    dot.id = `dot-frame-${playbookFrames.length - 1}`;
    timeline.appendChild(dot);
    
    timeline.scrollLeft = timeline.scrollWidth;
}

function resetPlaybook() {
    playbookFrames = [];
    const timeline = document.getElementById('timelineDots');
    timeline.innerHTML = '<span class="pb-placeholder">Nessun frame acquisito...</span>';
}

function riproduciPlaybook() {
    return new Promise((resolve) => {
        if (playbookFrames.length < 2) {
            resolve();
            return;
        }
        if (isPlayingBook) return;
        isPlayingBook = true;

        const btnPlay = document.getElementById('btnPlayAnim');
        if(btnPlay) {
            btnPlay.style.opacity = "0.5";
            btnPlay.innerText = "ESECUZIONE...";
        }

        let frameIndex = 0;
        const durataAnim = 1000;
        const pausa = 400;

        function vai() {
            if (frameIndex >= playbookFrames.length) {
                isPlayingBook = false;
                if(btnPlay) {
                    btnPlay.style.opacity = "1";
                    btnPlay.innerHTML = '<span class="pb-icon">▶️</span> PLAY';
                }
                document.querySelectorAll('.frame-dot').forEach(d => d.classList.remove('active-playing'));
                resolve(); 
                return;
            }

            document.querySelectorAll('.frame-dot').forEach(d => d.classList.remove('active-playing'));
            const currentDot = document.getElementById(`dot-frame-${frameIndex}`);
            if(currentDot) {
                currentDot.classList.add('active-playing');
                currentDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }

            const data = playbookFrames[frameIndex];
            data.forEach(pData => {
                const obj = canvas.getObjects().find(o => o.id === pData.id);
                if (obj) {
                    obj.animate({ left: pData.left, top: pData.top }, {
                        duration: durataAnim,
                        onChange: canvas.renderAll.bind(canvas),
                        easing: fabric.util.ease.easeInOutCubic
                    });
                }
            });

            frameIndex++;
            setTimeout(vai, durataAnim + pausa);
        }
        vai();
    });
}

// ==========================================
// ESPORTAZIONE VIDEO
// ==========================================
async function esportaVideoPlaybook() {
    if (playbookFrames.length < 2) return alert("Crea almeno due frame prima di esportare!");

    const btnExport = document.getElementById('btnExportVideo');
    const container = document.querySelector('.pb-bar');
    
    btnExport.innerText = "🔴 RECORDING...";
    container.classList.add('recording-active');

    const canvasElement = document.getElementById('tacticBoard');
    const stream = canvasElement.captureStream(30); 
    
    let tipoVideo = 'video/webm;codecs=vp9'; 
    let estensione = 'webm';
    if (MediaRecorder.isTypeSupported('video/mp4')) {
        tipoVideo = 'video/mp4'; 
        estensione = 'mp4';
    }

    const recorder = new MediaRecorder(stream, {
        mimeType: tipoVideo,
        videoBitsPerSecond: 5000000
    });
    
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: tipoVideo });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tattica-pn-${timestamp}.${estensione}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        btnExport.innerHTML = '<span class="pb-icon">📹</span> ESPORTA';
        container.classList.remove('recording-active');
        alert("Video generato!");
    };

    recorder.start();
    await riproduciPlaybook();
    
    setTimeout(() => {
        recorder.stop();
    }, 500);
}

let isPresentationMode = false;

function togglePresentationMode() {
    isPresentationMode = !isPresentationMode;
    
    // 1. Applica/Rimuovi la classe al Body
    document.body.classList.toggle('presentation-mode', isPresentationMode);
    
    // 2. Aggiorna il testo del bottone
    const btn = document.getElementById('btnPresent');
    if (btn) {
        if (isPresentationMode) {
            btn.innerHTML = '<span class="pb-icon">✕</span> ESCI';
        } else {
            btn.innerHTML = '<span class="pb-icon">📺</span> FOCUS';
        }
    }

    // 3. Logica per pareggiare le larghezze (Width Matching)
    const playbookBar = document.querySelector('.playbook-wrapper');
    // fabric.js di solito mette l'effettivo visualizzato in 'upper-canvas'
    const canvasEl = document.querySelector('.upper-canvas'); 

    // Aspettiamo un attimo che il CSS nasconda gli elementi per ricalcolare bene
    setTimeout(() => {
    if(typeof adattaSchermo === "function") adattaSchermo();

    if (isPresentationMode && playbookBar && canvasEl) {
        // Calcoliamo la larghezza del canvas e quella dello schermo
        const cWidth = parseFloat(canvasEl.style.width);
        const windowWidth = window.innerWidth * 0.95; // 95% dello schermo per sicurezza

        // Applichiamo la larghezza del canvas SOLO se è più piccola dello schermo
        if (cWidth > windowWidth) {
            playbookBar.style.width = '95vw';
        } else {
            playbookBar.style.width = cWidth + 'px';
        }
        playbookBar.style.maxWidth = 'none';
    } else if (!isPresentationMode && playbookBar) {
        playbookBar.style.width = ''; 
        playbookBar.style.maxWidth = '';
    }
    
    canvas.renderAll();
    }, 150);
}