const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const regex = /(&quot;z15bpT&quot;:\[0,\{.*?)&quot;content&quot;:\[0,&quot;.*?&quot;\](.*?\}\])/s;
console.log('Matches:', regex.test(html));
