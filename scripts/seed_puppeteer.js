const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const posts = [
    { slug: '10-dicas-para-pescar-dourado', url: 'https://riocuiabalodge.com.br/10-dicas-para-pescar-dourados', cat: 'NOTICIA' },
    { slug: 'pescaria-acontecendo', url: 'https://riocuiabalodge.com.br/pescaria-esportiva', cat: 'NOTICIA' }
];

async function run() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    for (const post of posts) {
        console.log(`Fetching ${post.url}...`);
        await page.goto(post.url, { waitUntil: 'networkidle2' });
        
        const data = await page.evaluate(() => {
            let contentHtml = '';
            
            // Get all text boxes
            const textBoxes = document.querySelectorAll('.text-box');
            textBoxes.forEach(el => {
                const text = el.innerText;
                // Exclude known footer/header stuff
                if (text.includes('Não fique de fora') || 
                    text.includes('Rio Cuiabá Lodge ©') || 
                    text.includes('Faça seu Orçamento') ||
                    text.includes('A POUSADA') ||
                    text.includes('ATENDIMENTO')) {
                    return;
                }
                contentHtml += el.innerHTML + '<br/>';
            });
            
            const images = document.querySelectorAll('.grid-image img');
            images.forEach(img => {
                if (img.src && !img.src.startsWith('data:image') && !img.src.includes('logo')) {
                    contentHtml += `<p><img src="${img.src.split('?')[0]}" style="max-width:100%; border-radius:8px;"/></p><br/>`;
                }
            });
            
            let coverImage = '';
            const heroImg = document.querySelector('.block-hero img');
            if (heroImg) {
                coverImage = heroImg.src.split('?')[0];
            } else {
                const img = document.querySelector('.image__image:not([src*="logo"])');
                if (img) coverImage = img.src.split('?')[0];
            }
            
            return { contentHtml, coverImage };
        });

        console.log(`Extracted length: ${data.contentHtml.length}`);
        if (data.contentHtml.length > 0) {
            await prisma.post.updateMany({
                where: { slug: post.slug },
                data: {
                    content: data.contentHtml,
                    category: post.cat,
                    ...(data.coverImage ? { coverImage: data.coverImage } : {})
                }
            });
            console.log(`Updated DB for ${post.slug}`);
        }
    }
    
    await browser.close();
}

run().then(() => console.log('Done')).catch(console.error);
