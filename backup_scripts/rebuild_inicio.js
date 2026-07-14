const fs = require('fs');
const cheerio = require('cheerio');

const sourceFile = 'public/pages/inicio_live.html';
const targetFile = 'public/pages/inicio.html';

let html = fs.readFileSync(sourceFile, 'utf8');
const $ = cheerio.load(html);

// 1. CARDS to A tags (Pescarias / Eventos)
$('div[data-qa="blog-list-item"]').each((i, el) => {
    // If it has an onclick or something, we don't care, we'll wrap it or change tag
    let content = $(el).html();
    let attrs = $(el).attr();
    let slug = '';
    // usually there's a title with the slug or an inner link
    let innerLink = $(el).find('a').first().attr('href');
    if (innerLink) {
        $(el).replaceWith(`<a href="${innerLink}" class="${attrs.class || ''}" data-qa="${attrs['data-qa'] || ''}" style="${attrs.style || ''}" data-v-b99b1992="" data-v-1120e899="">${content}</a>`);
    }
});

// 2. REMOVE BLOG SECTION
let blogSection = null;
$('section').each((i, el) => {
    if ($(el).find('.block-blog-list__list').length > 0) {
        blogSection = el;
    }
});
if (blogSection) {
    $(blogSection).remove();
}

// 3. HERO VIDEO
let heroSection = null;
$('section').each((i, el) => {
    if ($(el).text().includes('A melhor aventura de pesca')) {
        heroSection = el;
    }
});

if (heroSection) {
    let videoElement = $(heroSection).find('video');
    if (videoElement.length) {
        // We replace the <video> with our <iframe>, keeping it simple.
        // To hide controls completely, we apply scale(1.6) and pointer-events: none.
        // We do NOT modify the parent's style.
        const ytIframe = `<iframe src="https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&loop=1&playlist=vNTGe9Tr8OI&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&modestbranding=1&playsinline=1" title="riocuiabalodge" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="block-background__video--fixed block-background__image" style="position: absolute; top: 50%; left: 50%; width: 150vw; height: 150vh; transform: translate(-50%, -50%); pointer-events: none; border: none; z-index: 0;"></iframe>`;
        videoElement.replaceWith(ytIframe);
        
        // Ensure the overlay div that comes after it blocks clicks (if it exists)
        $(heroSection).find('.block-background__overlay').attr('style', 'position: absolute; inset: 0; z-index: 1; pointer-events: auto;');
    }
}

// 4. INSTAGRAM SECTION & REMOVE IMAGES
let sectionGaranta = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Garanta seu lugar na melhor pousada de Cuiabá')) {
        sectionGaranta = el;
    }
});

if (sectionGaranta) {
    // Hide the grid layout elements that contained the 6 images.
    $(sectionGaranta).find('img').each((i, img) => {
        let parentGridItem = $(img).closest('div[class*="layout-element"]');
        if (parentGridItem.length) {
            parentGridItem.remove(); // Safer to just remove them now that we started from fresh HTML
        }
    });

    const cleanIgBlocks = `
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa7VRRyCvg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaZE6MyBkyX/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DaUBNlTl5Hs/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaRGtimts64/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    `;

    // Inject New Section for Instagram
    const newSection = `
    <section class="instagram-dedicated-section" style="padding: 80px 20px; background-color: #1a1a1a; text-align: center; position: relative; z-index: 1;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="margin-bottom: 60px;">
                <a href="https://www.instagram.com/riocuiabalodge" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; background-color: rgb(255, 208, 0); color: rgb(26, 26, 26); padding: 18px 40px; border-radius: 27px; font-size: 16px; font-weight: bold; text-decoration: none; text-transform: uppercase; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px) scale(1.05)'; this.style.boxShadow='0 15px 35px rgba(255, 208, 0, 0.4)';" onmouseout="this.style.transform='none'; this.style.boxShadow='none';">
                    CONFERIR AGORA PESCARIAS DO MOMENTO
                </a>
            </div>
            <div class="custom-ig-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
                ${cleanIgBlocks}
            </div>
        </div>
    </section>
    `;

    $(sectionGaranta).after(newSection);
}

// 5. CSS Styles & IG Script (Append to end of body)
const extraHtml = `
<style>
@media (max-width: 900px) {
    .custom-ig-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 600px) {
    .custom-ig-grid { grid-template-columns: 1fr !important; }
}
.custom-ig-grid blockquote {
    margin: 0 !important; width: 100% !important; min-width: 100% !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.custom-ig-grid blockquote:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
</style>
<script>
(function(){
    function initIG() {
        if(window.instgrm) {
            window.instgrm.Embeds.process();
        } else {
            var s = document.createElement('script');
            s.async = true; s.defer = true;
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
$('body').append(extraHtml);

fs.writeFileSync(targetFile, $.html());
console.log('Restored and rebuilt inicio.html successfully.');
