const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');

const posts = [
    { slug: '10-dicas-para-pescar-dourado', url: 'https://riocuiabalodge.com.br/10-dicas-para-pescar-dourados', cat: 'NOTICIA' },
    { slug: 'pescaria-acontecendo', url: 'https://riocuiabalodge.com.br/pescaria-esportiva', cat: 'NOTICIA' },
    { slug: 'confraternizacao', url: 'https://riocuiabalodge.com.br/confraternizacao', cat: 'EVENTO' },
    { slug: 'eventos-corporativos', url: 'https://riocuiabalodge.com.br/eventos-corporativos', cat: 'EVENTO' },
    { slug: 'turismo-de-experiencia', url: 'https://riocuiabalodge.com.br/turismo-de-experiencia', cat: 'EVENTO' }
];

async function run() {
    for (const post of posts) {
        console.log(`Fetching ${post.url}...`);
        const res = await fetch(post.url);
        const html = await res.text();
        
        let content = '';
        
        // Extract texts from Zyro's script data
        const regex = /&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/g;
        let m;
        const seen = new Set();
        while ((m = regex.exec(html)) !== null) {
            let text = m[1]
                .replace(/\\&quot;/g, '"')
                .replace(/\\\\/g, '\\')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
                
            if ((text.includes('<p') || text.includes('<h')) 
                && !text.includes('Não fique de fora') 
                && !text.includes('Faça seu Orçamento') 
                && !text.includes('Rio Cuiabá Lodge ©')
                && !text.includes('POUSADA')
                && !text.includes('A POUSADA')
                && !text.includes('ATENDIMENTO')) {
                if (!seen.has(text)) {
                    content += text + '\n';
                    seen.add(text);
                }
            }
        }
        
        const $ = cheerio.load(html);
        $('.image__image').each((j, imgEl) => {
            let src = $(imgEl).attr('src');
            if (src && !src.includes('data:image') && !src.includes('logo')) {
                src = src.split('?')[0]; 
                content += `<p><img src="${src}" style="max-width:100%; border-radius:8px;" /></p>\n`;
            }
        });
        
        console.log(`Extracted ${content.length} bytes for ${post.slug}`);
        
        // Let's get the cover image correctly
        let coverImage = '';
        const coverEl = $('.block-hero img').first();
        if (coverEl.length) {
            coverImage = coverEl.attr('src').split('?')[0];
        } else {
            coverImage = $('.image__image').not('[src*="logo"]').first().attr('src');
            if(coverImage) coverImage = coverImage.split('?')[0];
        }
        
        // Ensure standard slug for the first one
        if (post.slug === '10-dicas-para-pescar-dourado') {
             await prisma.post.updateMany({
                where: { slug: '10-dicas-para-pescar-dourados' },
                data: { slug: '10-dicas-para-pescar-dourado' }
             });
        }

        await prisma.post.updateMany({
            where: { slug: post.slug },
            data: { 
                content: content,
                category: post.cat,
                ...(coverImage ? { coverImage: coverImage } : {})
            }
        });
        console.log(`Updated DB for ${post.slug}`);
    }
}

run().then(() => console.log('Done')).catch(console.error);
