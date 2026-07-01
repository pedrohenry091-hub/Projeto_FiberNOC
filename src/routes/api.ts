import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../database/database.js';
import {
  createFallbackOnu,
  deleteFallbackOnu,
  getFallbackLogs,
  getFallbackOnuById,
  getFallbackOnus,
  getFallbackStats,
  updateFallbackOnu
} from '../lib/onu-store.js';
import { AppError } from '../lib/errors.js';
import { authenticateUser, createUser, findUserByUsername, requireAuth, signToken } from '../lib/auth.js';

type PendingOnu = {
  id: number;
  nome: string;
  mac: string;
  slot: string;
  porta: string;
  status: string;
};

const pendingOnus: PendingOnu[] = [
  {
    id: 1,
    nome: 'ONU PENDENTE 01',
    mac: 'FHTT09BBA123',
    slot: '1',
    porta: '1/8',
    status: 'pending'
  }
];

const router = Router();

router.get('/example', (_req: Request, res: Response) => {
  res.json({
    message: 'Exemplo de rota modularizada para API do FiberNOC',
    endpoint: '/api/example'
  });
});

router.get('/onus', requireAuth, async (_req: Request, res: Response) => {
  try {
    const onus = await prisma.onu.findMany({ orderBy: { id: 'asc' } });
    res.json(onus);
  } catch (error) {
    res.json(getFallbackOnus());
  }
});

router.get('/onus/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const onu = await prisma.onu.findUnique({ where: { id: Number(req.params.id) } });
    if (onu) {
      res.json(onu);
      return;
    }
  } catch {
    // fallback abaixo
  }

  const fallback = getFallbackOnuById(Number(req.params.id));
  if (!fallback) {
    res.status(404).json({ error: 'ONU não encontrada.' });
    return;
  }
  res.json(fallback);
});

router.post('/onus', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const { nome, mac } = req.body;

  if (!nome || !mac) {
    res.status(400).json({ error: 'Nome e MAC são obrigatórios.' });
    return;
  }

  try {
    const created = await prisma.onu.create({
      data: {
        nome,
        mac,
        status: req.body.status || 'offline',
        sinal: Number(req.body.sinal ?? -30),
        regiao: req.body.regiao || 'Sem região',
        olt: req.body.olt || 'OLT-PADRÃO',
        pon: req.body.pon || 'PON 1'
      }
    });

    res.status(201).json(created);
  } catch (error) {
    console.warn('Falha ao persistir no Prisma, usando fallback local:', error);
    const created = createFallbackOnu(req.body);
    res.status(201).json(created);
  }
});

router.get('/unauthorized', requireAuth, (_req: Request, res: Response) => {
  res.json(pendingOnus);
});

router.post('/unauthorized/:id/authorize', requireAuth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const pending = pendingOnus.find((item) => item.id === id);

  if (!pending) {
    res.status(404).json({ error: 'ONU pendente não encontrada.' });
    return;
  }

  const payload = {
    nome: pending.nome,
    mac: pending.mac,
    status: 'offline',
    sinal: -30,
    regiao: 'Autorizada manualmente',
    olt: 'OLT-PADRÃO',
    pon: `PON ${pending.porta}`
  };

  try {
    const created = await prisma.onu.create({
      data: {
        nome: payload.nome,
        mac: payload.mac,
        status: payload.status,
        sinal: payload.sinal,
        regiao: payload.regiao,
        olt: payload.olt,
        pon: payload.pon
      }
    });

    res.status(201).json(created);
    return;
  } catch (error) {
    console.warn('Falha ao persistir ONU autorizada no Prisma, usando fallback local:', error);
    const created = createFallbackOnu(payload);
    res.status(201).json(created);
  }
});

router.put('/onus/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.onu.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(req.body.status ? { status: req.body.status } : {}),
        ...(req.body.sinal !== undefined ? { sinal: Number(req.body.sinal) } : {})
      }
    });

    res.json(updated);
  } catch {
    const updated = updateFallbackOnu(Number(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ error: 'ONU não encontrada.' });
      return;
    }
    res.json(updated);
  }
});

router.delete('/onus/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.onu.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'ONU removida com sucesso.' });
  } catch {
    const removed = deleteFallbackOnu(Number(req.params.id));
    if (!removed) {
      res.status(404).json({ error: 'ONU não encontrada.' });
      return;
    }
    res.json({ success: true, message: 'ONU removida com sucesso.' });
  }
});

router.get('/logs', requireAuth, async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.log.findMany({ orderBy: { id: 'asc' } });
    res.json(logs);
  } catch {
    res.json(getFallbackLogs(20));
  }
});

router.get('/summary', requireAuth, async (_req: Request, res: Response) => {
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
  } catch {
    const stats = getFallbackStats();
    const logs = getFallbackLogs(50);

    res.json({
      ...stats,
      totalLogs: logs.length,
      alertasCriticos: logs.filter((log: { tipo: string }) => log.tipo === 'error' || log.tipo === 'warning').length
    });
  }
});

router.get('/stats', requireAuth, async (_req: Request, res: Response) => {
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
  } catch {
    res.json(getFallbackStats());
  }
});

router.get('/alerts', requireAuth, async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit as string) || 6;
    const alerts = await prisma.log.findMany({ orderBy: { id: 'desc' }, take: limit });
    res.json(alerts);
  } catch {
    res.json(getFallbackLogs(Number(req.query.limit as string) || 6));
  }
});

router.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user?.username,
    authenticated: true
  });
});

router.post('/auth/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };

    if (!username || !password) {
      throw new AppError('Usuário e senha são obrigatórios.', 400);
    }

    if (username.length < 3 || password.length < 6) {
      throw new AppError('Usuário deve ter pelo menos 3 caracteres e senha pelo menos 6.', 400);
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      throw new AppError('Usuário já existe.', 409);
    }

    const user = await createUser(username, password);

    res.status(201).json({
      success: true,
      user: user.username,
      message: 'Usuário cadastrado com sucesso.'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };

    if (!username || !password) {
      throw new AppError('Usuário e senha são obrigatórios.', 400);
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      throw new AppError('Usuário ou senha incorretos.', 401);
    }

    const token = signToken({ username: user.username });

    res.json({
      success: true,
      user: user.username,
      token,
      loginTime: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
