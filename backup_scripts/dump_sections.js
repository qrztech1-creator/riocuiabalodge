const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_live.html', 'utf8');
const $ = cheerio.load(html);

let out = '';
$('section').each((i, el) => {
    out += `\n=== SEÇÃO ${i+1} ===\n`;
    
    // Extract Texts
    let texts = [];
    $(el).find('h1, h2, h3, h4, h5, h6, p, a, button').each((j, textEl) => {
        let text = $(textEl).text().trim();
        if (text && !texts.includes(text)) {
            texts.push(text);
        }
    });
    if (texts.length > 0) {
        out += `Textos:\n- ${texts.join('\n- ')}\n`;
    }

    // Extract Media
    let media = [];
    $(el).find('img, video, iframe').each((j, mediaEl) => {
        let tag = mediaEl.tagName.toLowerCase();
        if (tag === 'img') {
            media.push(`IMAGEM: ${$(mediaEl).attr('src') || $(mediaEl).attr('srcset')}`);
        } else if (tag === 'video') {
            media.push(`VÍDEO: ${$(mediaEl).find('source').attr('src') || $(mediaEl).attr('src')}`);
        } else if (tag === 'iframe') {
            media.push(`IFRAME: ${$(mediaEl).attr('src')}`);
        }
    });
    if (media.length > 0) {
        out += `Mídias:\n- ${media.join('\n- ')}\n`;
    }
});

fs.writeFileSync('sections_dump.txt', out);
console.log('Dumped to sections_dump.txt');
