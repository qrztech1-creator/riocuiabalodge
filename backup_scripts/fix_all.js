const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Cleanup previous attempt
$('.instagram-cta-section').remove();

// The hero video was modified in Task 3. The user said:
// "O vídeo lá, quando ele inicia, ou não sei se na verdade é quando abre a página, não sei, mas tem que tirar os controles, né? Tá aparecendo o botão de pause, o botão para voltar e o botão para passar. Tem que tirar, esses controles não podem aparecer."
// The hero YouTube iframe has: src="https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&loop=1&playlist=vNTGe9Tr8OI&controls=0&showinfo=0&rel=0"
// I will also append &disablekb=1&fs=0&modestbranding=1
$('iframe.block-background__video--fixed').attr('src', 'https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&loop=1&playlist=vNTGe9Tr8OI&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&modestbranding=1');
// Ensure pointer-events: none is strictly applied to avoid clicking to pause
$('iframe.block-background__video--fixed').attr('style', 'pointer-events: none; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -1;');

// Identify section 2
let sectionGaranta = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Garanta seu lugar na melhor pousada de Cuiabá') || $(el).text().includes('Garanta seu lugar na melhor pousada')) {
        sectionGaranta = el;
    }
});

if (sectionGaranta) {
    // 1. We need to find the 6 images and replace them.
    // Zyro lays out components in divs with data-qa="image" or similar.
    // Let's just find all img tags inside this section.
    // Wait, replacing them directly might break the CSS grid layout of Zyro.
    // A better way is to hide the entire element containing the images, or just empty the image containers and put Instagram embeds in them.
    // Let's see the structure first.
    let imgs = $(sectionGaranta).find('img');
    if(imgs.length > 0) {
        // Find a common ancestor container for all 6 images, or just remove the parent components.
        // Zyro's image components usually have class 'block-image' or similar.
        // Let's find the grid container that holds them.
        $(sectionGaranta).find('.block-image').parent().remove();
        // Fallback:
        imgs.each((i, img) => {
            $(img).closest('[data-animation-role="image"], [data-qa="image"], .block-image').remove();
        });
    }

    const cleanIgBlocks = `
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa7VRRyCvg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; height: 100%; max-height: 500px; overflow-y: auto;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaZE6MyBkyX/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; height: 100%; max-height: 500px; overflow-y: auto;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DaUBNlTl5Hs/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; height: 100%; max-height: 500px; overflow-y: auto;"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaRGtimts64/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%; height: 100%; max-height: 500px; overflow-y: auto;"></blockquote>
    <script async src="//www.instagram.com/embed.js"></script>
    `;

    // The user said: "Embaixo do vídeo, na verdade, tem o CTA."
    // Let's inject a wrapper at the bottom of the section Garanta containing the CTA and the Instagram Grid.
    const newInject = `
    <div class="instagram-cta-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px; text-align: center; position: relative; z-index: 10;">
        <a href="https://www.instagram.com/riocuiabalodge" target="_blank" style="display: inline-block; background-color: #2e604f; color: white; padding: 18px 40px; border-radius: 4px; font-size: 16px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; transition: background-color 0.3s ease; margin-bottom: 60px;">
            CONFERIR AGORA PESCARIAS DO MOMENTO
        </a>
        <div class="instagram-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; align-items: start;">
            ${cleanIgBlocks}
        </div>
    </div>
    `;

    $(sectionGaranta).append(newInject);
}

// 3. Pousada Page Reorder
// "Eu pedi para subir o vídeo que está em 'Venha aproveitar a melhor pousada de Cuiabá', o vídeo e embaixo o CTA. Isso na verdade tem que ser a primeira coisa abaixo do hero, de seção de título, né? E aí depois só vem os depoimentos, imagens e as informações que estão ali. Beleza?"
// Let's process pousada.html too.
const filePousada = 'public/pages/pousada.html';
let htmlPousada = fs.readFileSync(filePousada, 'utf8');
const $p = cheerio.load(htmlPousada);

let sectionHero = null;
let sectionVenha = null;
let sectionTestimonials = null; // Section containing quotes or images

$p('section').each((i, el) => {
    const text = $p(el).text();
    if (i === 0) sectionHero = el; // Usually the first section is the hero title
    if (text.includes('VENHA APROVEITAR A MELHOR POUSADA DE CUIABÁ') || $p(el).html().includes('VENHA APROVEITAR')) {
        sectionVenha = el;
    }
});

// Since the user says "primeira coisa abaixo do hero", we can just insert sectionVenha immediately after the hero section!
if (sectionHero && sectionVenha) {
    // If it's already there, no problem. If not, this moves it.
    $p(sectionVenha).insertAfter(sectionHero);
    fs.writeFileSync(filePousada, $p.html());
    console.log('Fixed pousada order');
}

fs.writeFileSync(file, $.html());
console.log('Fixed inicio.html');
