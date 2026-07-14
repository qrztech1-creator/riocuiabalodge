const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');

async function run() {
    // 1. Get 10-dicas from out_pescaria.html
    const html10dicas = fs.readFileSync('out_pescaria.html', 'utf8');
    let content10dicas = '';
    const regex = /&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/g;
    let m;
    const seen = new Set();
    while ((m = regex.exec(html10dicas)) !== null) {
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
                content10dicas += text + '\n';
                seen.add(text);
            }
        }
    }
    const $10dicas = cheerio.load(html10dicas);
    $10dicas('.image__image').each((j, imgEl) => {
        let src = $10dicas(imgEl).attr('src');
        if (src && !src.includes('data:image') && !src.includes('logo')) {
            src = src.split('?')[0]; 
            content10dicas += `<p><img src="${src}" style="max-width:100%; border-radius:8px;" /></p>\n`;
        }
    });

    await prisma.post.updateMany({
        where: { slug: '10-dicas-para-pescar-dourado' },
        data: { content: content10dicas }
    });
    console.log('Updated 10-dicas-para-pescar-dourado');

    // 2. Fix Pescaria Acontecendo
    const contentPescaria = '<p class="body" style="color: rgb(26, 26, 26); --lineHeightDesktop: 1.3; --fontSizeDesktop: 32px" dir="auto"><span style="font-family: Oswald; font-weight: 500">PESCARIA ACONTECENDO</span></p><p>Confira como estão as pescarias nesta temporada.</p>';
    await prisma.post.updateMany({
        where: { slug: 'pescaria-acontecendo' },
        data: { content: contentPescaria }
    });
    console.log('Updated pescaria-acontecendo');

    console.log('Done');
}

run().catch(console.error);
