const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const search = '10 Dicas para Pescar Dourado';
const idx = html.indexOf(search);
const substr = html.substring(Math.max(0, idx - 500), idx + 100);
console.log(substr);
