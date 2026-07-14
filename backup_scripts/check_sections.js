const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_live.html', 'utf8');
const $ = cheerio.load(html);

$('section').each((i, el) => {
    let t = $(el).text().substring(0, 100).replace(/\n/g, ' ');
    console.log(`Section ${i+1}: ${t}`);
});
