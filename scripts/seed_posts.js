const fs = require('fs');
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
        
        // Extract pageData JSON using regex
        const searchStr = 'props="{&quot;pageData&quot;:';
        const startIndex = html.indexOf(searchStr);
        if (startIndex === -1) {
            console.log(`pageData not found in ${slug}`);
            continue;
        }

        const jsonStart = startIndex + searchStr.length;
        const endStr = '}]}" ssr client=';
        const endIndexMatches = html.indexOf(endStr, jsonStart);
        
        if (endIndexMatches === -1) {
            console.log(`End of pageData not found in ${slug}`);
            continue;
        }

        let jsonStr = html.substring(jsonStart, endIndexMatches + 2);
        jsonStr = jsonStr.replace(/&quot;/g, '"');
        
        let parsed;
        try {
            parsed = JSON.parse(jsonStr)[1];
        } catch (e) {
            console.log(`Parse error for ${slug}`);
            continue;
        }

        // The current page ID is usually zbLn2C, but it might differ.
        // Let's find the page ID from the blocks list or just look at all elements.
        // Actually, Zyro stores all elements in `parsed.elements`.
        // The elements on the current page are the ones that are inside the blocks of this page.
        // Let's just find the current page ID from `parsed.currentPageId`!
        let pageId = parsed.currentPageId[1];
        let blocks = parsed.pages[1][pageId][1].blocks[1].map(b => b[1]);

        let elements = [];

        for (const blockId of blocks) {
            // Get elements for this block
            const blockData = parsed.blocks[1][blockId][1];
            if (!blockData.components) continue;
            
            const components = blockData.components[1];
            for (const compId of components) {
                const el = parsed.elements[compId][1];
                
                // Get the Y position on desktop
                const top = el.desktop[1].top ? el.desktop[1].top[1] : 0;
                
                elements.push({
                    type: el.type[1],
                    data: el,
                    top: top
                });
            }
        }

        // Sort elements by vertical position
        elements.sort((a, b) => a.top - b.top);

        let finalHtml = '';
        for (const el of elements) {
            if (el.type === 'GridTextBox' && el.data.content) {
                // Decode HTML entities for < and > if they are encoded. Actually they are just raw strings because JSON.parse handled it.
                // But Zyro stores it as raw HTML.
                finalHtml += el.data.content[1] + '<br/>';
            } else if (el.type === 'GridImage' && el.data.src) {
                const src = el.data.src[1];
                finalHtml += `<img src="${src}" /><br/>`;
            } else if (el.type === 'GridVideo' && el.data.videoSrc) {
                 // For videos, maybe just an iframe or skip. Or standard video.
                 finalHtml += `<video controls src="${el.data.videoSrc[1]}" style="width:100%;"></video><br/>`;
            }
        }

        if (finalHtml) {
            await prisma.post.updateMany({
                where: { slug },
                data: { content: finalHtml }
            });
            console.log(`Updated post: ${slug}`);
        } else {
            console.log(`No content generated for ${slug}`);
        }
    }
}

seed().then(() => console.log('Done')).catch(console.error);
