const html = require('fs').readFileSync('public/pages/inicio.html', 'utf8');
const start = html.indexOf('const response = await fetch(');
console.log(html.substring(start + 800, start + 1600));
