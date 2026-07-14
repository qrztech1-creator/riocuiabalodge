const fs = require('fs');
const html = fs.readFileSync('out_pescaria.html', 'utf8');
const search = '&quot;z15bpT&quot;:';
const idx = html.indexOf(search);
if (idx !== -1) {
    console.log(html.substring(idx, idx + 1000));
} else {
    console.log('Not found');
}
