const fs = require('fs');
const html = fs.readFileSync('public/pages/inicio.html', 'utf8');
console.log('Has API action?', html.includes('action="/api/'));
