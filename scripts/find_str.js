const fs = require('fs');
const html = fs.readFileSync('out_pescaria.html', 'utf8');

let count = 0;
const search = '10 Dicas para Pescar Dourado';
let startIndex = 0;
while (true) {
    const idx = html.indexOf(search, startIndex);
    if (idx === -1) break;
    count++;
    console.log("MATCH AT " + idx + ": " + html.substring(Math.max(0, idx - 50), idx + 50));
    startIndex = idx + search.length;
}
console.log("Total occurrences:", count);
