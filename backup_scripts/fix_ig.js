const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// Remove the old buggy script tag
$('script[src="//www.instagram.com/embed.js"]').remove();

// Let's modify the inline style of the instagram blockquotes
$('.instagram-cta-container blockquote.instagram-media').each((i, el) => {
    let style = $(el).attr('style');
    // Remove the max-height and overflow-y
    style = style.replace(/max-height:\s*500px;?/g, '');
    style = style.replace(/overflow-y:\s*auto;?/g, '');
    $(el).attr('style', style);
    
    // Wrap it in a container that enforces the height
    $(el).wrap('<div class="instagram-wrapper" style="height: 500px; overflow: hidden; border-radius: 16px; background: #fff; width: 100%;"></div>');
});

// Append the script tag correctly with https
$('.instagram-cta-container').append('<script async defer src="https://www.instagram.com/embed.js"></script>');
// Also add a fallback script to re-process just in case it doesn't load automatically
$('.instagram-cta-container').append(`
<script>
document.addEventListener("DOMContentLoaded", function() {
    if(window.instgrm) {
        window.instgrm.Embeds.process();
    } else {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    }
});
</script>
`);

fs.writeFileSync(file, $.html());
console.log('Fixed Instagram in inicio.html');
