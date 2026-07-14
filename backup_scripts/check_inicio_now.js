const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio.html', 'utf8'));
console.log('iframe style:', $('iframe').first().attr('style'));
console.log('parent style:', $('iframe').first().parent().attr('style'));
