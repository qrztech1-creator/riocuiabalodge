const html = require('fs').readFileSync('public/pages/post.html', 'utf8');
const styles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
if (styles) {
  for (let s of styles) {
    if (s.includes('.blog-content-wrapper')) {
      console.log(s);
    }
  }
}
