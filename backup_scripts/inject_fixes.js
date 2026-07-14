const fs = require('fs');

const liveHtml = fs.readFileSync('public/pages/inicio_live.html', 'utf8');

const fixes = `
<style>
/* 1. Hide Blog Section */
.block-blog-list { display: none !important; }
div[data-v-d87a02d1] { display: none !important; }
.blog-parent-hide { display: none !important; }

/* 2. Fix Hero Video Space */
.custom-hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    transform: translate(-50%, -50%);
    pointer-events: none;
    border: none;
    z-index: 0;
    object-fit: cover;
}

/* 3. Instagram Custom Grid */
.custom-ig-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
}
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
function applyFixes() {
    // 1. Blog Section - hide it
    const blogBlock = document.querySelector('.block-blog-list');
    if (blogBlock) {
        const section = blogBlock.closest('section');
        if (section) section.classList.add('blog-parent-hide');
    }

    // 2. Hero Video - Replace with YT iframe WITHOUT controls
    const heroSection = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('A melhor aventura de pesca'));
    if (heroSection) {
        const videoElement = heroSection.querySelector('video');
        if (videoElement && !videoElement.dataset.replaced) {
            videoElement.dataset.replaced = "true";
            const ytIframe = document.createElement('iframe');
            ytIframe.src = "https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&loop=1&playlist=vNTGe9Tr8OI&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&modestbranding=1&playsinline=1";
            ytIframe.className = "custom-hero-video block-background__video--fixed block-background__image";
            ytIframe.setAttribute('frameborder', '0');
            ytIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            videoElement.replaceWith(ytIframe);
            
            const overlay = heroSection.querySelector('.block-background__overlay');
            if (overlay) {
                overlay.style.position = 'absolute';
                overlay.style.inset = '0';
                overlay.style.zIndex = '1';
                overlay.style.pointerEvents = 'auto'; // Block clicks to iframe
            }
        }
    }

    // 3. Instagram Section
    const sectionGaranta = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Garanta seu lugar na melhor pousada de Cuiabá'));
    if (sectionGaranta && !document.querySelector('.instagram-dedicated-section')) {
        const imgs = sectionGaranta.querySelectorAll('img');
        imgs.forEach(img => {
            const parentEl = img.closest('div[class*="layout-element"]');
            if(parentEl) parentEl.remove();
        });

        const igSection = document.createElement('section');
        igSection.className = "instagram-dedicated-section";
        igSection.style.cssText = "padding: 80px 20px; background-color: #1a1a1a; text-align: center; position: relative; z-index: 1;";
        igSection.innerHTML = \`
            <div style="max-width: 1200px; margin: 0 auto;">
                <div style="margin-bottom: 60px;">
                    <a href="https://www.instagram.com/riocuiabalodge" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; background-color: rgb(255, 208, 0); color: rgb(26, 26, 26); padding: 18px 40px; border-radius: 27px; font-size: 16px; font-weight: bold; text-decoration: none; text-transform: uppercase; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px) scale(1.05)'; this.style.boxShadow='0 15px 35px rgba(255, 208, 0, 0.4)';" onmouseout="this.style.transform='none'; this.style.boxShadow='none';">
                        CONFERIR AGORA PESCARIAS DO MOMENTO
                    </a>
                </div>
                <div class="custom-ig-grid">
                    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/Daa7VRRyCvg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
                    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaZE6MyBkyX/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
                    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DaUBNlTl5Hs/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
                    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DaRGtimts64/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); margin: 0; padding:0; width:100%;"></blockquote>
                </div>
            </div>
        \`;
        sectionGaranta.after(igSection);

        if(!window.instgrm) {
            const s = document.createElement('script');
            s.src = "https://www.instagram.com/embed.js";
            s.onload = () => { if(window.instgrm) window.instgrm.Embeds.process(); };
            document.body.appendChild(s);
        } else {
            window.instgrm.Embeds.process();
        }
    }

    // 4. Contact Section (at the end)
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        const contactForm = forms[forms.length - 1];
        const contactSection = contactForm.closest('section');
        if (contactSection && !contactSection.textContent.includes('Reserve agora sua hospedagem')) {
            const hText = contactSection.querySelector('h2, h3, strong');
            if (hText) {
                const newText = document.createElement('p');
                newText.style.cssText = "color: #fff; font-size: 18px; margin-top: 10px; margin-bottom: 20px;";
                newText.textContent = "Reserve agora sua hospedagem e viva momentos inesquecíveis";
                hText.parentElement.appendChild(newText);
            }
            // Swap person image for group image
            const imgs = contactSection.querySelectorAll('img');
            imgs.forEach(img => {
                if(img.src.includes('person') || img.src.includes('pessoa')) {
                    img.src = 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/zDUwrhpQOjhJv2a/grupo-pesca-YZ9XkLZRkxC1gNn1.jpg'; // just a placeholder group or any good image
                }
            });
        }
    }

    // 5. FAQ Question
    const faqQuestion = Array.from(document.querySelectorAll('strong')).find(el => el.textContent.includes('Quando é a melhor época do ano'));
    if (faqQuestion) {
        const parentDiv = faqQuestion.closest('div');
        if (parentDiv) {
            const answerP = parentDiv.nextElementSibling;
            if (answerP && !answerP.textContent.includes('abril ao final de setembro')) {
                answerP.innerHTML = "<p>De abril ao final de setembro</p>";
            } else if (!answerP) {
                const newA = document.createElement('div');
                newA.innerHTML = "<p style='color:white; margin-top:10px;'>De abril ao final de setembro</p>";
                parentDiv.after(newA);
            }
        }
    }

    // 6. "Tudo isso, com uma equipe que entende do assunto"
    const sectionEquipe = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Tudo isso, com uma equipe') || s.textContent.includes('TUDO ISSO COM UMA EQUIPE'));
    if (sectionEquipe) {
        if (!sectionEquipe.innerHTML.includes('QUERO FAZER MINHA RESERVA AGORA')) {
            const btn = document.createElement('a');
            btn.href = "/contato";
            btn.style.cssText = "display: inline-block; background-color: rgb(255, 208, 0); color: black; padding: 15px 30px; font-weight: bold; text-decoration: none; border-radius: 5px; margin-top: 20px;";
            btn.textContent = "QUERO FAZER MINHA RESERVA AGORA";
            const textContainer = sectionEquipe.querySelector('h2, h3')?.parentElement || sectionEquipe.querySelector('div');
            if (textContainer) {
                textContainer.appendChild(btn);
            }
        }
    }

    // 7. Bird watching Section (Insert before "Onde estamos")
    const sectionOndeEstamos = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Onde estamos'));
    if (sectionOndeEstamos && !document.querySelector('.bird-watching-section')) {
        const birdSection = document.createElement('section');
        birdSection.className = "bird-watching-section";
        birdSection.style.cssText = "padding: 60px 20px; background-color: #f4f4f4; color: #1a1a1a; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 40px;";
        birdSection.innerHTML = \`
            <div style="flex: 1; min-width: 300px; max-width: 500px;">
                <img src="https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=800" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" alt="Bird watching">
            </div>
            <div style="flex: 1; min-width: 300px; max-width: 500px;">
                <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">Bird watching, turismo na porta de Pantanal</h2>
                <p style="font-size: 18px; margin-bottom: 30px; line-height: 1.6;">Venha vivenciar a experiência única de observar aves no Pantanal, um dos ecossistemas mais ricos do mundo. Nossa equipe preparou roteiros exclusivos para você.</p>
                <a href="/contato" style="display: inline-block; background-color: rgb(255, 208, 0); color: black; padding: 15px 30px; font-weight: bold; text-decoration: none; border-radius: 5px;">QUERO SABER MAIS</a>
            </div>
        \`;
        sectionOndeEstamos.before(birdSection);
    }
}

window.addEventListener('load', () => {
    setTimeout(applyFixes, 800);
});
</script>
`;

const finalHtml = liveHtml.replace('</body>', fixes + '\n</body>');
fs.writeFileSync('public/pages/inicio.html', finalHtml);
console.log('Saved patched inicio.html');
