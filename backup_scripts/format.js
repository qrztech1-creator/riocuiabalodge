const fs = require('fs');
const html = fs.readFileSync('public/pages/inicio.html', 'utf8');

// A simple way to format HTML for line-by-line editing
const formatted = html
  .replace(/>\s*</g, '>\n<')
  .replace(/(<section[^>]*>)/g, '\n$1\n')
  .replace(/(<\/section>)/g, '\n$1\n')
  .replace(/(<div[^>]*>)/g, '\n$1\n')
  .replace(/(<\/div>)/g, '\n$1\n');

fs.writeFileSync('public/pages/inicio_pretty.html', formatted);
console.log('Done');
