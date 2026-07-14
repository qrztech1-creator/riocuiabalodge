const fs = require('fs');

const files = ['public/pages/inicio.html', 'public/pages/blog.html', 'public/pages/eventos.html'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Find the start of the innerHTML template literal
    const start = html.indexOf('card.innerHTML = `');
    if (start !== -1) {
        const end = html.indexOf('`;', start);
        let innerHtml = html.substring(start, end);
        
        // We will replace the whole video/img ternary with a correct one
        const imgLogic = "${post.thumbnailImage ? '<img src=\"' + post.thumbnailImage + '\" alt=\"' + post.title + '\" style=\"width: 100%; height: 100%; object-fit: cover;\" loading=\"lazy\" />' : (post.coverImage && post.coverImage.endsWith('.mp4') ? '<video src=\"' + post.coverImage + '\" autoplay muted loop playsinline style=\"width: 100%; height: 100%; object-fit: cover;\"></video>' : '<img src=\"' + post.coverImage + '\" alt=\"' + post.title + '\" style=\"width: 100%; height: 100%; object-fit: cover;\" loading=\"lazy\" />')}";
        
        // We need to replace the old ternary inside the template literal.
        // Let's use regex to match the old logic
        const oldLogicRegex = /\$\{.*?<\/video>'\s*:\s*'<img src="'.*?loading="lazy" \/>'\s*\}/gs;
        
        innerHtml = innerHtml.replace(oldLogicRegex, imgLogic);
        
        html = html.substring(0, start) + innerHtml + html.substring(end);
        fs.writeFileSync(file, html);
        console.log(`Updated ${file}`);
    }
  }
}
