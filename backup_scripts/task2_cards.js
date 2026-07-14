const fs = require('fs');
const files = ['public/pages/inicio.html', 'public/pages/blog.html', 'public/pages/eventos.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Replace document.createElement('div') with document.createElement('a') specifically for the card
    // We can rely on the fact that the previous script injected this specific line:
    // const card = document.createElement('div');
    // card.onclick = () => { window.location.href = '/' + post.slug; };
    
    html = html.replace(
        "const card = document.createElement('div');\n            card.onclick = () => { window.location.href = '/' + post.slug; };",
        "const card = document.createElement('a');\n            card.href = '/' + post.slug;"
    );

    // If it doesn't match exactly, fallback to regex
    html = html.replace(/const card = document\.createElement\('div'\);\s*card\.onclick = \(\) => \{ window\.location\.href = '\/' \+ post\.slug; \};/g, "const card = document.createElement('a');\n            card.href = '/' + post.slug;");

    fs.writeFileSync(file, html);
    console.log(`Updated cards in ${file}`);
});
