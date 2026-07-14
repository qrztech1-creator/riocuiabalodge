const fs = require('fs');
const cheerio = require('cheerio');

// Ler o backup local correto que TEM TUDO que o usuário pediu
const html = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8');
const $ = cheerio.load(html);

// 1. CORRIGIR CAMINHOS DE CSS E IMAGENS PARA NÃO PERDER O ESTILO ZYRO NO NEXT.JS
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

// 2. CORRIGIR O IFRAME DO YOUTUBE NO HERO (Adicionar scale 1.6 e overflow hidden)
let heroIframe = $('iframe').first();
if (heroIframe.length > 0 && heroIframe.attr('src').includes('vNTGe9Tr8OI')) {
    // Pegar o estilo original e adicionar o scale
    let currentStyle = heroIframe.attr('style') || '';
    if (!currentStyle.includes('scale(1.6)')) {
        // Remover qualquer transform antigo
        currentStyle = currentStyle.replace(/transform:[^;]+;/g, '');
        currentStyle += ' transform: translate(-50%, -50%) scale(1.6); pointer-events: none; z-index: -1;';
        heroIframe.attr('style', currentStyle);
    }
    
    // O container pai imediato precisa ter overflow hidden pra não quebrar a tela com o vídeo grandão
    heroIframe.parent().css('overflow', 'hidden');
}

// 3. NÃO DELETAR MAIS NADA! NÃO INJETAR MAIS NADA!
// O arquivo inicio_pretty.html JÁ TEM o Instagram, JÁ TEM o Carrossel, JÁ TEM o form e os 3 depoimentos!

fs.writeFileSync('public/pages/inicio.html', $.html());
console.log('Build FINAL executado. YouTube arrumado. Instagram e Carrossel preservados!');
