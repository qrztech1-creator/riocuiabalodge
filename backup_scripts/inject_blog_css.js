const fs = require('fs');

const postHtmlFile = 'public/pages/post.html';
let html = fs.readFileSync(postHtmlFile, 'utf8');

const customCSS = `
<style>
.blog-content-wrapper {
  grid-area: 1 / 1 / 2 / 2;
  z-index: 14;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  width: 100%;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  justify-self: center; /* Crucial for grid centering */
  font-family: var(--font-primary, sans-serif);
  color: var(--color-light-dark, #333);
}

.blog-content-wrapper p {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #4a4a4a;
}

.blog-content-wrapper h2, .blog-content-wrapper h3 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.blog-content-wrapper h3 {
  font-size: 1.5rem;
  margin-top: 2rem;
}

.blog-content-wrapper ul, .blog-content-wrapper ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4a4a4a;
}

.blog-content-wrapper li {
  margin-bottom: 0.5rem;
}

.blog-content-wrapper strong {
  font-weight: 700;
  color: #1a1a1a;
}
</style>
`;

if (html.includes('.blog-content-wrapper p {')) {
  // already injected
  console.log('Styles already exist');
} else {
  // Inject before </head>
  html = html.replace('</head>', customCSS + '\n</head>');
  fs.writeFileSync(postHtmlFile, html);
  console.log('Injected custom CSS into post.html');
}
