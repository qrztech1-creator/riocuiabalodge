const fs = require('fs');
const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');
const sections = html.split('<section id="');
for (const s of sections) {
    if (s.startsWith('zzY2Oo')) {
        console.log(s);
    }
}
