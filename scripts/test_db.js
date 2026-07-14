const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.post.findFirst({where: {slug: 'confraternizacao'}}).then(p => {
  console.log(p.content.substring(0, 1000));
}).finally(() => prisma.$disconnect());
