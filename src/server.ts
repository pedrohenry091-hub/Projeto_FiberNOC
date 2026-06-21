import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import apiRoutes from './routes/api';
import prisma from './lib/prisma';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*'
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'html', 'index.html'));
});

app.use(express.static(path.join(process.cwd(), 'html')));
app.use(express.static(process.cwd()));

app.use('/api', apiRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  void next;
  console.error(err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});

const startServer = async () => {
  await prisma.$connect();

  const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Ambiente: ${NODE_ENV}`);
  });

  const shutdown = async (signal: NodeJS.Signals) => {
    console.log(`Recebido ${signal}. Encerrando servidor...`);

    server.close(async () => {
      await prisma.$disconnect();
      console.log('Servidor encerrado com sucesso.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
};

if (require.main === module) {
  void startServer();
}

export default app;
