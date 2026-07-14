const fs = require('fs');
const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');

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
        
        fs.writeFileSync('innerHtml.txt', innerHtml);
        console.log("Written innerHtml.txt");
    }
}
