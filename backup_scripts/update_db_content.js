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
        
        // Find the GridTextBox which contains the actual text
        const textBoxStartStr = '<div class="text-box layout-element__component layout-element__component--GridTextBox"';
        const tbStart = sectionHtml.indexOf(textBoxStartStr);
        if (tbStart !== -1) {
            let start = sectionHtml.indexOf('>', tbStart) + 1;
            // The content might end where its parent div ends
            // But let's just find the closing </div> of this text-box.
            // Since it contains multiple <p> tags and NO nested <div> tags in Zyro text blocks.
            const nextDiv = sectionHtml.indexOf('</div>', start);
            
            // To be safe, Zyro text components usually don't have nested divs.
            // Let's extract until the first </div>
            let textHtml = sectionHtml.substring(start, nextDiv);
            
            console.log(`Updating ${slug} with length ${textHtml.length}`);
            
            await prisma.post.update({
                where: { slug: slug },
                data: { content: textHtml.trim() }
            });
        } else {
            console.log(`No text box found for ${slug}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
