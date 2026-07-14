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

      const sections = html.split('<section id="');
      
      let title = '';
      for (const s of sections) {
         if (s.includes('block-blog-header__content')) {
            const titleMatch = s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
            if (titleMatch) title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
         }
      }
      
      let extractedContentParts = [];
      let seenImages = new Set();
      
      for (let i = 1; i < sections.length; i++) {
        const sectionId = sections[i].substring(0, 6);
        
        // ONLY skip footer/contact, do NOT skip header section because it might contain content!
        if (sections[i].includes('CONTATO') || sections[i].includes('ENDEREÇO') || sections[i].includes('WhatsApp')) {
            continue;
        }
        
        const sectionHtml = '<section id="' + sections[i];
        
        // Simplified image regex to not care about class
        const regex = /<(p|h2|h3|h4|h5|h6)[^>]*class="(?:body|heading\d*|text-box\w*)[^"]*"[^>]*>([\s\S]*?)<\/\1>|<img[^>]*src="([^"]+)"[^>]*>/g;
        let matches = [...sectionHtml.matchAll(regex)];
        
        for (const m of matches) {
           if (m[1]) {
              // It's a text block
              let textRaw = m[2];
              
              // Handle bold spans (Zyro uses <span style="font-weight: 700">)
              textRaw = textRaw.replace(/<span[^>]*font-weight:\s*700[^>]*>([\s\S]*?)<\/span>/gi, '<strong>$1</strong>');
              textRaw = textRaw.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1'); // strip other spans
              
              let text = textRaw.trim();
              
              if (text && !text.includes('data-v-') && !text.includes('Não fique de fora dessa aventu')) {
                 if (text === title || (title && text.includes(title))) {
                    continue; // Skip the title if it was found as a paragraph
                 }
                 if (text.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
                    continue; // Skip the date string
                 }
                 if (text.includes('min read')) {
                    continue;
                 }
                 
                 if (text.toLowerCase().includes('dica ') || text.toLowerCase().includes('introdução à')) {
                    extractedContentParts.push(`<h3>${text}</h3>`);
                 } else if (m[1] === 'p') {
                    extractedContentParts.push(`<p>${text}</p>`);
                 } else {
                    extractedContentParts.push(`<${m[1]}>${text}</${m[1]}>`);
                 }
              }
           } else if (m[3]) {
              // It's an image
              const src = m[3];
              if (!src.includes('data:image/svg') && !src.includes('logo-')) {
                 // Deduplicate by filename
                 const fileNameMatch = src.match(/\/([^\/]+)\.[a-z0-9]+$/i);
                 const fileName = fileNameMatch ? fileNameMatch[1] : src;
                 
                 if (!seenImages.has(fileName)) {
                    seenImages.add(fileName);
                    extractedContentParts.push(`<div class="post-image-container" style="margin: 2rem 0; text-align: center;"><img src="${src}" style="max-width: 100%; border-radius: 8px;" /></div>`);
                 }
              }
           }
        }
      }
      
      const content = extractedContentParts.join('\n');
      console.log(`New content length: ${content.length}`);

      // Update post content
      await prisma.post.update({
        where: { slug },
        data: {
          content: content,
        }
      });
      console.log(`✅ Updated ${slug} content with better extraction.`);
    } else {
      console.log(`Skipped ${slug}, file not found.`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
