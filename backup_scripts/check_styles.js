const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);
$('style').each((i, el) => console.log('Style ' + i + ': ' + $(el).html().substring(0, 100)));
