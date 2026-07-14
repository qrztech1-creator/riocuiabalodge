const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
console.log($('section').eq(1).html().substring(0, 1000));
