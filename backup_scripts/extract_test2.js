const fs = require('fs');
const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');

const sections = Array.from(html.matchAll(/<section id="([^"]+)"[^>]*>/g));
if (sections.length >= 2) {
    const contentSection = sections[1];
    const s2Start = contentSection.index;
    const nextSection = sections[2];
    const s2End = nextSection ? nextSection.index : html.length;
    
    const sectionHtml = html.substring(s2Start, s2End);
    fs.writeFileSync('sectionHtml.txt', sectionHtml);
    console.log("Written sectionHtml.txt length:", sectionHtml.length);
}
