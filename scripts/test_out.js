const fs = require('fs');
const html = fs.readFileSync('out_pescaria.html', 'utf8');

// Check if the title is actually "Pescaria Acontecendo!"
const nameMatch = html.match(/&quot;name&quot;:\[0,&quot;(.*?)&quot;\]/);
console.log("Name in JSON:", nameMatch ? nameMatch[1] : 'not found');

const contentMatch = html.match(/&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/);
if (contentMatch) {
   console.log("Content in JSON starts with:", contentMatch[1].substring(0, 100));
} else {
   console.log("Content not found in JSON");
}

const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
console.log("H1 in SSR HTML:", h1Match ? h1Match[1] : 'not found');
