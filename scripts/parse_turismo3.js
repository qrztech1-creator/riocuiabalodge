const fs = require('fs');
const html = fs.readFileSync('temp_turismo.html', 'utf8');

const regex = /&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/g;
let content = "";

let m;
while ((m = regex.exec(html)) !== null) {
  let text = m[1]
    .replace(/\\&quot;/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
    
  if (text.includes('<p') || text.includes('<h')) {
     content += text + '\n';
  }
}

// Now let's extract the images from the HTML
const cheerio = require('cheerio');
const $ = cheerio.load(html);
$('.image__image').each((j, imgEl) => {
    let src = $(imgEl).attr('src');
    if (src && !src.includes('data:image')) {
        src = src.split('?')[0]; 
        content += `<p><img src="${src}" /></p>\n`;
    }
});

console.log("Combined length:", content.length);
console.log(content.substring(0, 500));
