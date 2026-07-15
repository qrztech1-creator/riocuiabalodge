const fs = require('fs');
const path = require('path');

const replacements = [
  {
    find: /\/assets\/depoimentos\/asset_11\.mp4/g,
    replace: 'https://videos.pexels.com/video-files/2736469/2736469-uhd_3840_2160_30fps.mp4'
  },
  {
    find: /\/assets\/asset_11\.mp4/g,
    replace: 'https://videos.pexels.com/video-files/2736469/2736469-uhd_3840_2160_30fps.mp4'
  },
  {
    find: /\/assets\/contato\/asset_8\.mp4/g,
    replace: 'https://videos.pexels.com/video-files/4317425/4317425-uhd_2560_1440_24fps.mp4'
  },
  {
    find: /\/assets\/blog\/asset_8\.mp4/g, // Just in case
    replace: 'https://videos.pexels.com/video-files/4317425/4317425-uhd_2560_1440_24fps.mp4'
  },
  {
    find: /\/assets\/asset_8\.mp4/g,
    replace: 'https://videos.pexels.com/video-files/4317425/4317425-uhd_2560_1440_24fps.mp4'
  },
  {
    find: /\/assets\/eventos\/asset_18\.mp4/g,
    replace: 'https://videos.pexels.com/video-files/2856110/2856110-uhd_3840_2160_30fps.mp4'
  },
  {
    find: /\/assets\/asset_18\.mp4/g,
    replace: 'https://videos.pexels.com/video-files/2856110/2856110-uhd_3840_2160_30fps.mp4'
  }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.tsx') || fullPath.endsWith('.txt')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rule of replacements) {
        if (rule.find.test(content)) {
          content = content.replace(rule.find, rule.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

console.log('Replacing video URLs in public/pages...');
processDirectory(path.join(__dirname, '../public/pages'));

if (fs.existsSync(path.join(__dirname, '../public/pages_backup_after_routes'))) {
  processDirectory(path.join(__dirname, '../public/pages_backup_after_routes'));
}

console.log('Replacing video URLs in src/app...');
processDirectory(path.join(__dirname, '../src/app'));

console.log('Replacing video URLs in scripts/ (if any output.html etc)...');
processDirectory(__dirname);

console.log('Done.');
