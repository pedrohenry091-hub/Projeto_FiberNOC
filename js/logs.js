import { getLogs } from './api.js';

async function renderLogsTable() {
    const logs = await getLogs();
    const tbody = document.getElementById('tabela-logs');
    
    if (!tbody) return;

    tbody.innerHTML = '';

    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum evento registrado no log.</td></tr>';
        return;
    }

    // Mostrar os mais recentes primeiro
    logs.reverse().forEach(log => {
        const tr = document.createElement('tr');
        
        // Estilo de acordo com o tipo de alerta do FiberHome
        let statusClass = "badge-info";
        if (log.tipo === "error") statusClass = "badge-danger";
        if (log.tipo === "warning") statusClass = "badge-warning";

        tr.innerHTML = `
            <td style="font-family: monospace; font-size: 0.9em;">${log.data}</td>
            <td><strong>${log.onu}</strong></td>
            <td><span class="badge ${log.tipo}">${log.evento}</span></td>
            <td>${log.detalhe}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Lógica de abertura do menu (Sidebar)
function initMenu() {
    const btn = document.querySelector('.menu-toggle');
    const side = document.getElementById('sidebar');
    if (btn && side) {
        btn.addEventListener('click', () => side.classList.toggle('collapsed'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderLogsTable();
    initMenu();
});
