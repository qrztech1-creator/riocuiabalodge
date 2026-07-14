const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  posts.forEach(post => {
    console.log('===================================');
    console.log('TITLE:', post.title);
    console.log('SLUG:', post.slug);
    console.log('CATEGORY:', post.category);
    console.log('COVER IMAGE:', post.coverImage);
    console.log('CONTENT LENGTH:', (post.content || '').length);
    console.log('CONTENT FIRST 500:');
    console.log((post.content || '').substring(0, 500));
    console.log('');
  });
  await prisma.$disconnect();
}

main();
