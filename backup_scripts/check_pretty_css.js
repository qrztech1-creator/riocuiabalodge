const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
$('link[rel="stylesheet"]').each((i, el) => console.log($(el).attr('href')));
