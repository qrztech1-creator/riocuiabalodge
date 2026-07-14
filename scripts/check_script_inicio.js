const fs = require('fs');
const html = fs.readFileSync('public/pages/inicio.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/g);
console.log(scripts[scripts.length - 1]);
