const fs = require('fs');
const html = fs.readFileSync('public/pages/eventos.html', 'utf8');
const regex = /<astro-island[^>]*>/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0].substring(0, 100));
}
