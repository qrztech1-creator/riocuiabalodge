const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));

$('section').each((i, el) => {
    let images = $(el).find('img');
    let text = $(el).text().substring(0, 100).replace(/\s+/g, ' ');
    console.log(`Sec ${i+1}: Imgs=${images.length}, Text="${text}"`);
});
