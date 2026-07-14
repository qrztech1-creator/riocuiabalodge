const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const dir = 'public/pages';
const assetsDir = 'public/assets/zyro';

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Regex to capture URLs. We stop at quotes, spaces, parentheses, and ampersands (like &quot;)
// We also exclude video extensions.
const urlRegex = /https:\/\/assets\.zyrosite\.com\/[^"'\s\)\&]+/g;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let uniqueUrls = new Set();
let fileContents = {};

// Step 1: Collect all URLs
for (const file of files) {
  const filePath = path.join(dir, file);
  const html = fs.readFileSync(filePath, 'utf8');
  fileContents[file] = html;
  
  const matches = html.match(urlRegex);
  if (matches) {
    matches.forEach(m => {
      // Exclude videos
      if (!m.endsWith('.mp4') && !m.endsWith('.webm') && !m.endsWith('.mov')) {
        uniqueUrls.add(m);
      }
    });
  }
}

const urlMap = {};
const urlsArray = Array.from(uniqueUrls);

urlsArray.forEach(url => {
  const hash = crypto.createHash('md5').update(url).digest('hex');
  // Try to find extension
  let ext = '.jpg';
  if (url.includes('.png')) ext = '.png';
  else if (url.includes('.svg')) ext = '.svg';
  else if (url.includes('.webp')) ext = '.webp';
  else if (url.includes('.gif')) ext = '.gif';
  else if (url.includes('.jpeg')) ext = '.jpeg';
  
  const localFileName = hash + ext;
  urlMap[url] = {
    localPath: '/assets/zyro/' + localFileName,
    diskPath: path.join(assetsDir, localFileName)
  };
});

console.log(`Found ${urlsArray.length} unique image URLs to download.`);

// Step 2: Download function
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      resolve(); // Already downloaded
      return;
    }
    
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        console.error(`Failed to download ${url}: ${response.statusCode}`);
        file.close();
        fs.unlink(dest, () => reject(new Error(`Status ${response.statusCode}`)));
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err.message);
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Step 3: Execute downloads in parallel with concurrency limit
async function downloadAll() {
  const concurrency = 10;
  let active = 0;
  let index = 0;
  let completed = 0;

  return new Promise((resolve) => {
    function next() {
      if (index >= urlsArray.length && active === 0) {
        resolve();
        return;
      }
      while (active < concurrency && index < urlsArray.length) {
        const url = urlsArray[index++];
        active++;
        downloadFile(url, urlMap[url].diskPath)
          .then(() => {
            completed++;
            if (completed % 20 === 0) console.log(`Downloaded ${completed}/${urlsArray.length}`);
          })
          .catch(e => console.error(e))
          .finally(() => {
            active--;
            next();
          });
      }
    }
    next();
  });
}

// Step 4: Replace in files
function replaceInFiles() {
  for (const file of files) {
    let html = fileContents[file];
    
    // Replace all URLs
    for (const url of urlsArray) {
      const { localPath } = urlMap[url];
      // Escape URL for regex replacing globally
      // It's safer to just split and join
      html = html.split(url).join(localPath);
    }
    
    fs.writeFileSync(path.join(dir, file), html, 'utf8');
    console.log(`Updated ${file}`);
  }
}

// Run
(async () => {
  console.log("Starting downloads...");
  await downloadAll();
  console.log("All downloads complete.");
  console.log("Replacing URLs in HTML files...");
  replaceInFiles();
  console.log("Done.");
})();
