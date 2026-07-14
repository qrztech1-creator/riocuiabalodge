const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
const html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

$('img, source, a').each((i, el) => {
    let src = $(el).attr('src');
    if (src && src.startsWith('/assets/')) {
        $(el).attr('src', 'https://riocuiabalodge.com.br' + src);
    }
    let srcset = $(el).attr('srcset');
    if (srcset && srcset.includes('/assets/')) {
        $(el).attr('srcset', srcset.replace(/\/_astro\//g, 'https://riocuiabalodge.com.br/_astro/').replace(/\/assets\//g, 'https://riocuiabalodge.com.br/assets/'));
    }
    let href = $(el).attr('href');
    if (href && href.startsWith('/assets/')) {
        $(el).attr('href', 'https://riocuiabalodge.com.br' + href);
    }
});

// also fix background-images in inline styles that point to relative paths
$('[style*="url("]').each((i, el) => {
    let style = $(el).attr('style');
    if (style.includes('url(/assets/') || style.includes('url("/assets/')) {
        style = style.replace(/url\(['"]?\/assets\//g, 'url(https://riocuiabalodge.com.br/assets/');
        $(el).attr('style', style);
    }
});

fs.writeFileSync(file, $.html());
console.log('Fixed relative asset links in inicio.html');
