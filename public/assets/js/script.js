// js/script.js - Scripts gerais com integração de API

import { getOnuById, updateOnuStatus } from './api.js';

/**
 * Função de login (redireciona para index.html)
 */
function login() {
    window.location.href = "index.html";
}

/**
 * Toggle do Sidebar
 */
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar && main) {
        sidebar.classList.toggle("collapsed");
        main.classList.toggle("expanded");
    }
}

/**
 * Navega para página de detalhes com dados atualizados da API
 */
async function goToDetails(id) {
    try {
        // Busca dados atualizados da ONU do back-end
        const onu = await getOnuById(id);
        
        if (onu) {
            const params = new URLSearchParams({
                id: onu.id,
                status: onu.status,
                signal: onu.sinal
            });
            window.location.href = `details.html?${params.toString()}`;
        } else {
            console.error("ONU não encontrada");
            alert("Erro ao carregar dados da ONU");
        }
    } catch (error) {
        console.error("Erro ao navegar para detalhes:", error);
        alert("Erro ao carregar dados");
    }
}

/**
 * Carrega e exibe dados da ONU na página de detalhes
 */
async function loadOnuDetails() {
    const params = new URLSearchParams(window.location.search);
    const onuId = params.get("id");

    // Elementos que podem existir na página
    const onuIdEl = document.getElementById("onuId");
    const onuStatusEl = document.getElementById("onuStatus");
    const onuSignalEl = document.getElementById("onuSignal");

    if (!onuId) return;

    try {
        // Busca dados atualizados do back-end
        const onu = await getOnuById(onuId);

        if (onu) {
            if (onuIdEl) onuIdEl.textContent = onu.id;
            if (onuStatusEl) onuStatusEl.textContent = onu.status;
            if (onuSignalEl) onuSignalEl.textContent = onu.sinal;

            // Aplica estilos após carregar
            colorSignal();
            applyStatusColor();
        } else {
            console.error("ONU não encontrada na API");
            if (onuIdEl) onuIdEl.textContent = "Erro ao carregar";
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes da ONU:", error);
    }
}

/**
 * Filtra ONUs na tabela baseado em busca por nome ou MAC
 */
function filterOnu() {
    const input = document.getElementById("searchInput");
    const rows = document.querySelectorAll(".onu-table tbody tr");

    if (!input) return;

    const filter = input.value.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

/**
 * Aplica cores aos níveis de sinal
 * Verde: >= -20 dBm (Bom)
 * Amarelo: -20 a -25 dBm (Médio)
 * Vermelho: < -25 dBm (Ruim)
 */
function colorSignal() {
    const signals = document.querySelectorAll(".signal");

    signals.forEach(el => {
        const value = parseInt(el.textContent);

        // Remove classes anteriores
        el.classList.remove("good", "medium", "bad");

        // Aplica nova classe baseada no valor
        if (value >= -20) {
            el.classList.add("good");
        } else if (value >= -25) {
            el.classList.add("medium");
        } else {
            el.classList.add("bad");
        }

        // Formata o texto
        el.textContent = value + " dBm";
    });
}

/**
 * Aplica cores ao status (Online/Offline)
 */
function applyStatusColor() {
    const statusEl = document.getElementById("onuStatus");

    if (!statusEl) return;

    const status = statusEl.textContent.toLowerCase().trim();

    statusEl.classList.add("status");

    // Remove classes anteriores
    statusEl.classList.remove("online", "offline");

    // Aplica nova classe
    if (status === "online") {
        statusEl.classList.add("online");
    } else {
        statusEl.classList.add("offline");
    }
}

/**
 * Evento: quando o DOM termina de carregar
 */
document.addEventListener("DOMContentLoaded", () => {
    // Carrega detalhes da ONU se estiver na página de detalhes
    loadOnuDetails();

    // Aplica coloração de sinais
    colorSignal();

    // Aplica coloração de status
    applyStatusColor();

    // Configura filtro de busca
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterOnu);
    }
});
