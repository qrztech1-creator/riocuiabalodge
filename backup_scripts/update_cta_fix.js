const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Revert the previous mistake
let myCta = $('.instagram-cta-container > a');

// Let's find a button that says 'VER' or something similar
let realHeroBtn = null;
$('a').each((i, el) => {
    let t = $(el).text().trim().toUpperCase();
    if (t.includes('RESERVAR') || t.includes('CONHECER') || t.includes('DATAS') || t.includes('ROTEIRO') || t.includes('VER')) {
        // likely a real CTA
        realHeroBtn = el;
        return false; // break
    }
});

if (realHeroBtn) {
    console.log("Real Hero Button text:", $(realHeroBtn).text().trim());
    console.log("Real Hero Button style:", $(realHeroBtn).attr('style'));
    console.log("Real Hero Button classes:", $(realHeroBtn).attr('class'));
    
    if (myCta.length) {
        myCta.attr('class', $(realHeroBtn).attr('class'));
        // Zyro buttons have styles in CSS variables usually.
        // I will just add the button-primary classes
        // In Zyro, button classes usually look like `button button--primary`
        // We'll just clone the class attribute.
        fs.writeFileSync(file, $.html());
        console.log("Updated CTA styling to match real hero button.");
    }
} else {
    // Fallback: manually set it to look like a Zyro button
    myCta.attr('class', 'block-button button button--primary');
    myCta.attr('style', 'display: inline-flex; align-items: center; justify-content: center; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;');
    fs.writeFileSync(file, $.html());
    console.log("Applied manual button styling");
}
