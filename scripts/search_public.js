const fs = require('fs');
const path = require('path');

function search(dir, keyword) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath, keyword);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(keyword)) {
        console.log(`Found in: ${fullPath}`);
      }
    }
  }
}

search('./public', '/api/posts');
