const fs = require('fs');
const file = 'public/pages/post.html';
let html = fs.readFileSync(file, 'utf8');

const regex = /<div class="blog-content-wrapper" style="[^"]*">/g;
html = html.replace(regex, '<div class="blog-content-wrapper">');

fs.writeFileSync(file, html);
console.log('Removed inline styles from wrapper');
