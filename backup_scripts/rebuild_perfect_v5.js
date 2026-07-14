const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

const customCss = `
<style>
/* Reset Zyro absolute positioning for flex containers */
.flex-override > div, .flex-override > a, .flex-override > p, .flex-override > h3, .flex-override > h6 {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    width: auto !important;
    height: auto !important;
    transform: none !important;
}

  /* Thin Yellow Bar */
  .block-sticky-bar { 
      position: fixed !important; 
      top: 0 !important; 
      left: 0 !important; 
      right: 0 !important; 
      z-index: 1001 !important; 
      height: 25px !important; 
      padding: 0 !important; 
      background-color: rgb(255, 202, 54) !important; 
      display: flex; align-items: center; justify-content: center;
  }
  .block-sticky-bar .block-sticky-bar-layout { min-height: unset !important; padding: 0 16px !important; top: auto !important; position: relative !important; background: transparent !important; }
  .block-sticky-bar p, .block-sticky-bar span, .block-sticky-bar strong { font-size: 11px !important; line-height: 14px !important; margin: 0 !important; color: rgb(26,26,26) !important; }
  .block-sticky-bar__background { display: none !important; } /* hide default Zyro background element */
  
  header.block-header { 
      position: fixed !important; 
      top: 25px !important; 
      left: 0 !important; 
      right: 0 !important; 
      z-index: 1000 !important; 
      background-color: transparent !important;
      transition: background-color 0.3s;
  }
  header.block-header .background { background-color: transparent !important; transition: background-color 0.3s; }
  .scrolled header.block-header .background { background-color: rgba(0,0,0,0.85) !important; }

/* Hero Video Controls Fix */
.block-background__video--fixed { 
    transform: translate(-50%, -50%) scale(2.5) !important; 
    pointer-events: none !important;
}

/* Hero Content centralizado */
.hero-content-wrapper {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    gap: 15px;
    height: 100%;
    width: 100%;
}
.hero-content-wrapper > * { position: relative !important; top: auto !important; left: auto !important; width: 100% !important; max-width: 800px; margin: 0 auto; transform: none !important; }
.hero-content-wrapper h3 { text-align: center !important; }

/* Segunda Seção - Vídeos + CTA + Instagram */
.segunda-secao-wrapper {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 30px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}
.segunda-secao-wrapper > * {
    position: relative !important; top: auto !important; left: auto !important; width: auto !important; transform: none !important;
}
.custom-ig-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
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
.custom-ig-grid blockquote { margin: 0 !important; width: 100% !important; min-width: 100% !important; }

/* Faixa de ícones */
.icones-wrapper {
    display: flex !important;
    flex-direction: row;
    justify-content: space-evenly;
    gap: 40px;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.icone-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
}
.icone-item > * { position: relative !important; top: auto !important; left: auto !important; width: auto !important; transform: none !important; margin: 0 !important; }

@media (max-width: 768px) {
    .icones-wrapper { flex-direction: column; gap: 30px; }
}

/* Pesca Esportiva */
.pesca-esportiva-row {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}
.pesca-esportiva-row > div { position: relative !important; top: auto !important; left: auto !important; width: auto !important; height: auto !important; flex: 1; transform: none !important; }
@media (max-width: 768px) {
    .pesca-esportiva-row { flex-direction: column-reverse !important; }
}

/* A Pousada */
.a-pousada-wrapper {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}
.a-pousada-images {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    gap: 40px;
    width: 100%;
}
.a-pousada-images > div { position: relative !important; top: auto !important; left: auto !important; width: 100% !important; flex: 1; transform: none !important; }
.a-pousada-images img { width: 100% !important; height: auto !important; object-fit: cover; }
.a-pousada-text {
    text-align: center !important;
    max-width: 800px;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 20px;
    margin-top: 20px;
}
.a-pousada-text > * { position: relative !important; top: auto !important; left: auto !important; width: auto !important; transform: none !important; }
@media (max-width: 768px) {
    .a-pousada-images { flex-direction: column !important; }
}

/* Birdwatching & Onde Estamos */
.bird-onde-row {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}
.bird-onde-row > div { position: relative !important; top: auto !important; left: auto !important; width: 100% !important; flex: 1; transform: none !important; }
@media (max-width: 768px) {
    .bird-onde-row { flex-direction: column !important; }
}

/* FAQ spacing */
.faq-wrapper {
    display: flex !important;
    flex-direction: column !important;
    gap: 15px;
    max-width: 800px;
    margin: 0 auto;
}
.faq-wrapper > div { position: relative !important; top: auto !important; left: auto !important; width: 100% !important; transform: none !important; margin: 0 !important; }

/* Reserva Secao */
.reserva-wrapper {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    justify-content: center !important;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}
.reserva-wrapper > div { position: relative !important; top: auto !important; left: auto !important; width: 100% !important; flex: 1; transform: none !important; margin: 0 !important; }
@media (max-width: 768px) {
    .reserva-wrapper { flex-direction: column !important; }
}
</style>
`;
$('head').append(customCss);

// JS for scroll
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

// Inject Admin Button next to WhatsApp
const whatsappBtn = $('a:contains("Whatsapp")').filter((i, el) => $(el).attr('href') && $(el).attr('href').includes('whatsapp'));
if (whatsappBtn.length) {
    whatsappBtn.wrap('<div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;"></div>');
    whatsappBtn.parent().append(`
    <a href="/admin" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; font-weight: 600; color: #fff; background: rgba(27, 57, 90, 0.9); border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; text-decoration: none; transition: all 0.3s ease; font-family: 'Oswald', sans-serif; font-size: 16px; letter-spacing: 0.5px; white-space: nowrap;" onmouseover="this.style.background='rgba(19, 44, 71, 1)'" onmouseout="this.style.background='rgba(27, 57, 90, 0.9)'">
        Área Admin
    </a>
    `);
}

// 3. Make sure Hero video has scale(2.5) and fix iframe
const heroVideo = $('iframe').first();
if (heroVideo.length) {
    let style = heroVideo.attr('style') || '';
    heroVideo.attr('style', style + ' transform: translate(-50%, -50%) scale(2.5); pointer-events: none; z-index: -1;');
}

// Ensure Instagram Grid class is present
const allIgs = $('blockquote.instagram-media').parent();
if (allIgs.length > 0) {
    allIgs.addClass('custom-ig-grid');
    if (allIgs.length > 1) {
        allIgs.not(':first').remove();
    }
}

// Store the single IG grid so we can append it properly in the Segunda Secao
const singleIgGrid = $('.custom-ig-grid').first();

$('section').each((i, el) => {
    const text = $(el).text();
    
    // Check if it's the section with Pesca Esportiva & A Pousada
    if (text.includes('Pesca Esportiva') && text.includes('A Pousada')) {
        const layout = $(el).find('div[class*="layout-desktop"]');
        if (layout.length) {
            const allElements = layout.children();
            
            let pescaText = null, pescaCta = null, pescaImg = null;
            let pousadaText = null, pousadaCta = null, pousadaImg1 = null, pousadaImg2 = null;
            
            allElements.each((j, child) => {
                const childText = $(child).text();
                const hasImg = $(child).find('img').length > 0 || $(child).hasClass('GridImage') || $(child).css('background-image');
                
                if (childText.includes('Pesca Esportiva')) pescaText = child;
                else if (childText.includes('A Pousada')) pousadaText = child;
                else if (childText.toUpperCase().includes('SABER MAIS')) pescaCta = child;
                else if (childText.toUpperCase().includes('QUERO CONHECER')) pousadaCta = child;
                else if (hasImg) {
                    if (!pescaImg) pescaImg = child;
                    else if (!pousadaImg1) pousadaImg1 = child;
                    else if (!pousadaImg2) pousadaImg2 = child;
                }
            });
            
            layout.empty();
            layout.removeClass(); // remove absolute layout classes
            
            // Rebuild Pesca Esportiva Row (Esquerda: Text, CTA. Direita: Imagem)
            const pescaRow = $('<div class="pesca-esportiva-row"></div>');
            const pescaTextCol = $('<div></div>').append(pescaText).append(pescaCta);
            pescaRow.append(pescaTextCol).append(pescaImg);
            
            // Rebuild A Pousada Wrapper (Esquerda: Img, Direita: Img. Baixo: Text, CTA)
            const pousadaWrapper = $('<div class="a-pousada-wrapper"></div>');
            const pousadaImgRow = $('<div class="a-pousada-images"></div>').append(pousadaImg1).append(pousadaImg2);
            const pousadaTextCol = $('<div class="a-pousada-text"></div>').append(pousadaText).append(pousadaCta);
            pousadaWrapper.append(pousadaImgRow).append(pousadaTextCol);
            
            layout.append(pescaRow).append(pousadaWrapper);
        }
    }
    
    // Check if it's the Segunda Seção (Garanta seu lugar)
    else if (text.includes('Garanta seu lugar na melhor pousada de Cuiabá') || text.includes('Garanta seu lugar na melhor')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            layout.addClass('segunda-secao-wrapper').removeClass('block-layout--layout');
            let title = null, video = null, cta = null;
            layout.children().each((j, child) => {
                const childText = $(child).text();
                if (childText.includes('Garanta seu lugar')) title = child;
                else if (childText.toUpperCase().includes('GARANTIR MEU LUGAR') || childText.toUpperCase().includes('MELHOR AVENTURA') || $(child).is('a.GridButton') || $(child).find('a').length > 0) {
                     if (!childText.includes('Garanta')) cta = child; 
                }
                else if ($(child).find('iframe').length > 0 || $(child).find('.GridVideo').length > 0) video = child;
            });
            
            layout.empty();
            if (title) layout.append(title);
            if (video) layout.append(video);
            if (cta) layout.append(cta);
            if (singleIgGrid.length) layout.append(singleIgGrid);
        }
    }
    
    // Check Faixa Amarela (Uma experiência única)
    else if (text.includes('Uma experiência única como você merece')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            let title = null;
            let svgs = [];
            let texts = [];
            layout.children().each((j, child) => {
                if ($(child).text().includes('Uma experiência única')) title = child;
                else if ($(child).find('svg').length > 0 || $(child).find('img').length > 0) svgs.push(child);
                else texts.push(child);
            });
            
            layout.empty();
            layout.addClass('flex-override').css({display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', padding: '40px 0'});
            if (title) layout.append($(title).css({position: 'relative', top: 'auto', left: 'auto', width: 'auto', textAlign: 'center'}));
            
            const iconsGrid = $('<div class="icones-wrapper"></div>');
            for(let k=0; k<Math.max(svgs.length, texts.length); k++) {
                const item = $('<div class="icone-item"></div>');
                if (svgs[k]) item.append(svgs[k]);
                if (texts[k]) item.append(texts[k]);
                iconsGrid.append(item);
            }
            layout.append(iconsGrid);
        }
    }
    
    // Birdwatching
    else if (text.includes('Birdwatching e turismo')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            layout.addClass('bird-onde-row').removeClass('block-layout--layout');
        }
    }
    
    // Onde Estamos
    else if (text.includes('Onde estamos')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            layout.addClass('bird-onde-row').removeClass('block-layout--layout');
        }
    }
    
    // Equipe
    else if (text.includes('Tudo isso com uma equipe que entende do assunto')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            layout.addClass('flex-override').css({display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '20px', padding: '40px 20px'});
        }
    }
    
    // FAQ
    else if (text.includes('Perguntas frequentes')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            let title = null;
            let qs = [];
            layout.children().each((j, child) => {
                if ($(child).text().includes('Perguntas frequentes')) title = child;
                else qs.push(child);
            });
            layout.empty();
            layout.addClass('flex-override').css({display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px'});
            if (title) layout.append($(title).css({marginBottom: '30px'}));
            const faqWrapper = $('<div class="faq-wrapper"></div>');
            qs.forEach(q => faqWrapper.append(q));
            layout.append(faqWrapper);
        }
    }
    
    // Reserva
    else if (text.includes('Reserve agora sua hospedagem')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            let title = null;
            let items = [];
            layout.children().each((j, child) => {
                if ($(child).text().includes('Reserve agora sua hospedagem')) title = child;
                else items.push(child);
            });
            layout.empty();
            layout.addClass('flex-override').css({display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px'});
            if (title) layout.append($(title).css({marginBottom: '30px', textAlign: 'center'}));
            const rWrapper = $('<div class="reserva-wrapper"></div>');
            items.forEach(i => rWrapper.append(i));
            layout.append(rWrapper);
        }
    }
    
    // Hero
    else if (text.includes('Com conforto, tranquilidade e muito peixe')) {
        const layout = $(el).find('div[class*="block-layout--layout"]');
        if (layout.length) {
            layout.addClass('hero-content-wrapper').removeClass('block-layout--layout');
        }
    }
});

// Remove leftover standalone ig grid wrappers if we moved it
$('section').each((i, el) => {
    if ($(el).find('.custom-ig-grid').length > 0 && !$(el).text().includes('Garanta seu lugar')) {
        $(el).remove();
    }
});

// Write the fixed HTML to inicio.html
fs.writeFileSync('public/pages/inicio.html', $.html());
fs.writeFileSync('../index.html', $.html());
console.log('Successfully rebuilt inicio.html and updated root index.html');
