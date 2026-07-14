const fs = require('fs');

const files = ['public/pages/index.html', 'public/pages/blog.html', 'public/pages/eventos.html'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace the image line in the dynamic script
    const oldImgLine = 'post.coverImage && post.coverImage.endsWith(\\\'.mp4\\\')';
    // wait, I need to replace wherever coverImage is used for the source.
    // Let's replace `post.coverImage` with `(post.thumbnailImage || post.coverImage)` where it sets the src.
    
    html = html.replace(/\\$\\{post\\.coverImage/g, '\\${post.thumbnailImage || post.coverImage');
    
    fs.writeFileSync(file, html);
    console.log(`Updated dynamic fetch in ${file}`);
  }
}
