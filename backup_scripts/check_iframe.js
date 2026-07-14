const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio.html', 'utf8'));
console.log($('iframe').first().attr('style'));
