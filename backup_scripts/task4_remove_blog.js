const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Find the section that contains "TUDO ISSO COM UMA EQUIPE"
let sectionTudoIsso = null;
$('section').each((i, el) => {
    if ($(el).text().includes('TUDO ISSO COM UMA EQUIPE')) {
        sectionTudoIsso = el;
    }
});

// Find the section containing "Birdwatching e turismo"
let sectionBird = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Birdwatching e turismo na porta de entrada do Pantanal!')) {
        sectionBird = el;
    }
});

if (sectionTudoIsso && sectionBird) {
    // The blog section is usually between these two or right after sectionBird.
    // Zyro uses <section> tags. We can find all sections between sectionBird and sectionTudoIsso and remove them.
    let current = $(sectionBird).next('section');
    while (current.length && current[0] !== sectionTudoIsso) {
        let next = current.next('section');
        current.remove();
        current = next;
    }
    
    // Check if the blog injected script needs to be removed
    // <script id="inject-blog-css" ...
    $('script#inject-blog-css').remove();
    // E.g. we might have the blog script logic that runs, but actually removing the container is enough.
}

fs.writeFileSync(file, $.html());
console.log('Removed blog section from inicio.html');
