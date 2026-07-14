const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/pousada.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Find the section that has "VENHA APROVEITAR A MELHOR POUSADA"
let sectionVenha = null;
$('section').each((i, el) => {
    if ($(el).text().includes('VENHA APROVEITAR A MELHOR POUSADA DE CUIABÁ') || $(el).html().includes('VENHA APROVEITAR')) {
        sectionVenha = el;
    }
});

// Find the section that has the testimonials/photos. We can look for typical testimonial text or just look at the section right before it.
// Usually, it's the section immediately preceding the "VENHA APROVEITAR" one. 
// Let's verify by just logging the HTML of the preceding section.
if (sectionVenha) {
    let prev = $(sectionVenha).prev('section');
    if (prev.length) {
        // Swap them! We insert sectionVenha BEFORE prev.
        $(sectionVenha).insertBefore(prev);
        fs.writeFileSync(file, $.html());
        console.log('Swapped sections in pousada.html');
    }
}
