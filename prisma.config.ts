import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL ?? `postgresql://${process.env.POSTGRES_USER ?? 'fibernoc'}:${process.env.POSTGRES_PASSWORD ?? 'fibernoc'}@${process.env.POSTGRES_HOST ?? 'localhost'}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB ?? 'fibernoc'}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --loader ts-node/esm prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
