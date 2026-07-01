import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api.js';
import prisma from './database/database.js';
import { AppError } from './lib/errors.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
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

app.get('/index.html', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'html', 'index.html'));
});

app.get('/login.html', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'html', 'login.html'));
});

app.get('/api/docs', (_req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'FiberNOC API',
      version: '1.0.0',
      description: 'API do projeto FiberNOC com autenticação JWT, monitoramento de ONU e métricas.'
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'Autenticar usuário',
          responses: {
            '200': { description: 'Login realizado com sucesso' },
            '401': { description: 'Credenciais inválidas' }
          }
        }
      },
      '/api/auth/register': {
        post: {
          summary: 'Registrar novo usuário',
          responses: {
            '201': { description: 'Usuário cadastrado com sucesso' },
            '409': { description: 'Usuário já existe' }
          }
        }
      },
      '/api/onus': {
        get: { summary: 'Listar ONUs' },
        post: { summary: 'Criar ONU' }
      },
      '/api/onus/{id}': {
        get: { summary: 'Buscar ONU por id' },
        put: { summary: 'Atualizar ONU' },
        delete: { summary: 'Remover ONU' }
      },
      '/api/logs': {
        get: { summary: 'Listar logs' }
      },
      '/api/stats': {
        get: { summary: 'Retornar estatísticas' }
      }
    }
  });
});

app.use(express.static(path.join(process.cwd(), 'public')));
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

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
    return;
  }

  console.error(err instanceof Error ? err.stack || err.message : err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Conexão com PostgreSQL estabelecida.');
  } catch (error) {
    console.warn('PostgreSQL indisponível no momento. O servidor continuará em modo fallback.');
    console.warn(error);
  }

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

const isServerEntry = process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js');
if (isServerEntry) {
  void startServer();
}

export default app;
