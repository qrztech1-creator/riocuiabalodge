const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');

// Find where {{TITLE}} is
const titleIndex = html.indexOf('{{TITLE}}');
if (titleIndex !== -1) {
    console.log('--- AROUND {{TITLE}} ---');
    console.log(html.substring(Math.max(0, titleIndex - 500), titleIndex + 500));
}

// Find where {{CONTENT}} is
const contentIndex = html.indexOf('{{CONTENT}}');
if (contentIndex !== -1) {
    console.log('\n--- AROUND {{CONTENT}} ---');
    console.log(html.substring(Math.max(0, contentIndex - 500), contentIndex + 500));
}

// Find where {{COVER_IMAGE}} is
const coverIndex = html.indexOf('{{COVER_IMAGE}}');
if (coverIndex !== -1) {
    console.log('\n--- AROUND {{COVER_IMAGE}} ---');
    console.log(html.substring(Math.max(0, coverIndex - 500), coverIndex + 500));
}
