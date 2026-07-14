const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);
let firstSectionHTML = $('section').first().html();
console.log(firstSectionHTML.substring(0, 1500));
