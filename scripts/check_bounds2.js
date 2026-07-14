const fs = require('fs');

function getGridBounds(filepath) {
    const html = fs.readFileSync(filepath, 'utf8');
    const token = '<h3 style="font-size: 24px;'; // known token
    const index = html.indexOf(token);
    if (index === -1) return null;
    
    const sectionStart = html.lastIndexOf('<div class="block-layout block-layout--layout"', index);
    const nextSectionStart = html.indexOf('<section', index);
    let sectionEnd = html.lastIndexOf('</div>', nextSectionStart);
    sectionEnd += 6;
    
    return { sectionStart, sectionEnd };
}

console.log('Blog bounds:', getGridBounds('public/pages/blog.html'));
console.log('Eventos bounds:', getGridBounds('public/pages/eventos.html'));
