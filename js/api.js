// js/api.js

const API_BASE = '/api';

/**
 * Busca a lista de todas as ONUs
 */
export async function getOnus() {
    try {
        const response = await fetch(`${API_BASE}/onus`);
        if (!response.ok) throw new Error('Erro ao acessar API das ONUs');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar ONUs:', error);
        return [];
    }
}

/**
 * Busca o histórico de eventos (Logs)
 */
export async function getLogs() {
    try {
        const response = await fetch(`${API_BASE}/logs`);
        if (!response.ok) throw new Error('Erro ao acessar API dos logs');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        return [];
    }
}
