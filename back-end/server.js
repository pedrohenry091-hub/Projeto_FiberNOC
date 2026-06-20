/**
 * Backend - FiberNOC API
 * Servidor Node.js + Express para gerenciar ONUs e Logs
 * 
 * Instalação:
 * npm install express cors body-parser
 * 
 * Execução:
 * node server.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ========================================
// DADOS EM MEMÓRIA (Substitua por BD Real)
// ========================================

let onus = [
    {
        id: 1,
        nome: "CLIENTE_01",
        mac: "FHTT00A1B2C3",
        status: "online",
        sinal: -19.5,
        regiao: "Joao Pessoa",
        olt: "OLT-MANAIRA-01",
        pon: "PON 1"
    },
    {
        id: 2,
        nome: "CLIENTE_02",
        mac: "FHTT00C3D4E5",
        status: "offline",
        sinal: -31.2,
        regiao: "Cabedelo",
        olt: "OLT-INTERMARES-02",
        pon: "PON 3"
    },
    {
        id: 3,
        nome: "CLIENTE_03",
        mac: "FHTT00E5F6G7",
        status: "online",
        sinal: -26.8,
        regiao: "Joao Pessoa",
        olt: "OLT-MANAIRA-01",
        pon: "PON 2"
    }
];

let logs = [
    {
        id: 1,
        data: "2026-06-20 10:15:30",
        onu: "CLIENTE_02",
        evento: "PON_LOSS",
        detalhe: "Sinal caiu (LOS). Possível rompimento de fibra.",
        tipo: "error"
    },
    {
        id: 2,
        data: "2026-06-20 09:40:12",
        onu: "CLIENTE_01",
        evento: "POWER_OFF",
        detalhe: "Equipamento desligado (Dying Gasp).",
        tipo: "warning"
    },
    {
        id: 3,
        data: "2026-06-20 08:20:05",
        onu: "CLIENTE_03",
        evento: "CONFIG_CHG",
        detalhe: "Alteração de Profile de banda efetuada.",
        tipo: "info"
    }
];

// ========================================
// ENDPOINTS - ONUs
// ========================================

/**
 * GET /api/onus
 * Lista todas as ONUs
 */
app.get('/api/onus', (req, res) => {
    console.log('📡 GET /api/onus');
    res.json(onus);
});

/**
 * GET /api/onus/:id
 * Busca uma ONU específica por ID
 */
app.get('/api/onus/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📡 GET /api/onus/${id}`);
    
    const onu = onus.find(o => o.id === parseInt(id));
    
    if (!onu) {
        return res.status(404).json({ error: "ONU não encontrada" });
    }
    
    res.json(onu);
});

/**
 * PUT /api/onus/:id
 * Atualiza uma ONU
 */
app.put('/api/onus/:id', (req, res) => {
    const { id } = req.params;
    const { status, sinal } = req.body;
    console.log(`📡 PUT /api/onus/${id}`, { status, sinal });
    
    const onu = onus.find(o => o.id === parseInt(id));
    
    if (!onu) {
        return res.status(404).json({ error: "ONU não encontrada" });
    }
    
    // Atualiza os campos fornecidos
    if (status) onu.status = status;
    if (sinal !== undefined) onu.sinal = sinal;
    
    res.json(onu);
});

/**
 * DELETE /api/onus/:id
 * Remove uma ONU
 */
app.delete('/api/onus/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📡 DELETE /api/onus/${id}`);
    
    const index = onus.findIndex(o => o.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: "ONU não encontrada" });
    }
    
    const removida = onus.splice(index, 1);
    res.json({ message: "ONU removida com sucesso", onu: removida[0] });
});

// ========================================
// ENDPOINTS - Logs
// ========================================

/**
 * GET /api/logs
 * Lista todos os logs (com filtro opcional por ONU)
 */
app.get('/api/logs', (req, res) => {
    const { onu } = req.query;
    console.log('📡 GET /api/logs', { onu });
    
    let resultado = logs;
    
    if (onu) {
        resultado = logs.filter(log => log.onu.toLowerCase() === onu.toLowerCase());
    }
    
    res.json(resultado);
});

/**
 * POST /api/logs
 * Cria um novo log
 */
app.post('/api/logs', (req, res) => {
    const { onu, evento, detalhe, tipo } = req.body;
    console.log('📡 POST /api/logs', { onu, evento, tipo });
    
    if (!onu || !evento) {
        return res.status(400).json({ error: "ONU e evento são obrigatórios" });
    }
    
    const novoLog = {
        id: logs.length + 1,
        data: new Date().toLocaleString('pt-BR'),
        onu,
        evento,
        detalhe: detalhe || "",
        tipo: tipo || "info"
    };
    
    logs.push(novoLog);
    res.status(201).json(novoLog);
});

// ========================================
// ENDPOINTS - Alertas
// ========================================

/**
 * GET /api/alerts
 * Retorna alertas recentes (últimos N logs com tipo warning/error)
 */
app.get('/api/alerts', (req, res) => {
    const limit = parseInt(req.query.limit) || 6;
    console.log('📡 GET /api/alerts', { limit });
    
    const alertas = logs
        .filter(log => log.tipo === 'warning' || log.tipo === 'error')
        .reverse()
        .slice(0, limit);
    
    res.json(alertas);
});

// ========================================
// ENDPOINTS - Estatísticas
// ========================================

/**
 * GET /api/stats
 * Retorna estatísticas do dashboard
 */
app.get('/api/stats', (req, res) => {
    console.log('📡 GET /api/stats');
    
    const onlineCount = onus.filter(o => o.status === 'online').length;
    const offlineCount = onus.filter(o => o.status === 'offline').length;
    const alertCount = logs.filter(l => l.tipo === 'warning' || l.tipo === 'error').length;
    
    res.json({
        onlineCount,
        offlineCount,
        alertCount,
        totalOnus: onus.length,
        totalLogs: logs.length
    });
});

// ========================================
// HEALTH CHECK
// ========================================

/**
 * GET /api/health
 * Verifica se a API está funcionando
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'FiberNOC API está funcionando',
        timestamp: new Date().toISOString()
    });
});

// ========================================
// ERRO 404
// ========================================

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🚀 FiberNOC API Server Iniciado     ║
    ║   🔌 Porta: ${PORT}                       ║
    ║   📍 URL: http://localhost:${PORT}       ║
    ║   🏥 Health: http://localhost:${PORT}/api/health ║
    ╚════════════════════════════════════════╝
    `);
});

module.exports = app;
