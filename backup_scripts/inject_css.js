const fs = require('fs');
const path = require('path');

const cssFix = `
<style>
section.block--desktop-first-visible {
    padding-top: calc(var(--header-height, 0px) + var(--block-padding-top, 0px)) !important;
}
@media (max-width: 920px) {
    section.block--mobile-first-visible {
        padding-top: calc(var(--header-height-mobile, var(--header-height, 0px)) + var(--block-padding-top, 0px)) !important;
    }
}
</style>
`;

const dir = path.join(process.cwd(), 'public', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  if (!html.includes('calc(var(--header-height')) {
    html = html.replace('</head>', cssFix + '</head>');
    fs.writeFileSync(filePath, html);
    console.log(`Injected into ${file}`);
  } else {
    console.log(`Already injected in ${file}`);
  }
}
