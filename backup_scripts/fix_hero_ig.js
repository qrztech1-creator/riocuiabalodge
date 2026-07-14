const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Fix YouTube Hero
// Let's find the hero iframe wrapper
let heroIframe = $('iframe.block-background__video--fixed');
if (heroIframe.length) {
    // Increase scale significantly to 1.5 to hide all controls/titles that flash on load
    let style = heroIframe.attr('style');
    style = style.replace(/scale\([0-9.]+\)/, 'scale(1.5)');
    if (!style.includes('scale')) {
        style = style.replace('transform: translate(-50%, -50%);', 'transform: translate(-50%, -50%) scale(1.5);');
    }
    heroIframe.attr('style', style);
    
    // Make sure the parent has overflow hidden
    heroIframe.parent().attr('style', heroIframe.parent().attr('style') + '; overflow: hidden;');
}

// Fix Instagram layout
// User wants EXACTLY 4 equal columns.
let igGrid = $('.instagram-grid');
if (igGrid.length) {
    igGrid.attr('style', 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; align-items: start;');
}

// Fix Instagram invisible issue
// Sometimes the script tag needs to be injected in the <head> or it fails because of async timing.
// We will also use the raw blockquote html without the extra wrapper, just in case the wrapper broke it.
$('.instagram-wrapper').each((i, el) => {
    // Un-wrap it
    let bq = $(el).find('blockquote');
    $(el).replaceWith(bq);
});

// Remove old script tags we added
$('script[src*="instagram.com/embed.js"]').remove();
$('script:contains("window.instgrm")').remove();

// Add the instagram script to the end of the body
$('body').append('<script async src="https://www.instagram.com/embed.js"></script>');

fs.writeFileSync(file, $.html());
console.log('Fixed youtube hero and instagram grid in inicio.html');
