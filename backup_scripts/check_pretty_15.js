const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
const sec15 = $('section').eq(14);
console.log('Images in sec 15:', sec15.find('img').length);
console.log('Form in sec 15:', sec15.find('form').length);
console.log(sec15.text().substring(0, 300).replace(/\s+/g, ' '));
