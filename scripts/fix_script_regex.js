const fs = require('fs');

const files = ['public/pages/inicio.html', 'public/pages/eventos.html', 'public/pages/blog.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if we already applied the fix
    if (content.includes('const thumb = post.thumbnailImage || post.coverImage;')) {
        console.log(`Already fixed ${file}`);
        return;
    }
    
    const regex = /card\.innerHTML\s*=\s*`\s*<div\s+style="position:\s*relative;\s*height:\s*256px;\s*overflow:\s*hidden;">\s*\$\{post\.coverImage\s*&&\s*post\.coverImage\.endsWith\('\.mp4'\)\s*\?\s*'<video src="'\s*\+\s*post\.coverImage\s*\+\s*'"\s*autoplay\s*muted\s*loop\s*playsinline\s*style="width:\s*100%;\s*height:\s*100%;\s*object-fit:\s*cover;"><\/video>'\s*:\s*'<img src="'\s*\+\s*post\.coverImage\s*\+\s*'"\s*alt="'\s*\+\s*post\.title\s*\+\s*'"\s*style="width:\s*100%;\s*height:\s*100%;\s*object-fit:\s*cover;"\s*loading="lazy"\s*\/>'\s*\}/g;

    const replaceStr = `const thumb = post.thumbnailImage || post.coverImage;
            card.innerHTML = \`
                <div style="position: relative; height: 256px; overflow: hidden;">
                    \${thumb && thumb.endsWith('.mp4') 
                        ? '<video src="' + thumb + '" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>'
                        : '<img src="' + thumb + '" alt="' + post.title + '" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />'
                    }`;

    if (regex.test(content)) {
        content = content.replace(regex, replaceStr);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file} with regex`);
    } else {
        console.log(`Could not find regex match in ${file}`);
    }
});
