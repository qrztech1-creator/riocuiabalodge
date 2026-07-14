const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres:Comisuam%40e24%23%21@db.xkqlaumvrdbhddllrsan.supabase.co:6543/postgres?pgbouncer=true'
});

async function main() {
  const t = Date.now();
  const posts = await prisma.post.findMany();
  console.log('Posts:', posts.length, 'Time:', Date.now() - t, 'ms');
}
main().finally(() => prisma.$disconnect());
