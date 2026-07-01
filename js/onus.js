// js/onus.js - Página de ONUs com integração de API real

import { createOnu, getOnus } from './api.js';

let allOnus = [];

/**
 * Renderiza a tabela de ONUs
 */
function renderTable(lista) {
    const tbody = document.getElementById('tabela-onus');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhuma ONU encontrada</td></tr>';
        return;
    }

    lista.forEach(onu => {
        const tr = document.createElement('tr');

        // Define ícone baseado em status e sinal
        let statusIcon = onu.status;
        if (onu.status === 'online' && onu.sinal <= -25) {
            statusIcon = 'warning';
        }

        tr.innerHTML = `
            <td>
                <div class="onu-icon ${statusIcon}"></div>
                <strong>${onu.nome}</strong>
            </td>
            <td><code>${onu.mac}</code></td>
            <td><span class="badge ${onu.status}">${onu.status.toUpperCase()}</span></td>
            <td style="font-weight:bold; color: ${onu.sinal >= -20 ? '#22c55e' : onu.sinal >= -25 ? '#f59e0b' : '#ef4444'};">
                ${onu.sinal} dBm
            </td>
            <td>
                <button title="Ver Detalhes" onclick="location.href='details.html?id=${onu.id}'">🔍</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Configura o menu lateral
 */
function setupSidebar() {
    const btn = document.querySelector('.menu-toggle');
    const side = document.getElementById('sidebar');
    const main = document.getElementById('main');

    if (btn && side && main) {
        btn.addEventListener('click', () => {
            side.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        });
    }
}

function showMessage(message, type = 'success') {
    const el = document.getElementById('addOnuMessage');
    if (!el) return;
    el.textContent = message;
    el.style.color = type === 'error' ? '#b91c1c' : '#0f766e';
}

async function handleAddOnu(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const payload = {
        nome: data.nome,
        mac: data.mac,
        status: data.status || 'offline',
        sinal: Number(data.sinal ?? -30),
        regiao: data.regiao || 'Sem região',
        olt: data.olt || 'OLT-PADRÃO',
        pon: data.pon || 'PON 1'
    };

    try {
        const created = await createOnu(payload);
        const normalized = created && typeof created === 'object' ? created : null;

        if (normalized) {
            allOnus = [normalized, ...allOnus.filter((item) => item.mac !== normalized.mac)];
            renderTable(allOnus);
            form.reset();
            showMessage('ONU cadastrada com sucesso.');
        } else {
            showMessage('Não foi possível cadastrar a ONU.', 'error');
        }
    } catch (error) {
        console.error('Erro ao cadastrar ONU:', error);
        showMessage('Não foi possível cadastrar a ONU.', 'error');
    }
}

/**
 * Inicializa a página
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Busca ONUs da API
        allOnus = await getOnus();
        renderTable(allOnus);
    } catch (error) {
        console.error("❌ Erro ao carregar ONUs:", error);
        const tbody = document.getElementById('tabela-onus');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red; padding: 20px;">Erro ao carregar dados</td></tr>';
        }
    }

    setupSidebar();

    const formAddOnu = document.getElementById('formAddOnu');
    if (formAddOnu) {
        formAddOnu.addEventListener('submit', handleAddOnu);
    }

    // Configura filtro de busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allOnus.filter(o =>
                o.nome.toLowerCase().includes(term) ||
                o.mac.toLowerCase().includes(term) ||
                o.regiao?.toLowerCase().includes(term)
            );
            renderTable(filtered);
        });
    }
});
