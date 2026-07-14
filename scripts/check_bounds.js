const fs = require('fs');

function getGridBounds(filepath) {
    const html = fs.readFileSync(filepath, 'utf8');
    const token = '2 min'; // known token from the static posts
    const index = html.indexOf(token);
    
    const sectionStart = html.lastIndexOf('<div class="block-layout block-layout--layout"', index);
    const nextSectionStart = html.indexOf('<section', index);
    let sectionEnd = html.lastIndexOf('</div>', nextSectionStart);
    // Include the </div>
    sectionEnd += 6;
    
    return { sectionStart, sectionEnd };
}

console.log('Blog bounds:', getGridBounds('public/pages/blog.html'));
console.log('Eventos bounds:', getGridBounds('public/pages/eventos.html'));
