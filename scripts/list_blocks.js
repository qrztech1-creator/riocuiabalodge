const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const $ = cheerio.load(html);
$('.page > div > section, .page > section, section.block').each((i, el) => {
    console.log($(el).attr('id'), $(el).attr('class'));
});
