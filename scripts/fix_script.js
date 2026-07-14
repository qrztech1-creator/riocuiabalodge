const fs = require('fs');

const files = ['public/pages/inicio.html', 'public/pages/eventos.html', 'public/pages/blog.html'];

const searchStr = `            card.innerHTML = \`
                <div style="position: relative; height: 256px; overflow: hidden;">
                    \${post.coverImage && post.coverImage.endsWith('.mp4') 
                        ? '<video src="' + post.coverImage + '" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>'
                        : '<img src="' + post.coverImage + '" alt="' + post.title + '" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />'
                    }`;

const replaceStr = `            const thumb = post.thumbnailImage || post.coverImage;
            card.innerHTML = \`
                <div style="position: relative; height: 256px; overflow: hidden;">
                    \${thumb && thumb.endsWith('.mp4') 
                        ? '<video src="' + thumb + '" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>'
                        : '<img src="' + thumb + '" alt="' + post.title + '" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />'
                    }`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(searchStr)) {
        content = content.replace(searchStr, replaceStr);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find target string in ${file}`);
    }
});
