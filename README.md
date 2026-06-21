# FiberNOC API

Esta API foi criada para servir como backend simples para o projeto **FiberNOC**, com foco em monitoramento de ONU.

## Tecnologias
- Node.js
- Express
- TypeScript
- Vitest
- Docker

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Valores padrão:
- `PORT=3000`
- `NODE_ENV=development`
- `DATABASE_URL="file:./dev.db"`

## Execução em desenvolvimento

```bash
npm run dev
```

O servidor ficará disponível em:
- http://localhost:3000

## Banco de dados com Prisma

Para criar o banco local e aplicar as migrações:

```bash
npm run db:migrate
npm run db:seed
```

Para regenerar o cliente após mudanças no schema:

```bash
npm run db:generate
```

## Build para produção

```bash
npm run build
```

## Execução em produção

```bash
npm run start
```

## Testes

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Docker

### Build da imagem

```bash
docker build -t fibernoc-api .
```

### Rodar o container

```bash
docker run -p 3000:3000 --env-file .env fibernoc-api
```

## Endpoints principais
- `GET /` → mensagem de boas-vindas
- `GET /health` → status da aplicação
- `GET /api/example` → exemplo de rota modularizada
