const fs = require('fs');
const html = fs.readFileSync('public/pages/blog.html', 'utf8');
const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  if (match[1].includes('/api/posts')) {
    console.log(match[0]);
  }
}
