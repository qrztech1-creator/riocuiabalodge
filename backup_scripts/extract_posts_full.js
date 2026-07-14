const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugs = [
    '10-dicas-para-pescar-dourado',
    'pescaria-acontecendo',
    'confraternizacao',
    'eventos-corporativos',
    'turismo-de-experiencia'
];

async function main() {
    for (const slug of slugs) {
        const htmlPath = path.join(__dirname, `../clone_${slug}`, 'index.html');
        if (!fs.existsSync(htmlPath)) {
            console.log(`Skipping ${slug}, no clone found.`);
            continue;
        }
        
        const html = fs.readFileSync(htmlPath, 'utf8');
        const sections = Array.from(html.matchAll(/<section id="([^"]+)"[^>]*>/g));
        if (sections.length < 2) continue;
        
        const contentSection = sections[1];
        const s2Start = contentSection.index;
        const nextSection = sections[2];
        const s2End = nextSection ? nextSection.index : html.length;
        const sectionHtml = html.substring(s2Start, s2End);
        
        let finalHtml = '';

        // Find all layout-element components
        // Zyro structure: <div class="layout-element ..."> ... <div class="... layout-element__component ...">
        
        // Since we know the structure, let's just find Images and TextBoxes
        // In Zyro, GridImage and GridTextBox are the components.
        
        const elementRegex = /<div[^>]*class="[^"]*layout-element__component[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<!---->\s*<!---->\s*(?:<!---->\s*)*<!--\[-->/g;
        // The above regex might be too fragile.
        
        // Let's use a simpler approach. We know the text-box class and the image class.
        // Image: <div ... class="image-wrapper ... GridImage"> ... <img src="..." /> ... </div>
        // Text: <div ... class="text-box ... GridTextBox"> ... </div>
        
        // Find all imgs in the section
        const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/g;
        let match;
        const images = [];
        while ((match = imgRegex.exec(sectionHtml)) !== null) {
            // Ignore small srcset images if any, Zyro usually has one main img tag per GridImage
            // Wait, Zyro has two image wrappers for desktop and mobile inside GridImage!
            // class="image-wrapper--desktop" and class="image-wrapper--mobile"
            if (match[0].includes('image__image')) {
                // To avoid duplicates, we can check if we already added this src
                if (!images.includes(match[1])) {
                    images.push(match[1]);
                }
            }
        }
        
        // Find the GridTextBox which contains the actual text
        let textContent = '';
        const textBoxStartStr = '<div class="text-box layout-element__component layout-element__component--GridTextBox"';
        const tbStart = sectionHtml.indexOf(textBoxStartStr);
        if (tbStart !== -1) {
            let start = sectionHtml.indexOf('>', tbStart) + 1;
            const nextDiv = sectionHtml.indexOf('</div>', start); // Assuming no nested divs in text
            textContent = sectionHtml.substring(start, nextDiv).trim();
        }

        // Reconstruct cleanly
        for (const imgUrl of images) {
            finalHtml += `<div class="post-image-container" style="margin-bottom: 2rem;"><img src="${imgUrl}" alt="Post image" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" /></div>\n`;
        }
        
        finalHtml += `<div class="post-text-content" style="color: #1a1a1a;">${textContent}</div>`;
        
        console.log(`Updating ${slug} with ${images.length} images and text length ${textContent.length}`);
        
        await prisma.post.update({
            where: { slug: slug },
            data: { content: finalHtml }
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
