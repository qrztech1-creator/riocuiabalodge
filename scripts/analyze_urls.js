const fs = require('fs');
const path = require('path');

const dir = 'public/pages';
const files = fs.readdirSync(dir);
const uniqueUrls = new Set();
let totalOccurrences = 0;

const regex = /https:\/\/assets\.zyrosite\.com\/[^"'\s\)]+/g;

for (const file of files) {
  if (file.endsWith('.html')) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    const matches = html.match(regex);
    if (matches) {
      matches.forEach(m => {
        totalOccurrences++;
        // Keep the raw URL to understand what it looks like
        uniqueUrls.add(m);
      });
    }
  }
}

console.log(`Found ${totalOccurrences} total occurrences of assets.zyrosite.com`);
console.log(`Found ${uniqueUrls.size} unique URLs.`);

// Let's sample 10 of them
const sample = Array.from(uniqueUrls).slice(0, 10);
console.log("Sample URLs:");
sample.forEach(url => console.log(url));
