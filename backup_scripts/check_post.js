const fs = require('fs');
const html = fs.readFileSync('test_post_out.html', 'utf8');
console.log('Length:', html.length);
console.log('Contains test post paragraph?', html.includes('This is a test post'));
console.log('Contains block-layout?', html.includes('class="block-layout'));
