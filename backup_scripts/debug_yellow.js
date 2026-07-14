const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

const p = $('p:contains("Não fique de fora")');
console.log('Parent classes:');
console.log(p.parents().map((i, el) => $(el).attr('class')).get().join(' -> '));
