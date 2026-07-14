const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const regex = /(&quot;z15bpT&quot;:\[0,\{.*?)&quot;content&quot;:\[0,&quot;.*?&quot;\](.*?\}\])/s;
const match = html.match(regex);
console.log(match ? 'Match successful' : 'Match failed');
if (!match) {
    const backupRegex = /(&quot;z15bpT&quot;:\[0,\{)/s;
    console.log("z15bpT present?", !!html.match(backupRegex));
    const contentRegex = /&quot;content&quot;:\[0,&quot;.*?&quot;\]/s;
    console.log("content present?", !!html.match(contentRegex));
}
