const fs = require('fs');
const https = require('https');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

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

async function scrape() {
  for (const url of urls) {
    const slug = url.split('/').pop();
    console.log(`Scraping ${slug}...`);
    
    try {
      const html = await fetchUrl(url);
      
      // Look for the main content block
      // In Zyro, text blocks might have different IDs on different pages, but let's find the largest text block.
      // Usually it's in a block named `GridTextBox` inside a blog layout.
      // Let's just find `pageData` JSON!
      const scriptMatch = html.match(/window\.__NUXT__=\(function\([^)]*\)\{return \{.*?\}\}\(/);
      let content = "";
      
      if (html.includes('z15bpT')) {
          const match = html.match(/(&quot;z15bpT&quot;:\[0,\{.*?)&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/s);
          if (match && match[2]) {
              content = unescapeJson(match[2]);
          }
      } else {
          // Alternative: we find all "content":[0,"..."] and pick the longest one!
          const regex = /&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/g;
          let longest = '';
          let m;
          while ((m = regex.exec(html)) !== null) {
              const text = unescapeJson(m[1]);
              if (text.length > longest.length) longest = text;
          }
          content = longest;
      }
      
      if (content) {
         console.log(`Found content for ${slug}, length: ${content.length}`);
         
         // Replace Zyro image URLs with local hashes
         const imgRegex = /https:\/\/assets\.zyrosite\.com\/[^"'\s\)\&]+/g;
         content = content.replace(imgRegex, (match) => {
             const hash = crypto.createHash('md5').update(match).digest('hex');
             let ext = '.jpg';
             if (match.includes('.png')) ext = '.png';
             else if (match.includes('.svg')) ext = '.svg';
             else if (match.includes('.webp')) ext = '.webp';
             else if (match.includes('.gif')) ext = '.gif';
             else if (match.includes('.jpeg')) ext = '.jpeg';
             return '/assets/zyro/' + hash + ext;
         });
         
         // Update DB
         await prisma.post.update({
           where: { slug },
           data: { content }
         });
         console.log(`Updated DB for ${slug}`);
      } else {
         console.log(`NO CONTENT FOUND FOR ${slug}`);
      }
      
    } catch (e) {
      console.error(`Error on ${slug}:`, e);
    }
  }
}

scrape().finally(() => prisma.$disconnect());
