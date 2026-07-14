const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

// We need to make sure the instagram blocks have proper spacing and hover effects.
// Let's add a <style> tag at the bottom.
const customStyles = `
<style>
.instagram-cta-container {
    padding: 60px 20px;
}
.instagram-cta-container a {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease !important;
}
.instagram-cta-container a:hover {
    transform: translateY(-5px) scale(1.05) !important;
    box-shadow: 0 15px 35px rgba(255, 208, 0, 0.4) !important;
}
.instagram-grid blockquote {
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}
.instagram-grid blockquote:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
}
</style>
`;

if (!html.includes('.instagram-cta-container a:hover')) {
    html = html.replace('</body>', customStyles + '\n</body>');
    fs.writeFileSync(file, html);
    console.log("Added animations to inicio.html");
}
