const fs = require('fs');

const postHtmlFile = 'public/pages/post.html';
let html = fs.readFileSync(postHtmlFile, 'utf8');

const regex = /\.blog-content-wrapper \{([\s\S]*?)\}/;
html = html.replace(regex, `.blog-content-wrapper {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  align-self: start;
  z-index: 14;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  width: 100%;
  min-width: 0;
  justify-self: center; /* Crucial for grid centering */
  font-family: var(--font-primary, sans-serif);
  color: var(--color-light-dark, #333);
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}`);

// Ensure images are responsive
if (!html.includes('.blog-content-wrapper img {')) {
  html = html.replace('</style>', `
.blog-content-wrapper img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 2rem auto;
}
.blog-content-wrapper .post-image-container {
  max-width: 100%;
  width: 100%;
  overflow: hidden;
}
</style>`);
}

fs.writeFileSync(postHtmlFile, html);
console.log('Fixed CSS wrapper styles for mobile responsiveness');
