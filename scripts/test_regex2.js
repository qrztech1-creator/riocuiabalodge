const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');

const match1 = html.match(/(&quot;z15bpT&quot;:\[0,\{.*?)&quot;content&quot;:\[0,&quot;.*?&quot;\](.*?\}\])/s);
console.log('z15bpT Match?', !!match1);

const match2 = html.match(/(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;coverImagePath&quot;:\[0,&quot;.*?&quot;\]/s);
console.log('coverImagePath Match?', !!match2);

const match3 = html.match(/(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;title&quot;:\[0,&quot;.*?&quot;\]/s);
console.log('title Match?', !!match3);

const match4 = html.match(/(&quot;zzY2Oo&quot;:\[0,\{.*?)&quot;videoSrc&quot;:\[0,&quot;.*?&quot;\]/s);
console.log('videoSrc Match?', !!match4);
