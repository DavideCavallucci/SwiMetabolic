// ==========================================
// ui.js - GESTIONE INTERFACCIA, GRAFICI E EXPORT
// ==========================================

let performanceChart = null;

export function formatTimeUI(seconds) {
    if (seconds <= 0 || isNaN(seconds)) return "--";
    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);
    let c = Math.round((seconds - Math.floor(seconds)) * 100);
    
    if (c >= 100) { s++; c = 0; }
    if (s >= 60) { m++; s = 0; }
    
    const sStr = s.toString().padStart(2, '0');
    const cStr = c.toString().padStart(2, '0');
    const qS = "<span class='q-mark'>'</span>";
    const qD = "<span class='q-mark'>''</span>";
    
    return m > 0 ? `${m}${qS}${sStr}${qD}${cStr}` : `${sStr}${qD}${cStr}`;
}

export function renderTable(b2_100, zones) {
    const dists = [50, 100, 200, 400, 500, 800, 1500, 1650];
    let html = `<thead><tr class="sticky-header">
        <th class="py-3 px-4 sticky-col bg-slate-900 border-b border-white/5 uppercase text-[10px] font-black text-slate-500">Distanza</th>`;
    
    zones.forEach(z => {
        html += `<th class="py-3 px-4 text-center bg-slate-900/80 border-b border-white/5">
            <span class="block text-xl italic font-black text-${z.color}-400 mb-0.5">${z.id}</span>
            <span class="text-[8px] uppercase font-black text-slate-500">${z.label}</span>
        </th>`;
    });
    html += `</tr></thead><tbody class="divide-y divide-white/5">`;

    dists.forEach(d => {
        html += `<tr class="hover:bg-white/5 transition-colors">
            <td class="py-3 px-4 sticky-col bg-[#0f172a] font-black text-xl italic text-blue-500">${d}m</td>`;
        zones.forEach(z => {
            const t_base = b2_100 * z.m;
            const ratio = d / 100;
            const t_final = t_base * ratio * Math.pow(1.02, Math.log2(ratio));
            const isB2 = z.id === 'B2' ? 'bg-rose-500/5 font-black text-rose-400' : `text-${z.color}-400/80`;
            html += `<td class="py-3 px-4 text-center text-lg ${isB2}">${formatTimeUI(t_final)}</td>`;
        });
        html += `</tr>`;
    });

    document.getElementById('perf-table').innerHTML = html;
    document.getElementById('matrix-box').classList.remove('opacity-20');
}

export function updateRadarChart(b2_100, differential) {
    const ctx = document.getElementById('perfChart').getContext('2d');
    
    // Calcolo punteggi (0-100) basati sul profilo FIN
    // Un differenziale alto (>10'' sul 200m) sposta il DNA verso la Velocità
    const speedScore = Math.min(100, Math.max(20, 110 - (differential * 2)));
    const enduranceScore = Math.min(100, Math.max(20, (differential * 4)));
    const vo2Score = Math.min(100, Math.max(20, 140 - b2_100));

    const data = {
        labels: ['PICCO LATTATO (C2)', 'TOLLERANZA (C1)', 'VO2 MAX (B2)', 'SOGLIA (B1)', 'ADATTATIVO (A2)'],
        datasets: [
            {
                label: 'DNA Atleta',
                data: [speedScore, speedScore - 5, vo2Score, enduranceScore - 5, enduranceScore],
                backgroundColor: 'rgba(59, 130, 246, 0.4)',
                borderColor: '#3b82f6',
                borderWidth: 3,
                pointRadius: 4,
                zIndex: 10
            },
            {
                label: 'Target Mezzofondista',
                data: [70, 70, 70, 70, 70],
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderDash: [5, 5],
                borderWidth: 1,
                pointRadius: 0,
                zIndex: 1
            }
        ]
    };

    if (performanceChart) performanceChart.destroy();
    performanceChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: '#1e293b' },
                    grid: { color: '#1e293b' },
                    pointLabels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } },
                    ticks: { display: false },
                    min: 0, max: 100
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Diagnosi Profilo
    let profilo = "Equilibrato";
    if (differential > 12) profilo = "VELOCISTA PURO";
    else if (differential < 6) profilo = "FONDISTA";
    document.getElementById('athlete-profile').innerText = profilo;
}

export function exportToCSV() {
    const table = document.getElementById('perf-table');
    let csv = [];
    const rows = table.querySelectorAll("tr");
    for (const row of rows) {
        const cols = row.querySelectorAll("td, th");
        const rowData = Array.from(cols).map(c => `"${c.innerText.trim()}"`).join(",");
        csv.push(rowData);
    }
    const blob = new Blob([csv.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Squadra_Metabolic_Pro.csv");
    document.body.appendChild(link);
    link.click();
}