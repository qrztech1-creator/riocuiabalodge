const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
console.log('Iframe count:', $('iframe').length);
console.log('First iframe src:', $('iframe').first().attr('src'));
