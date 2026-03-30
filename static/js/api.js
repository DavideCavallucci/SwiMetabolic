// ==========================================
// api.js - GESTIONE DATABASE E CHIAMATE DI RETE
// ==========================================

export async function fetchAthletes() {
    const res = await fetch('/api/athletes');
    const athletes = await res.json();
    const list = document.getElementById('athlete-list');
    list.innerHTML = '';
    
    if (athletes.length === 0) {
        list.innerHTML = '<li class="text-center text-slate-500 text-sm mt-10 italic">Squadra vuota.</li>';
        return;
    }

    athletes.forEach(a => {
        const li = document.createElement('li');
        li.className = "p-3 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-white/5 flex justify-between items-center group mb-2 transition-all cursor-pointer";
        li.innerHTML = `
            <div class="flex items-center gap-3 flex-grow" onclick="window.loadAthleteData(${a.d1}, ${a.t1}, ${a.d2}, ${a.t2})">
                <div class="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center font-bold text-blue-500 border border-blue-500/20 text-xs">${a.name.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="font-bold text-slate-200 uppercase text-sm">${a.name}</div>
                    <div class="text-[9px] text-slate-500 uppercase tracking-widest">${a.d1}m / ${a.d2}m</div>
                </div>
            </div>
            <button onclick="window.deleteAthlete(${a.id})" class="p-2 text-slate-600 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        `;
        list.appendChild(li);
    });
    lucide.createIcons();
}

export async function saveAthleteApi(data) {
    try {
        await fetch('/api/save', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data) 
        });
        await fetchAthletes(); // Ricarica la lista aggiornata
    } catch (e) { alert("Errore nel salvataggio."); }
}

export async function deleteAthleteApi(id) {
    try {
        await fetch(`/api/delete/${id}`, { method: 'DELETE' });
        await fetchAthletes(); // Ricarica la lista aggiornata
    } catch (e) { alert("Errore durante l'eliminazione."); }
}