// js/api.js

// Dados embutidos para ignorar o erro de CORS e funcionar sem servidor
const database = {
    "onus": [
        { "id": 1, "nome": "CLIENTE_01", "mac": "FHTT00A1B2C3", "status": "online", "sinal": -19.5, "regiao": "Joao Pessoa", "olt": "OLT-MANAIRA-01", "pon": "PON 1" },
        { "id": 2, "nome": "CLIENTE_02", "mac": "FHTT00C3D4E5", "status": "offline", "sinal": -31.2, "regiao": "Cabedelo", "olt": "OLT-INTERMARES-02", "pon": "PON 3" },
        { "id": 3, "nome": "CLIENTE_03", "mac": "FHTT00E5F6G7", "status": "online", "sinal": -26.8, "regiao": "Joao Pessoa", "olt": "OLT-MANAIRA-01", "pon": "PON 2" }
    ],
    "logs": [
        { "id": 1, "data": "2026-05-06 10:15:30", "onu": "CLIENTE_02", "evento": "PON_LOSS", "detalhe": "Rompimento de fibra detectado", "tipo": "error" },
        { "id": 2, "data": "2026-05-06 11:20:05", "onu": "CLIENTE_03", "evento": "LOW_SIGNAL", "detalhe": "Sinal óptico abaixo do limite", "tipo": "warning" }
    ]
};

// Funções que o restante do seu projeto já usa (não precisa mudar main.js nem onus.js)
export async function getOnus() {
    return database.onus;
}

export async function getLogs() {
    return database.logs;
}
