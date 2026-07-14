const fs = require('fs');
const cheerio = require('cheerio');

// Check pescaria-acontecendo.html (the local saved page)
const html = fs.readFileSync('public/pages/pescaria-acontecendo.html', 'utf8');
const $ = cheerio.load(html);

const textBoxes = $('.text-box');
console.log('Text boxes found:', textBoxes.length);
textBoxes.each((i, el) => {
    const text = $(el).text().trim().substring(0, 200);
    if (text.length > 10) console.log(`TB${i}: ${text}`);
});

const imgs = $('img');
console.log('\nImages:', imgs.length);
imgs.each((i, el) => {
    const src = $(el).attr('src');
    if (src && !src.includes('data:image') && !src.includes('logo')) {
        console.log('IMG:', src.substring(0, 120));
    }
});

// Now check what the JSON data says
const contentRegex = /&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/g;
let m;
let contentBlocks = [];
while ((m = contentRegex.exec(html)) !== null) {
    let text = m[1]
        .replace(/\\&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    
    // Only keep substantive content
    if (text.length > 50 && (text.includes('<p') || text.includes('<h'))) {
        contentBlocks.push(text);
    }
}

console.log('\nContent blocks from JSON:', contentBlocks.length);
contentBlocks.forEach((block, i) => {
    // Strip HTML tags for readability
    const plain = block.replace(/<[^>]+>/g, '').substring(0, 200);
    console.log(`Block ${i}: ${plain}`);
});

// Check what page IDs exist
const pageIdRegex = /&quot;(z[A-Za-z0-9_-]+)&quot;:\[0,\{.*?&quot;type&quot;:\[0,&quot;(Block[A-Za-z]+)&quot;\]/g;
console.log('\nBlock IDs and types:');
while ((m = pageIdRegex.exec(html)) !== null) {
    console.log(`${m[1]}: ${m[2]}`);
}
