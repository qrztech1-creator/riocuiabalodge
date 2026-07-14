const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Hero button is usually an 'a' or 'button' with data-qa="button"
let heroBtn = null;
$('[data-qa="button"], .button, button').each((i, el) => {
    if (i === 0) heroBtn = el; // first button is likely the hero one
});

if (heroBtn) {
    console.log("Hero Button text:", $(heroBtn).text().trim());
    console.log("Hero Button style:", $(heroBtn).attr('style'));
    console.log("Hero Button classes:", $(heroBtn).attr('class'));
    
    // Copy its classes to our newly created CTA
    let myCta = $('.instagram-cta-container > a');
    if (myCta.length) {
        myCta.attr('class', $(heroBtn).attr('class'));
        // Reset the inline styles we previously added so it assumes the hero style
        myCta.attr('style', '');
        fs.writeFileSync(file, $.html());
        console.log("Updated CTA styling to match hero.");
    }
}
