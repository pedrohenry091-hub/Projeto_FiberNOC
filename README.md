# FiberNOC API

Aplicação full-stack para monitoramento de ONU com backend em Express, banco PostgreSQL via Prisma e interface web integrada.

## Funcionalidades principais
- Autenticação com JWT
- Rotas protegidas para consulta e criação de ONUs
- Endpoints de métricas, logs e alertas
- Documentação básica da API em tempo de execução
- Testes automatizados com Vitest

## Tecnologias
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT + bcryptjs
- Vitest
- Docker Compose

## Requisitos
- Node.js 22+
- npm 10+
- Docker Desktop (opcional, para execução em containers)

## Instalação local

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Exemplo de valores:

```env
PORT=3000
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=fibernoc
POSTGRES_USER=fibernoc
POSTGRES_PASSWORD=fibernoc
DATABASE_URL=postgresql://fibernoc:fibernoc@localhost:5432/fibernoc
JWT_SECRET=change-me
```

3. Aplique as migrações e seed:

```bash
npm run db:migrate
npm run db:seed
```

4. Inicie o servidor:

```bash
npm run dev
```

A aplicação ficará disponível em:
- http://localhost:3000
- http://localhost:3000/api/docs

## Execução com Docker

```bash
docker compose up --build
```

A API e o banco serão iniciados automaticamente. A aplicação ficará disponível em:
- http://localhost:3000

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run test
npm run db:migrate
npm run db:seed
npm run db:generate
```

## Autenticação

Credenciais padrão para testes:
- admin / admin123
- fibernoc / senha456
- tecnico / tecnico789

O login retorna um token JWT que deve ser enviado no header:

```http
Authorization: Bearer <token>
```

## Endpoints principais

### Saúde
- GET /health

### Autenticação
- POST /api/auth/login
- GET /api/auth/me

### ONU
- GET /api/onus
- GET /api/onus/:id
- POST /api/onus
- PUT /api/onus/:id

### Logs e métricas
- GET /api/logs
- GET /api/stats
- GET /api/summary
- GET /api/alerts

## Testes

```bash
npx vitest run
```

## Estrutura do projeto
- src/server.ts: servidor principal e middleware global
- src/routes/api.ts: rotas da API
- src/lib/auth.ts: autenticação JWT e hashing
- prisma/schema.prisma: modelo do banco de dados
- tests/: testes automatizados

