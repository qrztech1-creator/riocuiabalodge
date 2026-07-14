const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_live.html', 'utf8');

const $ = cheerio.load(html);
$('link[rel="stylesheet"]').each((i, el) => {
    console.log($(el).attr('href'));
});
