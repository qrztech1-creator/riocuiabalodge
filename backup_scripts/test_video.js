const fs = require('fs');
const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');
const match = html.match(/<video[^>]*src="([^"]+)"/);
console.log(match ? match[1] : 'No video');
