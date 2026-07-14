const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));

const sec = $('section').filter((i, el) => $(el).text().includes('Uma experiência única como você merece'));
console.log('Images in this section:', sec.find('img').length);
console.log('SVGs in this section:', sec.find('svg').length);
console.log('Text content:', sec.text().substring(0, 300).replace(/\s+/g, ' '));
