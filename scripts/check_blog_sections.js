const fs = require('fs');
const html = fs.readFileSync('public/pages/blog.html', 'utf8');
const m = html.match(/<section id="([^"]+)"/g);
console.log(m);
