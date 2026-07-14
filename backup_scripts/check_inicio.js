const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);
$('.instagram-cta-section').remove();

let sectionGaranta = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Garanta seu lugar na melhor pousada de Cuiabá') || $(el).text().includes('Garanta seu lugar na melhor pousada')) {
        sectionGaranta = el;
    }
});

if (sectionGaranta) {
    console.log($(sectionGaranta).html().substring(0, 500));
    // Let's find images and video inside this section
    console.log("Images found: ", $(sectionGaranta).find('img').length);
    console.log("Videos found: ", $(sectionGaranta).find('video').length);
    console.log("Iframes found: ", $(sectionGaranta).find('iframe').length);
}
