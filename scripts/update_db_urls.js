const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function updateDb() {
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    if (post.coverImage && post.coverImage.includes('assets.zyrosite.com')) {
      const url = post.coverImage;
      const hash = crypto.createHash('md5').update(url).digest('hex');
      let ext = '.jpg';
      if (url.includes('.png')) ext = '.png';
      else if (url.includes('.svg')) ext = '.svg';
      else if (url.includes('.webp')) ext = '.webp';
      else if (url.includes('.gif')) ext = '.gif';
      else if (url.includes('.jpeg')) ext = '.jpeg';
      
      const newUrl = '/assets/zyro/' + hash + ext;
      await prisma.post.update({
        where: { id: post.id },
        data: { coverImage: newUrl }
      });
      console.log(`Updated post ${post.slug} coverImage`);
    }
  }
}

updateDb().catch(console.error).finally(() => prisma.$disconnect());
