const fs = require('fs');

let html = fs.readFileSync('public/pages/inicio.html', 'utf8');

// Fix Astro CSS link
html = html.replace('href="/_astro', 'href="https://riocuiabalodge.com.br/_astro');

// Inject local CSS if not present
if (!html.includes('/assets/inicio/style.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/inicio/style.css"></head>');
}

fs.writeFileSync('public/pages/inicio.html', html);
console.log('Fixed CSS links in inicio.html');
