// js/onus.js
import { getOnus } from './api.js';

// Variável global para armazenar os dados e facilitar o filtro de busca
let allOnus = [];

/**
 * Renderiza a tabela de ONUs na tela
 */
function renderTable(lista) {
    const tbody = document.getElementById('tabela-onus');
    if (!tbody) return;

    tbody.innerHTML = ''; 

    lista.forEach(onu => {
        const tr = document.createElement('tr');
        
        // Sincronizando com as cores de sinal do style.css
        let signalStyle = 'color: #22c55e;'; // Verde (Normal)
        if (onu.sinal <= -28) signalStyle = 'color: #ef4444;'; // Vermelho (Crítico)
        else if (onu.sinal <= -25) signalStyle = 'color: #f59e0b;'; // Amarelo (Alerta)

        tr.innerHTML = `
            <td><strong>${onu.nome}</strong></td>
            <td><code>${onu.mac}</code></td>
            <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
            <td style="${signalStyle} font-weight:bold;">${onu.sinal} dBm</td>
            <td>
                <button title="Ver Detalhes" onclick="location.href='details.html?id=${onu.id}'">🔍</button>
                <button title="Localizar no Mapa" onclick="location.href='mapa.html?id=${onu.id}'">📍</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Busca/Filtro em tempo real
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allOnus.filter(onu => 
            onu.nome.toLowerCase().includes(term) || 
            onu.mac.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });
}

/**
 * Lógica do Menu Lateral (Sidebar + Main Content)
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

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    allOnus = await getOnus();
    
    renderTable(allOnus);
    setupSearch();
    setupSidebar();
});
