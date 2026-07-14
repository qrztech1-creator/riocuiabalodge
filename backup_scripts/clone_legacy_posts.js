const fs = require('fs');
const path = require('path');

const slugs = [
    '10-dicas-para-pescar-dourado',
    'pescaria-acontecendo',
    'confraternizacao',
    'eventos-corporativos',
    'turismo-de-experiencia'
];

async function main() {
    for (const slug of slugs) {
        console.log(`Cloning ${slug}...`);
        const cloneDir = path.join(__dirname, `clone_${slug}`);
        if (!fs.existsSync(cloneDir)) fs.mkdirSync(cloneDir, { recursive: true });
        
        // Fetch HTML
        const res = await fetch(`https://riocuiabalodge.com.br/${slug}`);
        let html = await res.text();
        
        // Find the CSS file
        const cssMatch = html.match(/<link rel="stylesheet" href="(\/_astro[^"]+\.css)">/);
        if (cssMatch) {
            const cssUrl = `https://riocuiabalodge.com.br${cssMatch[1]}`;
            console.log(`  Fetching CSS: ${cssUrl}`);
            const cssRes = await fetch(cssUrl);
            const css = await cssRes.text();
            fs.writeFileSync(path.join(cloneDir, 'style.css'), css);
            
            // Replace the CSS link in HTML to point to local style.css
            html = html.replace(cssMatch[0], `<link rel="stylesheet" href="style.css">`);
        } else {
            console.log(`  No CSS found for ${slug}`);
        }
        
        fs.writeFileSync(path.join(cloneDir, 'index.html'), html);
        
        // We will not download all Zyro assets because they are hosted on Zyro's CDN and absolute URLs work fine.
        // We just need the HTML and CSS to be processed by rebuild.js!
    }
}

main().catch(console.error);
