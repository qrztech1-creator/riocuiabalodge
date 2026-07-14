const fs = require('fs');
const html = fs.readFileSync('public/pages/blog.html', 'utf8');
console.log(html.substring(html.length - 1000));
