// js/onus.js
import { getOnus } from './api.js';

// Variável global para armazenar os dados e facilitar o filtro de busca
let allOnus = [];

/**
 * Renderiza a tabela de ONUs na tela
 * @param {Array} lista - Array de objetos ONU
 */
function renderTable(lista) {
    const tbody = document.getElementById('tabela-onus');
    if (!tbody) return;

    tbody.innerHTML = ''; // Limpa a tabela

    lista.forEach(onu => {
        const tr = document.createElement('tr');
        
        // Lógica de cores do UNM2000 para o sinal
        let signalClass = 'status-normal';
        if (onu.sinal <= -27) signalClass = 'status-critical';
        else if (onu.sinal <= -25) signalClass = 'status-warning';

        tr.innerHTML = `
            <td><strong>${onu.nome}</strong></td>
            <td><code>${onu.mac}</code></td>
            <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
            <td class="${signalClass}" style="font-weight:bold;">${onu.sinal} dBm</td>
            <td>
                <button title="Topologia" onclick="location.href='topology.html?id=${onu.id}'">🌐</button>
                <button title="Ver no Mapa" onclick="location.href='mapa.html?id=${onu.id}'">📍</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Função de busca/filtro que funciona em tempo real
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
 * Lógica para abrir/fechar o menu lateral
 */
function setupSidebar() {
    const menuBtn = document.querySelector('.menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    // Busca os dados da API (js/api.js)
    allOnus = await getOnus();
    
    renderTable(allOnus);
    setupSearch();
    setupSidebar();
});
