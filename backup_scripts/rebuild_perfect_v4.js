const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

// 1. Fix CSS Links (leave as is, they are already pointing to live/local correctly, but add our overrides)
const customCss = `
<style>
/* Header and Top Bar */
.block-sticky-bar__background { background-color: transparent !important; transition: background-color 0.3s; }
.block-sticky-bar-layout { padding-top: 5px !important; padding-bottom: 5px !important; }
.scrolled .block-sticky-bar__background { background-color: rgba(0,0,0,0.85) !important; }
header { position: fixed !important; top: 0; left: 0; right: 0; z-index: 1000 !important; }

/* Thin Yellow Bar - we'll target the first section */
section:first-of-type { padding: 5px 0 !important; max-height: 40px !important; }
section:first-of-type * { font-size: 14px !important; }

/* Hero Video Controls Fix */
.block-background__video--fixed { 
    transform: translate(-50%, -50%) scale(2.5) !important; 
    pointer-events: none !important;
}

/* Instagram Grid */
.custom-ig-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
    margin-top: 30px;
}
@media (max-width: 900px) {
    .custom-ig-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 600px) {
    .custom-ig-grid { grid-template-columns: 1fr !important; }
}
.custom-ig-grid blockquote {
    margin: 0 !important; width: 100% !important; min-width: 100% !important;
}

/* Fix Pesca Esportiva / A Pousada layout if broken */
/* We force them to be side-by-side using flexbox if Zyro grid failed */
@media (min-width: 768px) {
    .force-flex-row { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 40px; padding: 40px 20px; }
    .force-flex-row > div { flex: 1; }
}
</style>
`;

$('head').append(customCss);

// 2. Add Scroll Script for Header
const customJs = `
<script>
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});
</script>
`;
$('body').append(customJs);

// 3. Make sure Hero video has scale(2.5)
const heroVideo = $('iframe').first();
if (heroVideo.length) {
    let style = heroVideo.attr('style') || '';
    heroVideo.attr('style', style + ' transform: translate(-50%, -50%) scale(2.5); pointer-events: none; z-index: -1;');
}

// 4. Ensure Instagram Grid class is present
const igGrid = $('blockquote.instagram-media').parent();
if (igGrid.length && !igGrid.hasClass('custom-ig-grid')) {
    igGrid.addClass('custom-ig-grid');
}

// 5. Fix Pesca Esportiva layout
// We will look for sections with 'Pesca Esportiva' and 'A Pousada' and ensure they look good
$('section').each((i, el) => {
    const text = $(el).text();
    if (text.includes('Pesca Esportiva') || text.includes('A Pousada')) {
        const layout = $(el).find('div[class*="layout-desktop"]');
        if (layout.length) {
            layout.addClass('force-flex-row');
        }
    }
});

// 6. Delete old broken sections if any (We rely on inicio_pretty being clean, but let's check for duplicate IG grids)
// Only keep one IG grid
const allIgs = $('.custom-ig-grid');
if (allIgs.length > 1) {
    allIgs.not(':first').remove();
}

// Write the fixed HTML to inicio.html
fs.writeFileSync('public/pages/inicio.html', $.html());
console.log('Successfully rebuilt inicio.html');
