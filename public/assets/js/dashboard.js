import { getOnus, getLogs, getStats, getAlerts } from './api.js';

function setUserName() {
  const session = JSON.parse(localStorage.getItem('fibernoc_session') || 'null');
  const currentUser = document.getElementById('currentUser');
  if (currentUser && session?.user) {
    currentUser.textContent = `👤 ${session.user}`;
  }
}

async function updateDashboardStats() {
  try {
    const stats = await getStats().catch(() => null);
    const elOnline = document.getElementById('stat-online');
    const elOffline = document.getElementById('stat-offline');
    const elAlerts = document.getElementById('stat-alerts');
    const networkStatus = document.getElementById('network-status');

    if (stats && stats.onlineCount !== undefined) {
      if (elOnline) elOnline.textContent = stats.onlineCount;
      if (elOffline) elOffline.textContent = stats.offlineCount;
      if (elAlerts) elAlerts.textContent = stats.alertCount;

      if (networkStatus) {
        networkStatus.textContent = stats.offlineCount > 0
          ? '⚠️ Atenção: Existem equipamentos offline.'
          : '✅ Sistema operando normalmente.';
        networkStatus.style.color = stats.offlineCount > 0 ? '#ef4444' : '#22c55e';
      }
      return;
    }

    const onus = await getOnus();
    const logs = await getLogs();
    const onlineCount = onus.filter((onu) => onu.status === 'online').length;
    const offlineCount = onus.filter((onu) => onu.status === 'offline').length;
    const alertCount = logs.length;

    if (elOnline) elOnline.textContent = onlineCount;
    if (elOffline) elOffline.textContent = offlineCount;
    if (elAlerts) elAlerts.textContent = alertCount;

    if (networkStatus) {
      networkStatus.textContent = offlineCount > 0
        ? '⚠️ Atenção: Existem equipamentos offline.'
        : '✅ Sistema operando normalmente.';
      networkStatus.style.color = offlineCount > 0 ? '#ef4444' : '#22c55e';
    }
  } catch (error) {
    console.error('Erro ao atualizar dashboard', error);
  }
}

async function renderAlertList() {
  try {
    const list = document.getElementById('list-alerts');
    if (!list) return;

    list.innerHTML = '';
    let alerts = await getAlerts(6).catch(() => null);

    if (!alerts || alerts.length === 0) {
      const logs = await getLogs();
      alerts = [...logs].reverse().slice(0, 6);
    }

    if (!alerts || alerts.length === 0) {
      list.innerHTML = '<li style="text-align:center; color:#64748b;">Nenhum alerta recente</li>';
      return;
    }

    alerts.forEach((alert) => {
      const li = document.createElement('li');
      const tipo = alert.tipo || 'info';
      li.className = `alert-item ${tipo}`;
      li.innerHTML = `
        <small style="display:block; color:#64748b; font-size:0.7em;">${alert.data || new Date().toLocaleString()}</small>
        <span><strong>${alert.evento || alert.title}</strong> - ${alert.onu || alert.source}</span>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao renderizar alertas', error);
  }
}

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

document.addEventListener('DOMContentLoaded', () => {
  setUserName();
  updateDashboardStats();
  renderAlertList();
  setupSidebar();
  setInterval(() => {
    updateDashboardStats();
    renderAlertList();
  }, 30000);
});
