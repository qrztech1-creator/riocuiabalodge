const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('out_pescaria2.html', 'utf8');
const $ = cheerio.load(html);

// Find the z15bpT text-box content
const z15 = $('#z15bpT');
if (z15.length) {
    const content = z15.html();
    console.log('z15bpT HTML length:', content.length);
    console.log('z15bpT HTML first 2000:');
    console.log(content.substring(0, 2000));
    console.log('---');
    
    // Find all img src inside
    z15.find('img').each((i, el) => {
        console.log('IMG in z15bpT:', $(el).attr('src'));
    });
} else {
    console.log('z15bpT not found in rendered HTML');
}

// Also look at the JSON data for images
const imgRegex = /src=\\?"([^"]*?\.(?:jpg|jpeg|png|webp))"/gi;
const dataStart = html.indexOf('z15bpT');
const dataChunk = html.substring(dataStart, dataStart + 20000);
let m;
const imgs = new Set();
while ((m = imgRegex.exec(dataChunk)) !== null) {
    if (!m[1].includes('data:image') && !m[1].includes('logo')) {
        imgs.add(m[1]);
    }
}
console.log('\nImages near z15bpT in raw HTML:');
imgs.forEach(i => console.log(i));

// Check for the gallery images in the JSON data
const galleryRegex = /post-gallery/g;
const galleryMatches = html.match(galleryRegex);
console.log('\npost-gallery occurrences:', galleryMatches ? galleryMatches.length : 0);

// Look at ALL image paths in the file
const allImgs = new Set();
const allImgRegex = /(?:src|href)=(?:"|\\"|&quot;|\\&quot;)(https?:\/\/[^"\\&]*?\.(?:jpg|jpeg|png|webp))/gi;
while ((m = allImgRegex.exec(html)) !== null) {
    if (!m[1].includes('logo')) {
        allImgs.add(m[1].split('?')[0]);
    }
}
console.log('\nAll external image URLs:');
allImgs.forEach(i => console.log(i));
