const fs = require('fs');
const html = fs.readFileSync('public/pages/inicio.html', 'utf8');
const start = html.indexOf('<div data-v-b99b1992="" data-v-1120e899="" class="block-blog-list-item"');
if (start === -1) {
    console.log("NOT FOUND");
} else {
    // We need to find the matching closing div for this block-blog-list-item.
    let depth = 1;
    let curr = start + 1;
    while (depth > 0 && curr < html.length) {
        const nextDivStart = html.indexOf('<div', curr);
        const nextDivEnd = html.indexOf('</div', curr);
        
        if (nextDivStart !== -1 && nextDivStart < nextDivEnd) {
            depth++;
            curr = nextDivStart + 1;
        } else if (nextDivEnd !== -1) {
            depth--;
            curr = nextDivEnd + 1;
        } else {
            break;
        }
    }
    const end = html.indexOf('>', curr) + 1;
    console.log(html.substring(start, end));
}
