const fs = require('fs');
const html = fs.readFileSync('out_confra.html', 'utf8');

const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
console.log("H1 in SSR HTML:", h1Match ? h1Match[1] : 'not found');

const contentMatch = html.match(/&quot;z15bpT&quot;:\[0,\{.*?&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/s);
if (contentMatch) {
   console.log("z15bpT Content starts with:", contentMatch[1].substring(0, 100));
} else {
   console.log("z15bpT Content not found");
}
