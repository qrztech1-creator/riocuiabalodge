const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

$('section').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    console.log(`\n--- Section ${i} ---`);
    console.log(text.substring(0, 100) + '...');
});
