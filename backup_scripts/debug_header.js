const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

console.log('Sticky bars:', $('.block-sticky-bar').length);
console.log('Headers:', $('header').length);
console.log('Header classes:', $('header').attr('class'));
