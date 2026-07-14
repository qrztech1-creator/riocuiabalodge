const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio_pretty.html', 'utf8'));
console.log('Header:');
console.log($('header').html()?.substring(0, 500) || 'no header');
console.log('Section 0:');
console.log($('section').eq(0).html()?.substring(0, 500) || 'no section 0');
