import { getOnus } from './api.js';

async function renderCriticalPanel() {
    const onus = await getOnus();
    const tbody = document.getElementById('tabela-criticos');

    if (!tbody) return;

    tbody.innerHTML = ''; 

    // Filtro de Monitoramento: Só mostra quem tem sinal ruim (pior que -25dBm)
    const listaCritica = onus.filter(onu => onu.sinal <= -25);

    if (listaCritica.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">✅ Todos os níveis de sinal estão dentro da normalidade.</td></tr>';
        return;
    }

    listaCritica.forEach(onu => {
        const tr = document.createElement('tr');

        // Lógica de Severidade (Cores baseadas no padrão de rede)
        let color = "#f1c40f"; // Amarelo (Atenção: -25 a -27.9)
        let label = "ALERTA";

        if (onu.sinal <= -28) {
            color = "#e74c3c"; // Vermelho (Crítico: <= -28)
            label = "CRÍTICO";
        }

        tr.innerHTML = `
            <td><strong>${onu.nome}</strong></td>
            <td><code>${onu.mac}</code></td>
            <td style="color: ${color}; font-weight: bold;">${onu.sinal} dBm</td>
            <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
            <td><span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold;">${label}</span></td>
            <td>
                <button title="Ver Detalhes" onclick="location.href='details.html?id=${onu.id}'">🔍</button>
                <button title="Localizar no Mapa" onclick="location.href='mapa.html?id=${onu.id}'">📍</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Configuração do Menu Lateral
 * Ajustado para controlar tanto a sidebar quanto o conteúdo principal (main)
 */
function setupSidebar() {
    const menuBtn = document.querySelector('.menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main'); // Referência ao conteúdo principal

    if (menuBtn && sidebar && main) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded'); // Adiciona/Remove a margem esquerda
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCriticalPanel();
    setupSidebar();
});
