// js/onus.js
import { getOnus } from './api.js';

let allOnus = [];

/**
 * 1. Renderiza a tabela com Ícones estilo UNM2000
 */
function renderTable(lista) {
    const tbody = document.getElementById('tabela-onus');
    if (!tbody) return;

    tbody.innerHTML = ''; 

    lista.forEach(onu => {
        const tr = document.createElement('tr');
        
        // Lógica de cores do sinal
        let signalStyle = 'color: #22c55e;'; 
        if (onu.sinal <= -28) signalStyle = 'color: #ef4444;'; 
        else if (onu.sinal <= -25) signalStyle = 'color: #f59e0b;';

        // Lógica do Ícone Visual (UNM2000 Style)
        let statusIconClass = onu.status; // 'online' ou 'offline'
        if (onu.status === 'online' && onu.sinal <= -25) {
            statusIconClass = 'warning'; // Fica laranja se estiver online mas com sinal ruim
        }

        tr.innerHTML = `
            <td>
                <div class="onu-icon ${statusIconClass}"></div>
                <strong>${onu.nome}</strong>
            </td>
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
 * 2. Novo: Filtro por Região (Botões dinâmicos)
 */
function setupRegionFilters() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'region-filters';
    filterContainer.style.marginBottom = '20px';
    
    // Pega todas as regiões únicas do seu JSON
    const regioes = ['Todas', ...new Set(allOnus.map(onu => onu.regiao))];

    regioes.forEach(regiao => {
        const btn = document.createElement('button');
        btn.innerText = regiao;
        btn.className = 'btn-filter';
        btn.style.marginRight = '10px';
        btn.style.padding = '8px 15px';
        btn.style.cursor = 'pointer';

        btn.onclick = () => {
            if (regiao === 'Todas') {
                renderTable(allOnus);
            } else {
                const filtradas = allOnus.filter(o => o.regiao === regiao);
                renderTable(filtradas);
            }
        };
        filterContainer.appendChild(btn);
    });

    // Insere os botões antes da caixa de busca
    const searchInput = document.getElementById('searchInput');
    searchInput.parentNode.insertBefore(filterContainer, searchInput);
}

/**
 * Busca/Filtro em tempo real por Nome/MAC
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
 * Lógica do Menu Lateral
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

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    allOnus = await getOnus();
    
    setupRegionFilters(); // Cria os botões de cidade automaticamente
    renderTable(allOnus);
    setupSearch();
    setupSidebar();
});
