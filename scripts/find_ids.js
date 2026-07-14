const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/eventos.html', 'utf8');
const $ = cheerio.load(html);
$('#zQ-Jyn .block-layout').children().each((i, el) => {
    console.log($(el).find('[id]').attr('id'));
});
