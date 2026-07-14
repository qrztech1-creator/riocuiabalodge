const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Thiago Manhães/Desktop/lodge3/web/public/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const urls = new Set();
const regex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s\"\'\>\)]*)?/g;

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const matches = content.match(regex);
  if (matches) {
    matches.forEach(m => urls.add(m));
  }
});

const ArrayUrls = Array.from(urls);
console.log('Total URLs found:', ArrayUrls.length);
console.log('Sample URLs:');
console.log(ArrayUrls.slice(0, 50).join('\n'));
