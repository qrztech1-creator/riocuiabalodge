const fs = require('fs');
const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');
const matches = html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g);
for(const m of matches) {
  console.log(m[1]);
}
