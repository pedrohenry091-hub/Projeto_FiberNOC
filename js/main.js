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
            networkStatus.textContent = "⚠️ Atenção: Existem equipamentos offline.";
            networkStatus.style.color = "#ef4444"; // Cor Red-500
        } else {
            networkStatus.textContent = "✅ Sistema operando normalmente.";
            networkStatus.style.color = "#22c55e"; // Cor Green-500
        }
    }
}

/**
 * 2. Cria a lista de alertas recentes (Limitado aos 6 mais recentes)
 */
async function renderAlertList() {
    const logs = await getLogs();
    const alertList = document.getElementById('list-alerts');
    
    if (!alertList) return;

    alertList.innerHTML = ''; 

    // Pega apenas os últimos 6 logs e inverte para o mais novo aparecer no topo
    const ultimosLogs = [...logs].reverse().slice(0, 6);

    ultimosLogs.forEach(log => {
        const li = document.createElement('li');
        // 'log.tipo' deve ser 'error' ou 'warning' para bater com o CSS
        li.className = `alert-item ${log.tipo}`; 
        li.innerHTML = `
            <small style="display:block; color:#64748b; font-size:0.7em;">${log.data}</small>
            <span><strong>${log.evento}</strong> - ${log.onu}</span>
        `;
        
        alertList.appendChild(li);
    });
}

/**
 * 3. Configura o menu lateral (Sidebar)
 * Ajustado para empurrar o conteúdo principal
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

// Executa as funções quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    renderAlertList();
    setupSidebar();
});
