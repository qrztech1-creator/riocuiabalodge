import { PrismaClient } from '@prisma/client';

const rawDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

function getDatasourceUrl(url?: string) {
  if (!url) return undefined;

  let formattedUrl = url;

  // Supabase IPv4 compatibility fix for Vercel / AWS Lambda:
  // db.[ref].supabase.co on port 6543 is IPv6-only, causing Vercel serverless functions to fail to connect.
  // Switching to port 5432 (direct connection) allows IPv4 connections from Vercel.
  if (formattedUrl.includes('.supabase.co:6543')) {
    formattedUrl = formattedUrl
      .replace(':6543', ':5432')
      .replace('?pgbouncer=true', '')
      .replace('&pgbouncer=true', '');
  }

  if (formattedUrl.includes('sslmode=') || formattedUrl.includes('sqlite') || formattedUrl.includes('file:')) {
    return formattedUrl;
  }

  const separator = formattedUrl.includes('?') ? '&' : '?';
  return `${formattedUrl}${separator}sslmode=require`;
}

const dbUrl = getDatasourceUrl(rawDbUrl);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (dbUrl
    ? new PrismaClient({ datasources: { db: { url: dbUrl } } })
    : new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
