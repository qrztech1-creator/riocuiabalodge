const fs = require('fs');
const cheerio = require('cheerio');
const pousada = fs.readFileSync('public/pages/pousada.html', 'utf8');

const $ = cheerio.load(pousada);
$('link[rel="stylesheet"]').each((i, el) => {
    console.log($(el).attr('href'));
});
