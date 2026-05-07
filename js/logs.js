import { getLogs } from './api.js';

async function renderLogsTable() {
    const logs = await getLogs();
    const tbody = document.getElementById('tabela-logs');
    
    if (!tbody) return;

    tbody.innerHTML = '';

    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhum evento registrado no log até o momento.</td></tr>';
        return;
    }

    // Criamos uma cópia para inverter e não afetar os dados originais, se necessário
    const logsExibicao = [...logs].reverse();

    logsExibicao.forEach(log => {
        const tr = document.createElement('tr');
        
        // Mapeamento de tipos para classes CSS (Ajustado para o padrão do seu style.css)
        // Se no JSON estiver "error", ele aplica a classe "error" que já tem cor no CSS
        const tipoClass = log.tipo || 'info';

        tr.innerHTML = `
            <td style="font-family: monospace; font-size: 0.9em; color: #64748b;">${log.data}</td>
            <td><strong>${log.onu}</strong></td>
            <td><span class="badge ${tipoClass}">${log.evento}</span></td>
            <td style="color: #334155;">${log.detalhe}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Lógica de abertura do menu (Sidebar)
 * Integrada com o ID 'main' para expansão do layout
 */
function initMenu() {
    const btn = document.querySelector('.menu-toggle');
    const side = document.getElementById('sidebar');
    const main = document.getElementById('main'); // Referência ao conteúdo principal

    if (btn && side && main) {
        btn.addEventListener('click', () => {
            side.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderLogsTable();
    initMenu();
});
