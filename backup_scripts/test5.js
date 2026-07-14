const fs = require('fs');
const html = fs.readFileSync('src/app/[slug]/route.ts', 'utf8');
const start = html.indexOf('let finalContent = post.content;');
console.log(html.substring(start, start + 600));
