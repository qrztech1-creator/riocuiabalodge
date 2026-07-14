const fs = require('fs');
const html = fs.readFileSync('../clone_pescaria-acontecendo/index.html', 'utf8');
const sections = html.split('<section id="');
const section2 = '<section id="' + sections[2];
const regex = /<img[^>]*class="[^"]*image[^"]*"[^>]*src="([^"]+)"[^>]*>/g;
const m = [...section2.matchAll(regex)];
console.log('Matches:', m.length);
if (m.length > 0) {
  console.log('First match:', m[0][1]);
}
