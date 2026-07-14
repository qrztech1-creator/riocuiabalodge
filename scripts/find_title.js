const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const search = '10 dicas para pescar o seu primeiro dourado!';
const idx = html.indexOf(search);
if (idx !== -1) {
  // Let's find the block ID before it
  const sub = html.substring(Math.max(0, idx - 500), idx);
  console.log(sub);
} else {
  console.log("Title string not found, trying lowercase or without exclamation...");
  const idx2 = html.toLowerCase().indexOf('10 dicas para pescar');
  if (idx2 !== -1) {
      console.log(html.substring(Math.max(0, idx2 - 500), idx2 + 100));
  } else {
      console.log("Not found at all.");
  }
}
