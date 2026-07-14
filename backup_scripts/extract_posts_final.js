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
      console.log(`\nProcessing ${slug}...`);

      let title = '';
      let dateText = '';
      let coverImage = '';
      let content = '';
      let headerSectionId = '';
      
      const sections = html.split('<section id="');
      
      for (const s of sections) {
         if (s.includes('block-blog-header__content')) {
            headerSectionId = s.substring(0, 6);
            const headerHtml = s;
            
            // Find title
            const titleMatch = headerHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
            if (titleMatch) {
                title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
            }
            
            // Find date in spans
            const dateMatch = headerHtml.match(/<span[^>]*>(\d{1,2}\/\d{1,2}\/\d{4})<\/span>/);
            if (dateMatch) {
                dateText = dateMatch[1].trim();
            }
            
            // Find cover image or video
            const imgMatch = headerHtml.match(/<img class="block-background__image"[^>]*src="([^"]+)"/);
            const vidMatch = headerHtml.match(/<video[^>]*src="([^"]+)"/);
            
            if (imgMatch) {
                coverImage = imgMatch[1];
            } else if (vidMatch) {
                coverImage = vidMatch[1];
            }
         }
      }
      
      let extractedContentParts = [];
      
      for (let i = 1; i < sections.length; i++) {
        const sectionId = sections[i].substring(0, 6);
        
        if (sectionId === headerSectionId || sections[i].includes('CONTATO') || sections[i].includes('ENDEREÇO')) {
            continue;
        }
        
        const sectionHtml = '<section id="' + sections[i];
        
        const matches = sectionHtml.matchAll(/<(p|h2|h3|h4|h5|h6)[^>]*class="(?:body|heading\d*|text-box\w*)[^"]*"[^>]*>([\s\S]*?)<\/\1>/g);
        for (const m of Array.from(matches)) {
          let text = m[2].trim();
          text = text.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '').trim();
          text = text.replace(/<strong[^>]*>/g, '<strong>').replace(/<br[^>]*>/g, '<br/>');
          
          if (text && !text.includes('data-v-')) {
             if (m[1] === 'p') {
                extractedContentParts.push(`<p>${text}</p>`);
             } else {
                extractedContentParts.push(`<${m[1]}>${text}</${m[1]}>`);
             }
          }
        }
        
        const imgMatches = sectionHtml.matchAll(/<img[^>]*class="[^"]*image[^"]*"[^>]*src="([^"]+)"[^>]*>/g);
        for (const m of Array.from(imgMatches)) {
           const src = m[1];
           if (!src.includes('data:image/svg') && !src.includes('cdn-cgi')) {
              extractedContentParts.push(`<div class="post-image-container" style="margin: 2rem 0; text-align: center;"><img src="${src}" style="max-width: 100%; border-radius: 8px;" /></div>`);
           } else if (src.includes('cdn-cgi') && !src.includes('asset_')) {
              extractedContentParts.push(`<div class="post-image-container" style="margin: 2rem 0; text-align: center;"><img src="${src}" style="max-width: 100%; border-radius: 8px;" /></div>`);
           }
        }
      }
      
      content = extractedContentParts.join('\n');
      
      let parsedDate = new Date();
      if (dateText) {
          // Format is mm/dd/yyyy
          const dParts = dateText.split('/');
          if (dParts.length === 3) {
             const month = parseInt(dParts[0]) - 1;
             const day = parseInt(dParts[1]);
             const year = parseInt(dParts[2]);
             if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                 parsedDate = new Date(year, month, day, 12, 0, 0);
             }
          }
      }

      console.log(`Title: ${title}`);
      console.log(`Date text: ${dateText} -> ${parsedDate.toISOString()}`);
      console.log(`Cover: ${coverImage}`);
      console.log(`Content length: ${content.length}`);

      // Ensure post exists or create it
      const existing = await prisma.post.findUnique({ where: { slug } });
      let category = 'ARTIGO';
      if (slug === 'confraternizacao' || slug === 'eventos-corporativos' || slug === 'turismo-de-experiencia') {
         category = 'EVENTO';
      }

      if (existing) {
        await prisma.post.update({
          where: { slug },
          data: {
            title: title || slug,
            content: content,
            coverImage: coverImage || '/assets/asset_12.jpg',
            createdAt: parsedDate
          }
        });
        console.log(`✅ Updated ${slug}`);
      } else {
        await prisma.post.create({
          data: {
            title: title || slug,
            slug: slug,
            category: category,
            content: content,
            coverImage: coverImage || '/assets/asset_12.jpg',
            createdAt: parsedDate,
            status: 'PUBLISHED',
            readTime: 3
          }
        });
        console.log(`✅ Created ${slug}`);
      }
      
    } else {
      console.log(`Skipped ${slug}, file not found.`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
