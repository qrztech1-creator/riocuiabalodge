const html = require('fs').readFileSync('public/pages/post.html', 'utf8');
const start = html.indexOf('<section id="z0YdBH"');
console.log(html.substring(start, html.indexOf('</section>', start) + 10));
