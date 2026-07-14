const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// 1. YouTube Fixes
let heroIframe = $('iframe.block-background__video--fixed');
if (heroIframe.length) {
    // Ensure iframe is huge so controls are off-screen
    let style = heroIframe.attr('style') || '';
    style = style.replace(/scale\([0-9.]+\)/g, ''); // strip old scale
    style = style.replace(/transform:\s*translate\(-50%,\s*-50%\);?/g, 'transform: translate(-50%, -50%) scale(1.6) !important;');
    
    if (!style.includes('pointer-events')) style += ' pointer-events: none !important;';
    heroIframe.attr('style', style);
    
    // Ensure parent has overflow hidden
    let parent = heroIframe.parent();
    let parentStyle = parent.attr('style') || '';
    if (!parentStyle.includes('overflow')) {
        parentStyle += ' overflow: hidden !important;';
    } else {
        parentStyle = parentStyle.replace(/overflow:\s*[^;]+;?/g, 'overflow: hidden !important;');
    }
    // Also position absolute/relative to clip
    if (!parentStyle.includes('position')) {
        parentStyle += ' position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
    }
    parent.attr('style', parentStyle);
}

// 2. Instagram Fixes
// Remove height: 100% from blockquotes
$('blockquote.instagram-media').each((i, el) => {
    let s = $(el).attr('style') || '';
    s = s.replace(/height:\s*100%;?/g, '');
    $(el).attr('style', s);
});

// Force 4 columns on desktop, 1 on mobile
// We will use CSS Grid directly in a style tag for better responsiveness
let igGrid = $('.instagram-grid');
igGrid.attr('style', '');
igGrid.attr('class', 'instagram-grid custom-ig-grid');

let styleTag = `
<style>
.custom-ig-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    align-items: start;
    width: 100%;
}
@media (max-width: 900px) {
    .custom-ig-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 600px) {
    .custom-ig-grid {
        grid-template-columns: 1fr;
    }
}
.custom-ig-grid blockquote {
    margin: 0 !important;
    width: 100% !important;
    min-width: 100% !important;
}
</style>
`;
if (!$('style').text().includes('.custom-ig-grid')) {
    $('head').append(styleTag);
}

// Add the resilient Instagram initialization script
// First remove old ones
$('script[src*="instagram.com/embed.js"]').remove();
$('script:contains("window.instgrm")').remove();
$('script:contains("createIGScript")').remove();

const igScript = `
<script>
(function(){
    function initIG() {
        if(window.instgrm) {
            window.instgrm.Embeds.process();
        } else {
            var s = document.createElement('script');
            s.async = true;
            s.defer = true;
            s.src = "https://www.instagram.com/embed.js";
            s.onload = function() { window.instgrm.Embeds.process(); };
            document.body.appendChild(s);
        }
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initIG, 100);
    } else {
        document.addEventListener('DOMContentLoaded', initIG);
    }
})();
</script>
`;
$('body').append(igScript);

fs.writeFileSync(file, $.html());
console.log('Fixed youtube hero and instagram feed robustly');
