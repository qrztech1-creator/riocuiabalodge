const fs = require('fs');
const html = fs.readFileSync('../clone_pescaria-acontecendo/index.html', 'utf8');
const sections = html.split('<section id="');
for (let i = 1; i < sections.length; i++) {
  const imgs = sections[i].matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g);
  for (const match of imgs) {
    if (match[1].includes('imagem-do-whatsapp') || match[1].includes('2024')) {
      console.log('Section ' + i + ' has image ' + match[1].substring(0, 150));
    }
  }
}
