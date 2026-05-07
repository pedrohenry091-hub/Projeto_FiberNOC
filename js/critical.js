import { getOnus } from './api.js';

async function renderCriticalPanel() {
    const onus = await getOnus();
    const tbody = document.getElementById('tabela-criticos');

    if (!tbody) return;

    tbody.innerHTML = ''; 

    // Filtro de Monitoramento: Só mostra quem tem sinal ruim (pior que -25dBm)
    // Isso é o que define uma "ONU em estado crítico"
    const listaCritica = onus.filter(onu => onu.sinal <= -25);

    if (listaCritica.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">✅ Todos os níveis de sinal estão dentro da normalidade.</td></tr>';
        return;
    }

    listaCritica.forEach(onu => {
        const tr = document.createElement('tr');

        // Lógica de Severidade (Monitoramento Prático)
        let color = "#f1c40f"; // Amarelo (Atenção)
        let label = "ALERTA";

        if (onu.sinal <= -28) {
            color = "#e74c3c"; // Vermelho (Crítico/Risco de Queda)
            label = "CRÍTICO";
        }

        tr.innerHTML = `
            <td><strong>${onu.nome}</strong></td>
            <td><code>${onu.mac}</code></td>
            <td style="color: ${color}; font-weight: bold;">${onu.sinal} dBm</td>
            <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
            <td><span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold;">${label}</span></td>
            <td>
                <button title="Ver Topologia" onclick="location.href='topology.html?id=${onu.id}'">🌐</button>
                <button title="Localizar no Mapa" onclick="location.href='mapa.html?id=${onu.id}'">📍</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Configuração do Menu Lateral
function setupSidebar() {
    const menuBtn = document.querySelector('.menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCriticalPanel();
    setupSidebar();
});
