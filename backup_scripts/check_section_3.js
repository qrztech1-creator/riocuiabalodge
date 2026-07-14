const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_live.html', 'utf8'));
$('section').each((i,el) => { 
    if($(el).text().includes('Garanta seu lugar')) {
        console.log('Images in Garanta seu lugar:', $(el).find('img').length);
    }
});
