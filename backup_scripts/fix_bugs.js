const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');
const $ = cheerio.load(html);

// 1. Fix Hero Video missing
// We destroyed the background block's style. 
// I need to restore the iframe styles to exactly what it was when it worked, except add scale(1.5).
// Let's find the iframe.
let heroSection = null;
$('section').each((i, el) => {
    if ($(el).text().includes('A melhor aventura de pesca')) {
        heroSection = el;
    }
});

if (heroSection) {
    let iframe = $(heroSection).find('iframe');
    if (iframe.length) {
        // Restore iframe styling
        iframe.attr('style', 'pointer-events: none; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.5); z-index: -1; border: none;');
        
        // Restore parent styling - it should have its original Zyro variables.
        // Wait, if I overwrote the style completely, it's lost. But Zyro backgrounds usually have:
        // style="--21fe064a: rgb(26, 26, 26); ..." and no absolute positioning on the inline style because it's in classes.
        // Let's remove the absolute inline style I added to the parent.
        let parent = iframe.parent();
        let pstyle = parent.attr('style') || '';
        pstyle = pstyle.replace(/position:\s*absolute;?/g, '');
        pstyle = pstyle.replace(/top:\s*0;?/g, '');
        pstyle = pstyle.replace(/left:\s*0;?/g, '');
        pstyle = pstyle.replace(/width:\s*100%;?/g, '');
        pstyle = pstyle.replace(/height:\s*100%;?/g, '');
        pstyle = pstyle.replace(/overflow:\s*hidden;?/g, '');
        pstyle = pstyle.replace(/pointer-events:\s*none;?/g, '');
        pstyle = pstyle.replace(/z-index:\s*0;?/g, '');
        parent.attr('style', pstyle.trim());
    }
}

// 2. Fix the empty space below the video in "Garanta seu lugar..."
// We need to find the empty containers left over by the removed 6 images.
// Previously I did: $(sectionGaranta).find('.block-image').parent().remove();
// This leaves behind `.block-layout__grid` cells.
// Let's find `sectionGaranta` and remove any empty layout components.
let sectionGaranta = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Garanta seu lugar na melhor pousada')) {
        sectionGaranta = el;
    }
});

if (sectionGaranta) {
    // A clean way to remove empty space in Zyro grids is to look at the grid template rows.
    // However, it's easier to just find empty `div`s that have `grid-row` styles or classes and hide them.
    // Let's hide any layout element that has no text, no images, and no iframes.
    $(sectionGaranta).find('div[class*="layout-element"]').each((i, el) => {
        let text = $(el).text().trim();
        let hasImg = $(el).find('img').length > 0;
        let hasIframe = $(el).find('iframe').length > 0;
        let hasVideo = $(el).find('video').length > 0;
        
        if (text === '' && !hasImg && !hasIframe && !hasVideo) {
            $(el).attr('style', ($(el).attr('style') || '') + '; display: none !important;');
        }
    });

    // Also, the CTA button was inside the NEW instagram section.
    // If the user wants the CTA directly under the video in the SAME section (to fill the gap), let's move it!
    // But wait, they said: "e também ttem um espaço vazio abaixo do video da segunda seção.. ao inves de ir direto para o botão CTA"
    // This implies the space is between the video and the CTA. Hiding the empty elements above should fix this gap!
}

// 3. Fix WhatsApp overlap
// We just need to change the z-index of `.instagram-dedicated-section` from 100 to 1 or 0.
let igSection = $('.instagram-dedicated-section');
if (igSection.length) {
    let s = igSection.attr('style') || '';
    s = s.replace(/z-index:\s*100;?/g, 'z-index: 1;');
    igSection.attr('style', s);
}

fs.writeFileSync(file, $.html());
console.log('Fixed hero video, empty space, and z-index overlap.');
