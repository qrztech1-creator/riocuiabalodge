const fs = require('fs');
const html = fs.readFileSync('out_pescaria2.html', 'utf8');

const contentMatch = html.match(/&quot;z15bpT&quot;:\[0,\{.*?&quot;content&quot;:\[0,&quot;(.*?)&quot;\]/s);
if (contentMatch) {
   let content = contentMatch[1].replace(/\\&quot;/g, '"');
   console.log("Images found in z15bpT content:", (content.match(/<img/g) || []).length);
   console.log("Galleries found:", (content.match(/class="post-gallery"/g) || []).length);
}
