const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');

// The main part of the post starts at <section class="block block--blog-header"
// and ends right before <section id="zdS1_7" class="block block--footer"

const startIndex = html.indexOf('<section class="block block--blog-header"');
const endIndex = html.indexOf('<section id="zdS1_7"');

if (startIndex !== -1 && endIndex !== -1) {
    console.log("--- MIDDLE PART TO REPLACE ---");
    console.log(html.substring(startIndex, endIndex));
} else {
    console.log("Could not find the bounds.");
}
