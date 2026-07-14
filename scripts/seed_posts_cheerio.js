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
        if (!fs.existsSync(file)) {
            console.log(`File not found: ${file}`);
            continue;
        }

        const html = fs.readFileSync(file, 'utf8');
        const $ = cheerio.load(html);

        // Find the main content section. Usually it's the section after the hero.
        // We can just find all text-box and image elements that are NOT in the header/footer.
        // Or find the specific section: z0YdBH or similar.
        // To be generic, let's find the section that is NOT "header", "stickyBar", "hero" (first visible), "footer".
        
        let contentHtml = '';
        
        // Find the <main> element
        const $main = $('main.page');
        if (!$main.length) continue;

        // Skip sticky bar and footer.
        // Usually, block 0 = sticky, block 1 = hero, block 2 = content, block 3 = footer
        const $sections = $main.children('section');
        
        // We know sticky bar has class 'block-sticky-bar'
        // Footer has class 'block--footer'
        // Hero has 'block--desktop-first-visible'
        let $contentSection = null;
        
        $sections.each((i, el) => {
            const $el = $(el);
            if ($el.hasClass('block-sticky-bar')) return;
            if ($el.hasClass('block--footer')) return;
            if ($el.hasClass('block--desktop-first-visible')) return;
            
            // If it's none of the above, it's the content section!
            $contentSection = $el;
        });

        if (!$contentSection) {
            console.log(`Could not identify content section for ${slug}`);
            continue;
        }

        // Now extract all text and images from this section, in DOM order!
        // Elements are usually inside .block__element
        const $elements = $contentSection.find('.block__element');
        
        // However, Zyro DOM order might NOT match visual order if it relies on CSS Grid grid-row/grid-column!
        // But usually, they are inserted in order. Let's try.
        $elements.each((i, el) => {
            const $el = $(el);
            if ($el.hasClass('text-box')) {
                contentHtml += $el.html() + '<br/>';
            } else if ($el.hasClass('grid-image')) {
                // Find img inside
                const $img = $el.find('img').first();
                // Usually Zyro images use data-src or src. Let's look for standard src or srcset.
                let src = $img.attr('src');
                if (src && !src.includes('data:image')) {
                    // Try to get original image URL without formatting parameters if possible, or just keep it
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
            console.log(`Updated post: ${slug}`);
        } else {
            console.log(`No content generated for ${slug}`);
        }
    }
}

seed().then(() => console.log('Done')).catch(console.error);
