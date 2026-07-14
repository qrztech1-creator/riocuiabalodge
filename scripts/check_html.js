const fs = require('fs');
const html = fs.readFileSync('public/pages/eventos.html', 'utf8');
const idx = html.indexOf('id="zQ-Jyn"');
console.log(html.substring(Math.max(0, idx - 500), idx + 200));
