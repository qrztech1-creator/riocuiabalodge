const fs = require('fs');

const html = fs.readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8');

const regex = /<(p|h2|h3|h4|h5|h6)[^>]*class="(?:body|heading\d*|text-box\w*)[^"]*"[^>]*>([\s\S]*?)<\/\1>|<img[^>]*src="([^"]+)"[^>]*>/g;

let matches = [...html.matchAll(regex)];
for (const m of matches) {
  if (m[1]) {
    let text = m[2].trim().replace(/<[^>]+>/g, '');
    if (text.includes('Dicas para Pescar')) continue; // likely the title
    if (text.length > 20) console.log(`TEXT [${m[1]}]: ${text.substring(0, 30)}...`);
  } else if (m[3]) {
    const src = m[3];
    if (src.includes('captura') || src.includes('pesca')) {
      console.log(`IMAGE: ${src}`);
    }
  }
}
