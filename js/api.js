// js/api.js

// URL onde o seu json-server estará rodando
const API_URL = 'http://localhost:3000';

/**
 * Busca a lista de todas as ONUs do servidor
 * @returns {Promise<Array>} Lista de objetos ONU
 */
export async function getOnus() {
    try {
        const response = await fetch(`${API_URL}/onus`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar ONUs no servidor:", error);
        return []; // Retorna lista vazia para o sistema não travar
    }
}

/**
 * Busca os logs e alertas registrados
 * @returns {Promise<Array>} Lista de objetos de log
 */
export async function getLogs() {
    try {
        const response = await fetch(`${API_URL}/logs`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar logs no servidor:", error);
        return [];
    }
}
