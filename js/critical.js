// js/critical.js - Página de ONUs com Sinal Crítico com integração de API real

import { getOnus } from './api.js';

/**
 * Renderiza o painel de ONUs com sinal crítico
 */
async function renderCriticalPanel() {
    try {
        const onus = await getOnus();
        const tbody = document.getElementById('tabela-criticos');

        if (!tbody) return;

        tbody.innerHTML = '';

        // Filtra ONUs com sinal ruim (pior que -25 dBm)
        const listaCritica = onus.filter(onu => onu.sinal <= -25);

        if (listaCritica.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">✅ Todos os níveis de sinal estão dentro da normalidade.</td></tr>';
            return;
        }

        listaCritica.forEach(onu => {
            const tr = document.createElement('tr');

            // Lógica de Severidade baseada em padrões de rede
            let color = "#f1c40f"; // Amarelo (Atenção: -25 a -27.9 dBm)
            let label = "ALERTA";
            let bgColor = "rgba(241, 196, 15, 0.1)";

            if (onu.sinal <= -28) {
                color = "#e74c3c"; // Vermelho (Crítico: <= -28 dBm)
                label = "CRÍTICO";
                bgColor = "rgba(231, 76, 60, 0.1)";
            }

            tr.style.backgroundColor = bgColor;
            tr.innerHTML = `
                <td><strong>${onu.nome}</strong></td>
                <td><code>${onu.mac}</code></td>
                <td style="color: ${color}; font-weight: bold;">${onu.sinal} dBm</td>
                <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
                <td>
                    <span style="background: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold;">
                        ${label}
                    </span>
                </td>
                <td>
                    <button title="Ver Detalhes" onclick="location.href='details.html?id=${onu.id}'">🔍</button>
                    <button title="Localizar no Mapa" onclick="location.href='mapa.html?id=${onu.id}'">📍</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("❌ Erro ao carregar ONUs críticas:", error);
        const tbody = document.getElementById('tabela-criticos');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: red; padding: 20px;">Erro ao carregar dados</td></tr>';
        }
    }
}

/**
 * Configura o menu lateral
 */
function setupSidebar() {
    const menuBtn = document.querySelector('.menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');

    if (menuBtn && sidebar && main) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        });
    }
}

/**
 * Inicializa a página
 */
document.addEventListener('DOMContentLoaded', () => {
    renderCriticalPanel();
    setupSidebar();

    // Auto-refresh a cada 30 segundos
    setInterval(renderCriticalPanel, 30000);
});
