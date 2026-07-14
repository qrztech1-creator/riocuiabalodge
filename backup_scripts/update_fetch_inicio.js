const fs = require('fs');
const file = 'public/pages/inicio.html';
if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('post.coverImage && post.coverImage')) {
        html = html.replace(/\$\{post\.coverImage/g, '${post.thumbnailImage || post.coverImage');
        fs.writeFileSync(file, html);
        console.log('Updated inicio.html');
    }
}
