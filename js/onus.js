import { getOnus } from './api.js';

let allOnus = [];

function renderTable(lista) {
    const tbody = document.getElementById('tabela-onus');
    if (!tbody) return;
    tbody.innerHTML = ''; 

    lista.forEach(onu => {
        const tr = document.createElement('tr');
        
        let statusIcon = onu.status;
        if (onu.status === 'online' && onu.sinal <= -25) statusIcon = 'warning';

        tr.innerHTML = `
            <td><div class="onu-icon ${statusIcon}"></div><strong>${onu.nome}</strong></td>
            <td><code>${onu.mac}</code></td>
            <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
            <td style="font-weight:bold;">${onu.sinal} dBm</td>
            <td>
                <button onclick="location.href='details.html?id=${onu.id}'">🔍</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function setupSidebar() {
    const btn = document.querySelector('.menu-toggle');
    const side = document.getElementById('sidebar');
    const main = document.getElementById('main');
    if (btn && side && main) {
        btn.onclick = () => {
            side.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        };
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    allOnus = await getOnus();
    renderTable(allOnus);
    setupSidebar();
    
    // Filtro de busca simples
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allOnus.filter(o => o.nome.toLowerCase().includes(term) || o.mac.toLowerCase().includes(term));
        renderTable(filtered);
    });
});
