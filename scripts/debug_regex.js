const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');

// Find the z15bpT content block
const regex = /(&quot;z15bpT&quot;:\[0,\{.*?)&quot;content&quot;:\[0,&quot;(.*?)&quot;\](.*?\}\])/s;
const m = html.match(regex);
if (m) {
    console.log('MATCH FOUND');
    console.log('Content start (first 200 decoded chars):');
    let content = m[2]
        .replace(/\\&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\\n/g, '\n');
    console.log(content.substring(0, 500));
    console.log('...');
    console.log('Content length:', content.length);
} else {
    console.log('NO MATCH - regex did not work');
    
    // Try to find z15bpT content section manually
    const idx = html.indexOf('z15bpT');
    // Find all instances
    let i = 0;
    let pos = 0;
    while ((pos = html.indexOf('z15bpT', pos)) !== -1) {
        i++;
        console.log(`Instance ${i} at position ${pos}:`);
        console.log(html.substring(pos, pos + 200));
        console.log('---');
        pos += 6;
    }
}
