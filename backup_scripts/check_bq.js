const fs = require('fs');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const cheerio = require('cheerio');
const $ = cheerio.load(html);

console.log($('blockquote').first().parent().html());
