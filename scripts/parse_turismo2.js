const fs = require('fs');
const cheerio = require('cheerio');
const crypto = require('crypto');

function extractContent(html) {
    const $ = cheerio.load(html);
    let content = "";
    
    // Zyro blocks are <section class="block ...">
    const sections = $('section.block');
    // Skip header and footer blocks. Usually the first block is the Header menu, second is Hero, last is Footer.
    // We only want the ones in the middle.
    // In Zyro, header is often <header>, footer is <footer>. Let's check sections!
    
    sections.each((i, sec) => {
        const id = $(sec).attr('id');
        // Let's assume the main body blocks are those containing GridTextBox or image__image
        if ($(sec).find('.GridTextBox').length > 0 || $(sec).find('.image__image').length > 0) {
            
            // For each element inside the section in order
            $(sec).find('.GridTextBox, .image__image').each((j, el) => {
                if ($(el).hasClass('GridTextBox')) {
                    content += $(el).html() + "\n";
                } else if ($(el).hasClass('image__image')) {
                    let src = $(el).attr('src');
                    if (src && !src.includes('data:image')) {
                        src = src.split('?')[0]; 
                        content += `<p><img src="${src}" /></p>\n`;
                    }
                }
            });
        }
    });
    
    return content;
}

const html = fs.readFileSync('temp_turismo.html', 'utf8');
const result = extractContent(html);
console.log(result.substring(0, 1000));
