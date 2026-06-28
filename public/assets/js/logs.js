// js/logs.js - Página de Logs com integração de API real

import { getLogs } from './api.js';

/**
 * Renderiza a tabela de logs
 */
async function renderLogsTable() {
    try {
        const logs = await getLogs();
        const tbody = document.getElementById('tabela-logs');

        if (!tbody) return;

        tbody.innerHTML = '';

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhum evento registrado no log até o momento.</td></tr>';
            return;
        }

        // Ordena logs do mais recente para o mais antigo
        const logsExibicao = [...logs].reverse();

        logsExibicao.forEach(log => {
            const tr = document.createElement('tr');

            // Define classe CSS baseada no tipo de evento
            const tipoClass = log.tipo || 'info';
            const badgeColor = {
                'error': '#ef4444',
                'warning': '#f59e0b',
                'info': '#3b82f6'
            }[tipoClass] || '#64748b';

            tr.innerHTML = `
                <td style="font-family: monospace; font-size: 0.9em; color: #64748b;">
                    ${log.data || new Date().toLocaleString()}
                </td>
                <td><strong>${log.onu}</strong></td>
                <td>
                    <span class="badge ${tipoClass}" style="background-color: ${badgeColor}; color: white;">
                        ${log.evento}
                    </span>
                </td>
                <td style="color: #334155;">${log.detalhe}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("❌ Erro ao carregar logs:", error);
        const tbody = document.getElementById('tabela-logs');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: red; padding: 20px;">Erro ao carregar logs</td></tr>';
        }
    }
}

/**
 * Configura o menu lateral
 */
function initMenu() {
    const btn = document.querySelector('.menu-toggle');
    const side = document.getElementById('sidebar');
    const main = document.getElementById('main');

    if (btn && side && main) {
        btn.addEventListener('click', () => {
            side.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        });
    }
}

/**
 * Inicializa a página
 */
document.addEventListener('DOMContentLoaded', () => {
    renderLogsTable();
    initMenu();

    // Auto-refresh a cada 60 segundos
    setInterval(renderLogsTable, 60000);
});
