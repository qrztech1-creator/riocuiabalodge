const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
    console.log(JSON.stringify({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      status: p.status,
      coverImage: (p.coverImage || '').substring(0, 80),
      contentPreview: (p.content || '').substring(0, 150).replace(/\n/g, ' ')
    }));
  });
  await prisma.$disconnect();
}

main();
