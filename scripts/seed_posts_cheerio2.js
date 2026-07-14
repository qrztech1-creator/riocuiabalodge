const fs = require('fs');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugs = [
    '10-dicas-para-pescar-dourado',
    'pescaria-acontecendo',
    'confraternizacao',
    'eventos-corporativos',
    'turismo-de-experiencia'
];

async function seed() {
    for (const slug of slugs) {
        const file = `public/pages/${slug}.html`;
        if (!fs.existsSync(file)) continue;

        const html = fs.readFileSync(file, 'utf8');
        const $ = cheerio.load(html);

        let contentHtml = '';
        
        // Find all text boxes and grid images in the page
        // But we want to exclude the header, hero, footer.
        // Actually, the main content is inside a specific block. Let's just grab the block with the most text-boxes!
        const $blocks = $('.page > div > section, .page > section, section.block');
        
        let bestBlock = null;
        let maxTextBoxes = -1;

        $blocks.each((i, el) => {
            const $el = $(el);
            // Ignore header, footer, hero
            if ($el.hasClass('block-sticky-bar') || $el.hasClass('block--footer') || $el.hasClass('block--desktop-first-visible')) {
                return;
            }
            const tbCount = $el.find('.text-box').length;
            if (tbCount > maxTextBoxes) {
                maxTextBoxes = tbCount;
                bestBlock = $el;
            }
        });

        if (!bestBlock) {
            console.log(`No best block for ${slug}`);
            continue;
        }

        // Now extract
        const $elements = bestBlock.find('.text-box, .grid-image, .grid-video');
        $elements.each((i, el) => {
            const $el = $(el);
            if ($el.hasClass('text-box')) {
                contentHtml += $el.html() + '<br/>';
            } else if ($el.hasClass('grid-image')) {
                const src = $el.find('img').attr('src');
                if (src && !src.startsWith('data:image')) {
                    contentHtml += `<img src="${src}" /><br/>`;
                }
            } else if ($el.hasClass('grid-video')) {
                const src = $el.find('video').attr('src');
                if (src) contentHtml += `<video controls src="${src}" style="width:100%;"></video><br/>`;
            }
        });

        if (contentHtml) {
            await prisma.post.updateMany({
                where: { slug },
                data: { content: contentHtml }
            });
            console.log(`Updated post: ${slug} (length: ${contentHtml.length})`);
        } else {
            console.log(`No content for ${slug}`);
        }
    }
}

seed().then(() => console.log('Done')).catch(console.error);
