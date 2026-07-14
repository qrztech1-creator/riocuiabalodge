const fs = require('fs');
const html = fs.readFileSync('public/pages/eventos.html', 'utf8');
const search = 'id="zQ-Jyn"';
const idx = html.indexOf(search);
console.log('Index of zQ-Jyn:', idx);
if (idx !== -1) {
    const end = html.indexOf('</div></div></section>', idx);
    console.log(html.substring(idx, end + 30));
}
