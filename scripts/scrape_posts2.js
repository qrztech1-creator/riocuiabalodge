const fs = require('fs');
const https = require('https');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

const urls = [
  'https://riocuiabalodge.com.br/10-dicas-para-pescar-dourado',
  'https://riocuiabalodge.com.br/pescaria-acontecendo',
  'https://riocuiabalodge.com.br/confraternizacao',
  'https://riocuiabalodge.com.br/eventos-corporativos',
  'https://riocuiabalodge.com.br/turismo-de-experiencia'
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function unescapeJson(str) {
  return str
    .replace(/\\&quot;/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function processImages(content) {
    const imgRegex = /https:\/\/assets\.zyrosite\.com\/[^"'\s\)\&]+/g;
    return content.replace(imgRegex, (match) => {
        const hash = crypto.createHash('md5').update(match).digest('hex');
        let ext = '.jpg';
        if (match.includes('.png')) ext = '.png';
        else if (match.includes('.svg')) ext = '.svg';
        else if (match.includes('.webp')) ext = '.webp';
        else if (match.includes('.gif')) ext = '.gif';
        else if (match.includes('.jpeg')) ext = '.jpeg';
        return '/assets/zyro/' + hash + ext;
    });
}

async function scrape() {
  for (const url of urls) {
    const slug = url.split('/').pop();
    console.log(`Scraping ${slug}...`);
    
    try {
      const html = await fetchUrl(url);
      
      const regex = /&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/g;
      let content = "";
      
      let m;
      while ((m = regex.exec(html)) !== null) {
        let text = unescapeJson(m[1]);
        if (text.includes('<p') || text.includes('<h')) {
           // Some blocks might be footer links. Let's ignore footer links!
           if (!text.includes('Rio Cuiabá Lodge') && !text.includes('Desenvolvido por') && text.length > 50) {
               content += text + '\n';
           } else if (slug === '10-dicas-para-pescar-dourado') {
               // Only accept long texts for the main content
               if (text.length > 100) content += text + '\n';
           } else {
               if (text.length > 50) content += text + '\n';
           }
        }
      }
      
      // Now extract images
      const $ = cheerio.load(html);
      let imgCount = 0;
      $('.image__image').each((j, imgEl) => {
          let src = $(imgEl).attr('src');
          if (src && !src.includes('data:image')) {
              src = src.split('?')[0]; 
              content += `<p><img src="${src}" /></p>\n`;
              imgCount++;
          }
      });
      
      if (content) {
         content = processImages(content);
         
         await prisma.post.update({
           where: { slug },
           data: { content }
         });
         console.log(`Updated DB for ${slug} (Length: ${content.length}, Images: ${imgCount})`);
      } else {
         console.log(`NO CONTENT FOUND FOR ${slug}`);
      }
      
    } catch (e) {
      console.error(`Error on ${slug}:`, e);
    }
  }
}

scrape().finally(() => prisma.$disconnect());
