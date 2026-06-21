import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const sqlitePath = databaseUrl.startsWith('file:') ? databaseUrl.slice(5) : databaseUrl;

const adapter = new PrismaBetterSqlite3({
  url: sqlitePath,
});

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

export default prisma;
