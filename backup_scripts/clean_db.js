const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const keepSlugs = [
  '10-dicas-para-pescar-dourado',
  'pescaria-acontecendo',
  'confraternizacao',
  'eventos-corporativos',
  'turismo-de-experiencia'
];

async function main() {
  const result = await prisma.post.deleteMany({
    where: {
      slug: {
        notIn: keepSlugs
      }
    }
  });
  console.log(`Deleted ${result.count} posts.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
