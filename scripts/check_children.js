const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const $ = cheerio.load(html);
$('#z0YdBH .block-layout').children().each((i, el) => { 
    console.log($(el).find('[id]').attr('id') || 'no id'); 
});
