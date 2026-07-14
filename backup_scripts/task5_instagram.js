const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

let targetSection = null;
$('section').each((i, el) => {
    if ($(el).html().includes('asset_22.mp4')) {
        targetSection = el;
    }
});

if (targetSection) {
    const cleanIgBlocks = `
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa7VRRyCvg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaZE6MyBkyX/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DaUBNlTl5Hs/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaRGtimts64/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
    <script async src="//www.instagram.com/embed.js"></script>
    `;

    const newSection = `
    <section class="instagram-cta-section" style="padding: 6rem 1rem; background-color: #f8f9fa; text-align: center;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <a href="https://www.instagram.com/riocuiabalodge" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1B395A, #285586); color: white; padding: 18px 40px; border-radius: 50px; font-size: 18px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(27, 57, 90, 0.3); transition: transform 0.3s ease, box-shadow 0.3s ease; margin-bottom: 4rem; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 30px rgba(27,57,90,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 20px rgba(27,57,90,0.3)'">
                CONFERIR AGORA PESCARIAS DO MOMENTO
            </a>
            
            <div class="instagram-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: start;">
                ${cleanIgBlocks}
            </div>
        </div>
    </section>
    `;

    let nextSect = $(targetSection).next('section');
    if (nextSect.length && nextSect.html().includes('<img')) {
        nextSect.remove();
    }

    $(targetSection).after(newSection);
}

fs.writeFileSync(file, $.html());
console.log('Added CTA and Instagram Feed to inicio.html');
