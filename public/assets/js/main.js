// js/main.js - Dashboard principal com integração de API real

import { getOnus, getLogs, getStats, getAlerts } from './api.js';

/**
 * 1. Atualiza os números e o status geral no Dashboard
 * Busca dados em tempo real da API
 */
async function updateDashboardStats() {
    try {
        // Tenta usar endpoint de stats se disponível na API
        const stats = await getStats().catch(() => null);

        if (stats && stats.onlineCount !== undefined) {
            // API tem endpoint dedicado para stats
            const elOnline = document.getElementById('stat-online');
            const elOffline = document.getElementById('stat-offline');
            const elAlerts = document.getElementById('stat-alerts');

            if (elOnline) elOnline.textContent = stats.onlineCount;
            if (elOffline) elOffline.textContent = stats.offlineCount;
            if (elAlerts) elAlerts.textContent = stats.alertCount;

            updateNetworkStatus(stats.offlineCount > 0);
        } else {
            // Fallback: busca ONUs e Logs manualmente
            const onus = await getOnus();
            const logs = await getLogs();

            const onlineCount = onus.filter(onu => onu.status === 'online').length;
            const offlineCount = onus.filter(onu => onu.status === 'offline').length;
            const alertCount = logs.length;

            const elOnline = document.getElementById('stat-online');
            const elOffline = document.getElementById('stat-offline');
            const elAlerts = document.getElementById('stat-alerts');

            if (elOnline) elOnline.textContent = onlineCount;
            if (elOffline) elOffline.textContent = offlineCount;
            if (elAlerts) elAlerts.textContent = alertCount;

            updateNetworkStatus(offlineCount > 0);
        }
    } catch (error) {
        console.error("❌ Erro ao atualizar stats:", error);
    }
}

/**
 * Atualiza o status da rede
 */
function updateNetworkStatus(hasOffline) {
    const networkStatus = document.getElementById('network-status');
    if (networkStatus) {
        if (hasOffline) {
            networkStatus.textContent = "⚠️ Atenção: Existem equipamentos offline.";
            networkStatus.style.color = "#ef4444"; // Vermelho
        } else {
            networkStatus.textContent = "✅ Sistema operando normalmente.";
            networkStatus.style.color = "#22c55e"; // Verde
        }
    }
}

/**
 * 2. Cria a lista de alertas recentes
 * Usa endpoint dedicado de alertas ou getLogs com limite
 */
async function renderAlertList() {
    try {
        const alertList = document.getElementById('list-alerts');
        if (!alertList) return;

        alertList.innerHTML = '';

        // Tenta buscar alertas do endpoint dedicado
        let alerts = await getAlerts(6).catch(() => null);

        // Fallback: usa logs
        if (!alerts || alerts.length === 0) {
            const logs = await getLogs();
            alerts = [...logs].reverse().slice(0, 6);
        }

        if (alerts.length === 0) {
            alertList.innerHTML = '<li style="text-align:center; color: #64748b;">Nenhum alerta recente</li>';
            return;
        }

        alerts.forEach(alert => {
            const li = document.createElement('li');
            const tipo = alert.tipo || 'info';
            li.className = `alert-item ${tipo}`;
            li.innerHTML = `
                <small style="display:block; color:#64748b; font-size:0.7em;">${alert.data || new Date().toLocaleString()}</small>
                <span><strong>${alert.evento || alert.title}</strong> - ${alert.onu || alert.source}</span>
            `;
            alertList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Erro ao renderizar alertas:", error);
    }
}

/**
 * 3. Configura o menu lateral (Sidebar)
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
 * Inicializa o dashboard com auto-refresh
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados iniciais
    updateDashboardStats();
    renderAlertList();
    setupSidebar();

    // Auto-refresh a cada 30 segundos
    setInterval(() => {
        updateDashboardStats();
        renderAlertList();
    }, 30000);
});
