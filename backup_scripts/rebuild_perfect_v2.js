const fs = require('fs');
const cheerio = require('cheerio');

// 1. LER O BACKUP LOCAL CORRETO (Que contém o formulário e 3 depoimentos!)
const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

// 2. CORRIGIR CAMINHOS DE CSS E IMAGENS PARA NÃO PERDER O ESTILO
$('link[rel="stylesheet"]').each((i, el) => {
    let href = $(el).attr('href');
    if (href && href.startsWith('/_astro')) {
        $(el).attr('href', 'https://riocuiabalodge.com.br' + href);
    }
});
$('img, source, a').each((i, el) => {
    let src = $(el).attr('src');
    if (src && src.startsWith('/assets/')) {
        $(el).attr('src', 'https://riocuiabalodge.com.br' + src);
    }
    let srcset = $(el).attr('srcset');
    if (srcset && srcset.includes('/assets/')) {
        $(el).attr('srcset', srcset.replace(/\/_astro\//g, 'https://riocuiabalodge.com.br/_astro/').replace(/\/assets\//g, 'https://riocuiabalodge.com.br/assets/'));
    }
    let href = $(el).attr('href');
    if (href && href.startsWith('/assets/')) {
        $(el).attr('href', 'https://riocuiabalodge.com.br' + href);
    }
});
$('[style*="url("]').each((i, el) => {
    let style = $(el).attr('style');
    if (style.includes('url(/assets/') || style.includes('url("/assets/')) {
        style = style.replace(/url\(['"]?\/assets\//g, 'url(https://riocuiabalodge.com.br/assets/');
        $(el).attr('style', style);
    }
});

// 3. SEÇÃO 1: HERO VIDEO
let heroVideo = $('video').first();
if (heroVideo.length > 0) {
    let ytIframe = `
    <iframe class="block-background__video--fixed" src="https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&controls=0&loop=1&playlist=vNTGe9Tr8OI&modestbranding=1&rel=0&showinfo=0&disablekb=1" title="riocuiabalodge" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position: absolute; top: 50%; left: 50%; width: 100vw; height: 100vh; transform: translate(-50%, -50%) scale(1.6); pointer-events: none; z-index: -1;"></iframe>
    `;
    heroVideo.parent().css('overflow', 'hidden'); 
    heroVideo.replaceWith(ytIframe);
}

// 4. SEÇÃO 2: INSTAGRAM E CTA
let igTargetSection = null;
$('section').each((i, el) => {
    if ($(el).text().includes('Garanta seu lugar na melhor pousada de Cuiabá')) {
        igTargetSection = $(el);
    }
});

if (igTargetSection) {
    let instagramSection = `
    <section class="instagram-cta-container" style="background-color: #111; padding: 40px 20px; text-align: center; width: 100%;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <a href="https://www.instagram.com/riocuiabalodge/" target="_blank" style="display: inline-block; background-color: #FFC107; color: #000; font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 700; padding: 15px 40px; text-decoration: none; text-transform: uppercase; border-radius: 5px; margin-bottom: 40px; cursor: pointer; transition: background-color 0.3s ease;">
                CONFERIR AGORA PESCARIAS DO MOMENTO
            </a>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; justify-content: center; align-items: start;">
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa7VRRyCvg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0; padding:0; width:100%;"></blockquote>
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa6N3by031/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0; padding:0; width:100%;"></blockquote>
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa4uH2SVtQ/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0; padding:0; width:100%;"></blockquote>
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa4M8hyn7l/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0; padding:0; width:100%;"></blockquote>
            </div>
        </div>
    </section>
    `;
    
    igTargetSection.after(instagramSection);
}

// 5. APAGAR AS 6 FOTOS ANTIGAS QUE FICAVAM NA SEÇÃO 6 ORIGINAL
$('section').each((i, el) => {
    let images = $(el).find('img');
    if (images.length === 6) {
        let firstSrc = $(images[0]).attr('src') || '';
        if (firstSrc.includes('whatsapp') || firstSrc.includes('20241214')) {
            $(el).remove(); // Removemos a grid das antigas 6 fotos!
        }
    }
});

// 6. REMOVER A SEÇÃO BLOG (A antiga seção que tinha 'Notícias e Blog')
$('section').each((i, el) => {
    if ($(el).text().includes('Notícias e Blog') || $(el).text().includes('Nossas dicas')) {
        $(el).remove();
    }
});

// Adicionar Script do Instagram ao final do body, garantindo que ele carregue
if (!$('body').html().includes('embed.js')) {
    $('body').append('<script async src="//www.instagram.com/embed.js"></script>');
}

// Forçar processamento do IG após load
$('body').append(`
<script>
    document.addEventListener("DOMContentLoaded", function() {
        if(window.instgrm) {
            window.instgrm.Embeds.process();
        } else {
            let igScript = document.createElement('script');
            igScript.src = "//www.instagram.com/embed.js";
            igScript.onload = function() { window.instgrm.Embeds.process(); };
            document.body.appendChild(igScript);
        }
    });
</script>
`);

// SALVAR O ARQUIVO CORRIGIDO
fs.writeFileSync('public/pages/inicio.html', $.html());
console.log('Build V2 executado com sucesso usando a base LOCAL CORRETA.');
