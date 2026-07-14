const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const search = '10 Dicas para Pescar Dourado';
let startIndex = 0;
while (true) {
    const idx = html.indexOf(search, startIndex);
    if (idx === -1) break;
    const sub = html.substring(Math.max(0, idx - 100), idx + search.length + 50);
    console.log("MATCH AT " + idx + ":\n" + sub + "\n----------");
    startIndex = idx + search.length;
}
