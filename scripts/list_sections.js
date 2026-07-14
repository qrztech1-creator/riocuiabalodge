const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const $ = cheerio.load(html);
$('main.page').children('section').each((i, el) => {
    console.log($(el).attr('id'), $(el).attr('class'));
});
