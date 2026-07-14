const fs = require('fs');

const filesToFix = [
    'public/pages/blog.html',
    'public/pages/eventos.html',
    'public/pages/inicio.html'
];

let filesFixed = 0;

for (const file of filesToFix) {
    if (!fs.existsSync(file)) {
        console.log('File not found:', file);
        continue;
    }

    let html = fs.readFileSync(file, 'utf8');
    
    let originalHtml = html;

    // 1. Change card from div to a
    html = html.replace(/const card = document\.createElement\('div'\);/g, "const card = document.createElement('a');\n            card.href = '/' + post.slug;");
    
    // 2. Remove onclick
    html = html.replace(/card\.onclick = \(\) => \{ window\.location\.href = '\/' \+ post\.slug; \};\s*/g, "");
    
    // 3. Add pointer-events: none to video and img to prevent Zyro lightbox interference
    html = html.replace(/<video src="([^"]*)"([^>]*)style="([^"]*)"([^>]*)>/g, '<video src="$1"$2style="$3; pointer-events: none;"$4>');
    html = html.replace(/<img src="([^"]*)"([^>]*)style="([^"]*)"([^>]*)>/g, '<img src="$1"$2style="$3; pointer-events: none;"$4>');

    if (html !== originalHtml) {
        fs.writeFileSync(file, html, 'utf8');
        console.log('Fixed:', file);
        filesFixed++;
    } else {
        console.log('No changes needed or regex failed for:', file);
    }
}

console.log('Total files fixed:', filesFixed);
