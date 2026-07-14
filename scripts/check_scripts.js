const fs = require('fs');

const files = ['public/pages/inicio.html', 'public/pages/eventos.html', 'public/pages/blog.html'];

files.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let found = false;
    while ((match = regex.exec(html)) !== null) {
        if (match[1].includes('/api/posts')) {
            console.log(`Found in ${file}`);
            found = true;
        }
    }
    if (!found) console.log(`Not found in ${file}`);
});
