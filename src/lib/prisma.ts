import { PrismaClient } from '@prisma/client';

const rawDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

function getDatasourceUrl(url?: string) {
  if (!url) return undefined;
  if (url.includes('sslmode=') || url.includes('sqlite') || url.includes('file:')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}sslmode=require`;
}

const dbUrl = getDatasourceUrl(rawDbUrl);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: {
              url: dbUrl,
            },
          },
        }
      : {}
  );

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

