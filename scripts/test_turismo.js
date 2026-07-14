const fs = require('fs');
const html = fs.readFileSync('out_turismo.html', 'utf8');

const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
console.log("H1 in SSR HTML:", h1Match ? h1Match[1] : 'not found');

const contentMatch = html.match(/&quot;z15bpT&quot;:\[0,\{.*?&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/s);
if (contentMatch) {
   let content = contentMatch[1].replace(/\\&quot;/g, '"');
   console.log("z15bpT Images:");
   const imgMatches = content.match(/<img[^>]*src="([^"]+)"[^>]*>/g);
   if (imgMatches) {
     imgMatches.forEach(img => console.log(img));
   } else {
     console.log("No images found in content.");
   }
} else {
   console.log("z15bpT Content not found");
}
