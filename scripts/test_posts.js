const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  console.log('Posts count:', posts.length);
  posts.forEach(p => console.log(p.title, p.status, p.category));
}
main().finally(() => prisma.$disconnect());
