const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');

const footerIndex = html.indexOf('<section id="zdS1_7"');
if (footerIndex !== -1) {
    // Find the end of the header section by searching backwards from {{TITLE}}
    const titleIndex = html.indexOf('{{TITLE}}');
    
    // We can just find the previous </section> or </header>
    const headerEndIndex = html.lastIndexOf('</header>', titleIndex);
    
    if (headerEndIndex !== -1) {
        // The middle part is between headerEndIndex + 9 and footerIndex
        console.log(html.substring(headerEndIndex + 9, footerIndex));
    } else {
        console.log('Could not find header end');
    }
} else {
    console.log('Could not find footer start');
}
