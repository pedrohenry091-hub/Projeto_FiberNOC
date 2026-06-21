import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

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

export default router;
