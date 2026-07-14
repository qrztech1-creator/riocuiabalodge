const fs = require('fs');
const file = 'public/pages/post.html';
let html = fs.readFileSync(file, 'utf8');

// The current HTML has <div class="blog-content-wrapper">\n    {{CONTENT}}\n  </div>
// We replace it with an absolute bulletproof flex container
const newWrapper = `
<div style="grid-column: 1 / -1; grid-row: 1 / -1; width: 100%; display: flex; justify-content: center; align-items: flex-start; z-index: 15;">
  <div class="blog-content-wrapper" style="max-width: 800px; width: 100%; padding: 2rem 1rem; margin: 0 auto; min-width: 0;">
    {{CONTENT}}
  </div>
</div>`;

html = html.replace(/<div class="blog-content-wrapper">[\s\S]*?\{\{CONTENT\}\}[\s\S]*?<\/div>/, newWrapper);

fs.writeFileSync(file, html);
console.log('Injected bulletproof flex wrapper');
