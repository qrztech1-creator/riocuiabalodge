const fs = require('fs');
const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');
const s = html.substring(html.indexOf('<section id="z0YdBH"'), html.indexOf('</section>', html.indexOf('<section id="z0YdBH"')) + 10);
console.log(s.substring(0, 500));
