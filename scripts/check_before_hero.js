const fs = require('fs');
const html = fs.readFileSync('public/pages/10-dicas-para-pescar-dourado.html', 'utf8');
const id = 'zzY2Oo';
const start = html.indexOf(`<section id="${id}"`);
console.log(html.substring(start - 200, start));
