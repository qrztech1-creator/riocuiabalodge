const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
const html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

$('link[rel="stylesheet"]').each((i, el) => {
    let href = $(el).attr('href');
    if (href && href.startsWith('/_astro')) {
        $(el).attr('href', 'https://riocuiabalodge.com.br' + href);
    }
});

// Also, the original inicio.html might have had its own /assets/inicio/style.css
// I will check if that file exists on disk
if (fs.existsSync('public/assets/inicio/style.css')) {
    // If it does, make sure it's linked
    let hasLocalStyle = false;
    $('link[rel="stylesheet"]').each((i, el) => {
        if ($(el).attr('href').includes('assets/inicio/style.css')) hasLocalStyle = true;
    });
    if (!hasLocalStyle) {
        $('head').append('<link rel="stylesheet" href="/assets/inicio/style.css">');
    }
}

fs.writeFileSync(file, $.html());
console.log('Fixed relative CSS links in inicio.html');
