import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL ?? `postgresql://${process.env.POSTGRES_USER ?? 'fibernoc'}:${process.env.POSTGRES_PASSWORD ?? 'fibernoc'}@${process.env.POSTGRES_HOST ?? 'localhost'}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB ?? 'fibernoc'}`;

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

export { databaseUrl };
export default prisma;
