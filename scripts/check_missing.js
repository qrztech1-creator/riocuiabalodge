const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function checkMissingImages() {
  const posts = await prisma.post.findMany();
  let missing = [];
  
  for (const p of posts) {
    const imgRegex = /\/assets\/zyro\/[^"'\s\)\&]+/g;
    let match;
    while ((match = imgRegex.exec(p.content)) !== null) {
      const imgPath = path.join(process.cwd(), 'public', match[0]);
      if (!fs.existsSync(imgPath)) {
        missing.push({ post: p.slug, missingFile: imgPath });
      }
    }
  }
  
  console.log("Missing images:", missing.length);
  if (missing.length > 0) {
    console.log(missing.map(m => m.missingFile).join('\n'));
  }
}
checkMissingImages().finally(() => prisma.$disconnect());
