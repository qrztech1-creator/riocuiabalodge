const fs = require('fs');
const html = fs.readFileSync('temp_turismo.html', 'utf8');

// Find pageData JSON
const match = html.match(/window\.__NUXT__=\(function\([^)]*\)\{return (.*?)\}\(/);
if (match) {
    const rawStr = match[1];
    // It's a JS object, not strict JSON. Let's extract all "content" and "src" from the blocks
    // Wait, the blocks are stored in pageData.blocks!
    // But since it's hard to parse the Nuxt object string, we can just extract from the HTML elements!
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    
    // The main post content is usually below the header and above the footer
    // Let's find all text blocks and image blocks inside the <main> or between header/footer
    let content = "";
    $('.block-layout').each((i, el) => {
        // Skip the Hero block (usually first)
        if (i === 0) return;
        
        // Find texts
        $(el).find('.GridTextBox').each((j, textEl) => {
            content += $(textEl).html() + "\n";
        });
        
        // Find images
        $(el).find('.image__image').each((j, imgEl) => {
            let src = $(imgEl).attr('src');
            if (src && !src.includes('data:image')) {
                // Remove formatting parameters from Zyro CDN URL
                src = src.split('?')[0]; 
                content += `<p><img src="${src}" /></p>\n`;
            }
        });
    });
    
    console.log(content.substring(0, 500));
}
