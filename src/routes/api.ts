import { Router, Request, Response } from 'express';
import prisma from '../database/database.js';
import {
  createFallbackOnu,
  getFallbackLogs,
  getFallbackOnuById,
  getFallbackOnus,
  getFallbackStats,
  updateFallbackOnu
} from '../lib/onu-store.js';

const router = Router();

router.get('/example', (_req: Request, res: Response) => {
  res.json({
    message: 'Exemplo de rota modularizada para API do FiberNOC',
    endpoint: '/api/example'
  });
});

router.get('/onus', async (_req: Request, res: Response) => {
  res.json(getFallbackOnus());
});

router.get('/onus/:id', async (req: Request, res: Response) => {
  const fallback = getFallbackOnuById(Number(req.params.id));
  if (!fallback) {
    res.status(404).json({ error: 'ONU não encontrada.' });
    return;
  }
  res.json(fallback);
});

router.post('/onus', async (req: Request, res: Response) => {
  const { nome, mac } = req.body;

  if (!nome || !mac) {
    res.status(400).json({ error: 'Nome e MAC são obrigatórios.' });
    return;
  }

  const created = createFallbackOnu(req.body);
  res.status(201).json(created);
});

router.put('/onus/:id', async (req: Request, res: Response) => {
  const updated = updateFallbackOnu(Number(req.params.id), req.body);
  if (!updated) {
    res.status(404).json({ error: 'ONU não encontrada.' });
    return;
  }
  res.json(updated);
});

router.get('/logs', async (_req: Request, res: Response) => {
  res.json(getFallbackLogs(20));
});

router.get('/summary', async (_req: Request, res: Response) => {
  const stats = getFallbackStats();
  const logs = getFallbackLogs(50);

  res.json({
    ...stats,
    totalLogs: logs.length,
    alertasCriticos: logs.filter((log: { tipo: string }) => log.tipo === 'error' || log.tipo === 'warning').length
  });
});

router.get('/stats', async (_req: Request, res: Response) => {
  res.json(getFallbackStats());
});

router.get('/alerts', async (req: Request, res: Response) => {
  res.json(getFallbackLogs(Number(req.query.limit as string) || 6));
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      res.status(400).json({
        error: 'Usuário e senha são obrigatórios.'
      });
      return;
    }

    // Credenciais válidas (em produção, usar bcrypt e banco de dados)
    const validUsers: { [key: string]: string } = {
      'admin': 'admin123',
      'fibernoc': 'senha456',
      'tecnico': 'tecnico789'
    };

    if (validUsers[username] && validUsers[username] === password) {
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({
        success: true,
        user: username,
        token,
        loginTime: new Date().toISOString()
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Usuário ou senha incorretos.'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao realizar login.'
    });
  }
});

export default router;
