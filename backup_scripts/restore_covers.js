const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const postsToKeep = [
  '10-dicas-para-pescar-dourado',
  'pescaria-acontecendo',
  'confraternizacao',
  'eventos-corporativos',
  'turismo-de-experiencia'
];

async function main() {
  for (const slug of postsToKeep) {
    const cloneDir = path.join(process.cwd(), '..', `clone_${slug}`);
    const indexFile = path.join(cloneDir, 'index.html');
    
    if (fs.existsSync(indexFile)) {
      const html = fs.readFileSync(indexFile, 'utf8');
      
      let coverImage = '';
      
      const sections = html.split('<section id="');
      
      for (const s of sections) {
         if (s.includes('block-blog-header__content')) {
            const headerHtml = s;
            
            const imgMatch = headerHtml.match(/<img class="block-background__image"[^>]*src="([^"]+)"/);
            const vidMatch = headerHtml.match(/<video[^>]*src="([^"]+)"/);
            
            if (imgMatch) {
                coverImage = imgMatch[1];
            } else if (vidMatch) {
                coverImage = vidMatch[1];
            }
         }
      }
      
      if (coverImage) {
        await prisma.post.update({
          where: { slug },
          data: { coverImage }
        });
        console.log(`Restored cover for ${slug}: ${coverImage}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
