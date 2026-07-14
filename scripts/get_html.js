const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/eventos.html', 'utf8');
const $ = cheerio.load(html);
console.log($('#zQ-Jyn').html().substring(0, 500));
