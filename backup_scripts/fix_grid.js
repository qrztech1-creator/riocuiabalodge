const fs = require('fs');

const postHtmlFile = 'public/pages/post.html';
let html = fs.readFileSync(postHtmlFile, 'utf8');

// Replace the specific grid CSS that caused the left alignment
html = html.replace('grid-area: 1 / 1 / 2 / 2;', 'grid-column: 1 / -1;\n  grid-row: 1 / -1;\n  align-self: start;');

fs.writeFileSync(postHtmlFile, html);
console.log('Fixed grid-area to span all columns');
