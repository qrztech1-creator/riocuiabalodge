const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
const sec = $('section').eq(3);
console.log(sec.html().substring(0, 500));
console.log('Instagram in Sec 4:', sec.html().includes('instagram-media'));
