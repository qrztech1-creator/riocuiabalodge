const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const s = html.substring(html.indexOf('<section id="zzY2Oo"'), html.indexOf('<section id="zzY2Oo"') + 400);
console.log(s);
