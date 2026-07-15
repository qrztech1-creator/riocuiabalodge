const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Clean up any old injections if they exist
  content = content.replace(/<style id="custom-mobile-menu-style">[\s\S]*?<\/script>\s*<\/body>/g, '</body>');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Cleaned ' + file);
});
