const fs = require('fs');
const html = fs.readFileSync('public/pages/eventos.html', 'utf8');
const search = '<div id="app">';
const idx = html.indexOf(search);
if (idx !== -1) {
    console.log(html.substring(idx, idx + 200));
} else {
    console.log('Not found');
}
