import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/example', (_req: Request, res: Response) => {
  res.json({
    message: 'Exemplo de rota modularizada para API do FiberNOC',
    endpoint: '/api/example'
  });
});

router.get('/onus', async (_req: Request, res: Response) => {
  try {
    const onus = await prisma.onu.findMany({
      orderBy: { id: 'asc' }
    });

    res.json(onus);
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível carregar os dados das ONUs.'
    });
  }
});

router.get('/onus/:id', async (req: Request, res: Response) => {
  try {
    const onu = await prisma.onu.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!onu) {
      res.status(404).json({ error: 'ONU não encontrada.' });
      return;
    }

    res.json(onu);
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível carregar os dados da ONU.'
    });
  }
});

router.get('/logs', async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { id: 'asc' }
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível carregar os logs.'
    });
  }
});

router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const [onus, logs] = await Promise.all([
      prisma.onu.findMany(),
      prisma.log.findMany()
    ]);

    const online = onus.filter((onu: { status: string }) => onu.status === 'online').length;
    const offline = onus.filter((onu: { status: string }) => onu.status === 'offline').length;

    res.json({
      totalOnus: onus.length,
      online,
      offline,
      totalLogs: logs.length,
      alertasCriticos: logs.filter((log: { tipo: string }) => log.tipo === 'error' || log.tipo === 'warning').length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível gerar o resumo.'
    });
  }
});

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [onus, logs] = await Promise.all([
      prisma.onu.findMany(),
      prisma.log.findMany()
    ]);

    const onlineCount = onus.filter((onu: { status: string }) => onu.status === 'online').length;
    const offlineCount = onus.filter((onu: { status: string }) => onu.status === 'offline').length;
    const alertCount = logs.filter((log: { tipo: string }) => log.tipo === 'error' || log.tipo === 'warning').length;

    res.json({
      onlineCount,
      offlineCount,
      alertCount,
      totalOnus: onus.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível carregar as estatísticas.'
    });
  }
});

router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const alerts = await prisma.log.findMany({
      orderBy: { id: 'desc' },
      take: limit
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível carregar os alertas.'
    });
  }
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
