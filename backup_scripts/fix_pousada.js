const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/pousada.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

let sectionLocalizada = null;
let sectionVenha = null;
let sectionVideos = null; // actually just the rest of the sections

$('section').each((i, el) => {
    const text = $(el).text();
    if (text.includes('Localizada a apenas 20 km do Aeroporto de Cuiabá')) {
        sectionLocalizada = el;
    }
    if (text.includes('VENHA APROVEITAR A MELHOR POUSADA DE CUIABÁ') || $(el).html().includes('VENHA APROVEITAR')) {
        sectionVenha = el;
    }
});

// The user wants:
// 1. sectionLocalizada
// 2. sectionVenha
// 3. other content

if (sectionLocalizada && sectionVenha) {
    // Insert sectionVenha right after sectionLocalizada
    $(sectionVenha).insertAfter(sectionLocalizada);
    fs.writeFileSync(file, $.html());
    console.log('Fixed pousada.html section order precisely');
} else {
    console.log('Could not find one of the sections:', {
        hasLocalizada: !!sectionLocalizada,
        hasVenha: !!sectionVenha
    });
}
