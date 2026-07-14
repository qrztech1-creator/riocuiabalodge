const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Remove the badly placed instagram container
let igContainer = $('.instagram-cta-container');
if (igContainer.length > 0) {
    let igHtml = igContainer.parent().html();
    
    // We will extract it, remove it, and place it as its OWN section!
    // But first, let's just create a clean section.
    igContainer.remove();
}

let sectionGaranta = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Garanta seu lugar na melhor pousada de Cuiabá') || $(el).text().includes('Garanta seu lugar na melhor pousada')) {
        sectionGaranta = el;
    }
});

if (sectionGaranta) {
    const cleanIgBlocks = `
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa7VRRyCvg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; min-width: 100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaZE6MyBkyX/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; min-width: 100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DaUBNlTl5Hs/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; min-width: 100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaRGtimts64/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; min-width: 100%;"></blockquote>
    `;

    // We will inject it as a new standard section with a dark background to match the theme (from the screenshot, the background is dark/black)
    const newSection = `
    <section class="instagram-dedicated-section" style="padding: 80px 20px; background-color: #1a1a1a; text-align: center; position: relative; z-index: 100;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="margin-bottom: 60px;">
                <a href="https://www.instagram.com/riocuiabalodge" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; background-color: rgb(255, 208, 0); color: rgb(26, 26, 26); padding: 18px 40px; border-radius: 27px; font-size: 16px; font-weight: bold; text-decoration: none; text-transform: uppercase; transition: background-color 0.3s ease;">
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

// 2. Fix YouTube Controls
// In the first screenshot, the YouTube play button shows up. It means autoplay failed.
// For autoplay to work, muted MUST be true, AND the browser MUST allow it.
// Sometimes the youtube player requires "playlist" to loop, and "enablejsapi=1".
// Let's also use a 100% overlay trick: a div that sits EXACTLY on top of the iframe, stealing all clicks, so the user can't pause it even if controls show briefly.
// Actually, I already added pointer-events: none. If controls still show up, it's just YouTube loading UI.
// Let's completely recreate the hero video iframe with an overlay to ensure it's hidden.
let heroSection = null;
$('section').each((i, el) => {
    if ($(el).text().includes('A melhor aventura de pesca')) {
        heroSection = el;
    }
});
if (heroSection) {
    let heroIframe = $(heroSection).find('iframe');
    if (heroIframe.length) {
        // Update iframe source
        heroIframe.attr('src', 'https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&loop=1&playlist=vNTGe9Tr8OI&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&modestbranding=1&playsinline=1');
        
        // Wrap the iframe in a container that severely crops it
        // YouTube controls are at the bottom (50px) and top (50px).
        // If we scale by 1.5, they are completely out of view.
        heroIframe.attr('style', 'position: absolute; top: 50%; left: 50%; width: 150vw; height: 150vh; transform: translate(-50%, -50%); pointer-events: none; border: none; z-index: -1;');
        
        let parent = heroIframe.parent();
        parent.attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 0;');
    }
}


fs.writeFileSync(file, $.html());
console.log('Fixed instagram dedicated section and youtube iframe');
