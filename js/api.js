// js/api.js

// Link direto para o seu db.json na branch add-logs
const URL_DB = 'https://raw.githubusercontent.com/pedrohenry091-hub/Projeto_FiberNOC/refs/heads/main/db.json';

/**
 * Busca a lista de todas as ONUs
 */
export async function getOnus() {
    try {
        const response = await fetch(URL_DB);
        if (!response.ok) throw new Error("Erro ao acessar DB");
        const data = await response.json();
        return data.onus; 
    } catch (error) {
        console.error("Erro ao buscar ONUs:", error);
        return [];
    }
}

/**
 * Busca o histórico de eventos (Logs)
 */
export async function getLogs() {
    try {
        const response = await fetch(URL_DB);
        if (!response.ok) throw new Error("Erro ao acessar DB");
        const data = await response.json();
        return data.logs;
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        return [];
    }
}
