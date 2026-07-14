const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
$('section').each((i, el) => {
    console.log('Section ' + (i+1) + ': ' + $(el).text().substring(0, 100).replace(/\n/g, ' '));
});
