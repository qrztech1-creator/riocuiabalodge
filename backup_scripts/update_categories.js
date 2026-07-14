const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.post.updateMany({
    where: { slug: { in: ['10-dicas-para-pescar-dourado', 'pescaria-acontecendo', 'turismo-de-experiencia'] } },
    data: { category: 'NOTICIA' }
  });
  
  await prisma.post.updateMany({
    where: { slug: { in: ['confraternizacao', 'eventos-corporativos'] } },
    data: { category: 'EVENTO' }
  });
  
  console.log('Categories updated');
}

main();
