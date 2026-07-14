const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

const PAGES_DIR = path.join(__dirname, 'public', 'pages');
const BACKUP_DIR = path.join(__dirname, 'public', 'pages_backup_after_routes');
const ASSETS_DIR = path.join(__dirname, 'public', 'assets', 'local');
const ASSETS_PUBLIC_PATH = '/assets/local';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Restore from backup
if (fs.existsSync(BACKUP_DIR)) {
    console.log('Restoring HTML files from backup...');
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.html'));
    for (const f of files) {
        fs.copyFileSync(path.join(BACKUP_DIR, f), path.join(PAGES_DIR, f));
    }
}

// Helper to download a file
function download(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      return resolve(true);
    }
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirUrl = res.headers.location;
        if (!redirUrl.startsWith('http')) redirUrl = new URL(redirUrl, url).href;
        return resolve(download(redirUrl, destPath));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getExt(urlStr, defaultExt = '.bin') {
    try {
        const urlObj = new URL(urlStr);
        let ext = path.extname(urlObj.pathname);
        if (urlStr.includes('google-fonts/font-faces')) return '.css';
        if (urlStr.includes('fonts.gstatic.com')) return '.woff2';
        if (!ext) return defaultExt;
        return ext;
    } catch(e) {
        return defaultExt;
    }
}

const linkCssRegex = /<link[^>]+href="([^"]+)"[^>]*>/gi;
const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*>/gi;
const cssUrlRegex = /url\((?:['"]?)([^'"\)]+)(?:['"]?)\)/gi;

async function processCss(cssUrl, localCssPath, publicCssPath) {
    let cssContent = fs.readFileSync(localCssPath, 'utf8');
    const urlMatches = [...cssContent.matchAll(cssUrlRegex)];
    let modified = false;
    
    for (const match of urlMatches) {
        let rawUrl = match[1];
        if (rawUrl.startsWith('data:') || rawUrl.startsWith('#') || rawUrl.startsWith(ASSETS_PUBLIC_PATH)) continue;
        // Zyro fonts sometimes have escaped quotes in rawUrl
        rawUrl = rawUrl.replace(/\\"/g, '').replace(/\\'/g, '');

        let absoluteUrl = rawUrl;
        if (!rawUrl.startsWith('http')) {
            absoluteUrl = new URL(rawUrl, cssUrl).href;
        }
        
        const ext = getExt(absoluteUrl, '');
        const hash = crypto.createHash('md5').update(absoluteUrl).digest('hex');
        const localFileName = `font_img_${hash}${ext}`;
        const localFilePath = path.join(ASSETS_DIR, localFileName);
        const publicPath = `${ASSETS_PUBLIC_PATH}/${localFileName}`;
        
        try {
            console.log(`Downloading CSS asset: ${absoluteUrl}`);
            await download(absoluteUrl, localFilePath);
            cssContent = cssContent.split(match[1]).join(publicPath);
            modified = true;
        } catch (e) {
            console.error(`Failed to download CSS asset ${absoluteUrl}: ${e.message}`);
        }
    }
    
    if (modified) {
        fs.writeFileSync(localCssPath, cssContent);
    }
}

async function main() {
    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(PAGES_DIR, file);
        let html = fs.readFileSync(filePath, 'utf8');
        
        const cssMatches = [...html.matchAll(linkCssRegex)];
        for (const match of cssMatches) {
            const tag = match[0];
            const url = match[1].replace(/&amp;/g, '&');
            
            if ((tag.includes('rel="stylesheet"') || tag.includes('as="style"') || tag.includes('rel="preload"')) && url.startsWith('http')) {
                const ext = getExt(url, '.css');
                const hash = crypto.createHash('md5').update(url).digest('hex');
                const localFileName = `style_${hash}${ext}`;
                const localFilePath = path.join(ASSETS_DIR, localFileName);
                const publicPath = `${ASSETS_PUBLIC_PATH}/${localFileName}`;
                
                try {
                    console.log(`Downloading CSS: ${url}`);
                    // Always re-download and re-process to avoid partial state
                    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
                    await download(url, localFilePath);
                    await processCss(url, localFilePath, publicPath);
                    html = html.split(match[1]).join(publicPath);
                } catch (e) {
                    console.error(`Failed to download CSS ${url}: ${e.message}`);
                }
            }
        }
        
        const scriptMatches = [...html.matchAll(scriptRegex)];
        for (const match of scriptMatches) {
            const url = match[1].replace(/&amp;/g, '&');
            if (url.startsWith('http') && !url.includes('youtube.com') && !url.includes('vimeo.com') && !url.includes('instagram.com')) {
                const ext = getExt(url, '.js');
                const hash = crypto.createHash('md5').update(url).digest('hex');
                const localFileName = `script_${hash}${ext}`;
                const localFilePath = path.join(ASSETS_DIR, localFileName);
                const publicPath = `${ASSETS_PUBLIC_PATH}/${localFileName}`;
                
                try {
                    console.log(`Downloading JS: ${url}`);
                    await download(url, localFilePath);
                    html = html.split(match[1]).join(publicPath);
                } catch (e) {
                    console.error(`Failed to download JS ${url}: ${e.message}`);
                }
            }
        }
        
        const zyroImgRegex = /https:\/\/assets\.zyrosite\.com\/[^"'\s\)\&]+/g;
        const zyroMatches = html.match(zyroImgRegex) || [];
        for (const url of zyroMatches) {
             if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')) continue;
             
             const ext = getExt(url, '.jpg');
             const hash = crypto.createHash('md5').update(url).digest('hex');
             const localFileName = hash + ext;
             const localFilePath = path.join(__dirname, 'public', 'assets', 'zyro', localFileName);
             const publicPath = `/assets/zyro/${localFileName}`;
             
             try {
                if (!fs.existsSync(localFilePath)) {
                    const dirPath = path.dirname(localFilePath);
                    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
                    await download(url, localFilePath);
                }
                html = html.split(url).join(publicPath);
             } catch(e) {
                console.error(`Failed to download zyro image ${url}: ${e.message}`);
             }
        }

        fs.writeFileSync(filePath, html);
        console.log(`Updated ${file}`);
    }
}

main().catch(console.error);
