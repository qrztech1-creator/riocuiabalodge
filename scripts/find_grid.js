const fs = require('fs');

const findGridSection = (filepath) => {
    const html = fs.readFileSync(filepath, 'utf8');
    // Search for <h3 which is inside a card
    const h3Index = html.indexOf('<h3 style="font-size: 24px;');
    if (h3Index === -1) {
        console.log('Grid not found in ' + filepath);
        return;
    }
    
    // Find the enclosing section or block-layout
    const sectionStart = html.lastIndexOf('<div class="block-layout', h3Index);
    const nextSectionStart = html.indexOf('<section', h3Index);
    // Usually the block-layout ends before the next section
    const blockLayoutEnd = html.lastIndexOf('</div>', nextSectionStart);
    
    console.log(`\n\n--- GRID IN ${filepath} ---`);
    console.log('Starts at:', sectionStart);
    console.log(html.substring(sectionStart, sectionStart + 200));
};

findGridSection('public/pages/blog.html');
findGridSection('public/pages/eventos.html');
