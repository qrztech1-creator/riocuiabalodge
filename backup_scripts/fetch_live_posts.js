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
        console.log(`Fetching https://riocuiabalodge.com.br/${slug}...`);
        const res = await fetch(`https://riocuiabalodge.com.br/${slug}`);
        if (!res.ok) {
            console.log(`Failed to fetch ${slug}: ${res.status}`);
            continue;
        }
        const html = await res.text();
        
        const sections = Array.from(html.matchAll(/<section id="([^"]+)"[^>]*>/g));
        if (sections.length >= 2) {
            const contentSection = sections[1];
            const s2Start = contentSection.index;
            const nextSection = sections[2];
            const s2End = nextSection ? nextSection.index : html.length;
            
            const sectionHtml = html.substring(s2Start, s2End);
            
            const blockStart = sectionHtml.indexOf('<div class="block-layout block-layout--layout"');
            if (blockStart !== -1) {
                const blockContentStart = sectionHtml.indexOf('>', blockStart) + 1;
                
                let innerHtml = sectionHtml.substring(blockContentStart);
                innerHtml = innerHtml.replace(/<\/div>\s*(<!--.*?-->\s*)*<\/section>\s*$/, '');
                
                console.log(`Successfully extracted inner HTML for ${slug}. Length: ${innerHtml.length}`);
                
                const heroSectionStart = sections[0].index;
                const heroSectionHtml = html.substring(heroSectionStart, s2Start);
                const imgMatch = heroSectionHtml.match(/<img[^>]*src="([^"]+)"/);
                const videoMatch = heroSectionHtml.match(/<video[^>]*src="([^"]+)"/);
                let coverImage = null;
                if (videoMatch) {
                    coverImage = videoMatch[1];
                    console.log(`Found video cover: ${coverImage}`);
                } else if (imgMatch) {
                    coverImage = imgMatch[1];
                    console.log(`Found image cover: ${coverImage}`);
                }
                
                const updateData = { content: innerHtml.trim() };
                if (coverImage) {
                    updateData.coverImage = coverImage;
                }
                
                await prisma.post.update({
                    where: { slug: slug },
                    data: updateData
                });
                console.log(`Updated ${slug} in DB successfully.`);
            } else {
                console.log(`Could not find block-layout for ${slug}`);
            }
        } else {
            console.log(`Could not find at least 2 sections for ${slug}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
