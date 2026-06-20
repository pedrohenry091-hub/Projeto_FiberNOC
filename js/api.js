// js/api.js - API Client para Back-end Real

// URL base da API (substitua pela URL do seu backend)
// Pode ser configurada via variável de ambiente ou localStorage
const API_BASE_URL = localStorage.getItem('API_BASE_URL') || 
                     process.env.REACT_APP_API_URL || 
                     'http://localhost:3000/api';

/**
 * Função auxiliar para requisições HTTP com tratamento de erro
 */
async function apiCall(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`❌ API Error [${endpoint}]:`, error.message);
        throw error;
    }
}

/**
 * Busca a lista de todas as ONUs
 * GET /api/onus
 */
export async function getOnus() {
    try {
        const data = await apiCall('/onus');
        // Se a API retorna { data: [...] }, extrai o array
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error("Erro ao buscar ONUs:", error);
        return [];
    }
}

/**
 * Busca uma ONU específica por ID
 * GET /api/onus/:id
 */
export async function getOnuById(id) {
    try {
        const data = await apiCall(`/onus/${id}`);
        return data.data || data;
    } catch (error) {
        console.error(`Erro ao buscar ONU ${id}:`, error);
        return null;
    }
}

/**
 * Atualiza o status de uma ONU
 * PUT /api/onus/:id
 */
export async function updateOnuStatus(id, status) {
    try {
        const data = await apiCall(`/onus/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
        return data.data || data;
    } catch (error) {
        console.error(`Erro ao atualizar ONU ${id}:`, error);
        return null;
    }
}

/**
 * Busca o histórico de eventos (Logs)
 * GET /api/logs
 */
export async function getLogs(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/logs${queryString ? '?' + queryString : ''}`;
        const data = await apiCall(endpoint);
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        return [];
    }
}

/**
 * Busca logs de uma ONU específica
 * GET /api/logs?onu=:nome
 */
export async function getLogsByOnu(onuName) {
    try {
        const data = await apiCall(`/logs?onu=${encodeURIComponent(onuName)}`);
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error(`Erro ao buscar logs da ONU ${onuName}:`, error);
        return [];
    }
}

/**
 * Busca alertas recentes
 * GET /api/alerts
 */
export async function getAlerts(limit = 6) {
    try {
        const data = await apiCall(`/alerts?limit=${limit}`);
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error("Erro ao buscar alertas:", error);
        return [];
    }
}

/**
 * Busca estatísticas do dashboard
 * GET /api/stats
 */
export async function getStats() {
    try {
        const data = await apiCall('/stats');
        return data.data || data;
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return { onlineCount: 0, offlineCount: 0, alertCount: 0 };
    }
}

/**
 * Define a URL da API (útil para ambientes dinâmicos)
 */
export function setApiBaseUrl(url) {
    localStorage.setItem('API_BASE_URL', url);
    console.log(`✅ API URL configurada: ${url}`);
}

/**
 * Retorna a URL atual da API
 */
export function getApiBaseUrl() {
    return API_BASE_URL;
}
