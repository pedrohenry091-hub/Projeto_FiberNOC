// js/main.js
import { getOnus, getLogs } from './api.js';

/**
 * 1. Atualiza os números e o status geral no Dashboard
 */
async function updateDashboardStats() {
    const onus = await getOnus();
    const logs = await getLogs();

    // Filtra os dados para obter as contagens
    const onlineCount = onus.filter(onu => onu.status === 'online').length;
    const offlineCount = onus.filter(onu => onu.status === 'offline').length;
    const alertCount = logs.length;

    // Localiza os IDs no HTML e insere os valores
    const elOnline = document.getElementById('stat-online');
    const elOffline = document.getElementById('stat-offline');
    const elAlerts = document.getElementById('stat-alerts');

    if (elOnline) elOnline.textContent = onlineCount;
    if (elOffline) elOffline.textContent = offlineCount;
    if (elAlerts) elAlerts.textContent = alertCount;
    
    // Altera a mensagem de status da rede
    const networkStatus = document.getElementById('network-status');
    if (networkStatus) {
        if (offlineCount > 0) {
            networkStatus.textContent = "Atenção: Existem equipamentos offline.";
            networkStatus.style.color = "#e74c3c"; // Vermelho
        } else {
            networkStatus.textContent = "Sistema operando normalmente.";
            networkStatus.style.color = "#2ecc71"; // Verde
        }
    }
}

/**
 * 2. Cria a lista de alertas recentes (Manipulação do DOM)
 */
async function renderAlertList() {
    const logs = await getLogs();
    const alertList = document.getElementById('list-alerts');
    
    if (!alertList) return;

    alertList.innerHTML = ''; // Limpa a lista antes de preencher

    logs.forEach(log => {
        // Cria o elemento <li> via JavaScript (Requisito do professor)
        const li = document.createElement('li');
        li.className = `alert-item ${log.tipo}`; // Define se é 'critical' ou 'warning'
        li.innerHTML = `<strong>${log.data}</strong>: ${log.evento}`;
        
        alertList.appendChild(li);
    });
}

/**
 * 3. Configura o menu lateral (Sidebar)
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

// Executa as funções quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    renderAlertList();
    setupSidebar();
});
