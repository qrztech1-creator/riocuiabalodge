const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);
let heroSection = null;
$('section').each((i, el) => {
    if ($(el).text().includes('A melhor aventura de pesca')) {
        heroSection = el;
    }
});
if (heroSection) {
    let iframeHTML = $(heroSection).find('iframe').parent().html();
    console.log(iframeHTML);
}
