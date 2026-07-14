const fs = require('fs');

const file = 'public/pages/post.html';
let html = fs.readFileSync(file, 'utf8');

const script = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  if (header) {
    header.style.transition = 'background-color 0.3s ease';
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
      } else {
        header.style.backgroundColor = 'transparent';
      }
    });
  }
});
</script>
`;

if (!html.includes('header.style.backgroundColor')) {
  html = html.replace('</body>', script + '\n</body>');
  fs.writeFileSync(file, html);
  console.log('Fixed sticky header on post.html');
} else {
  console.log('Sticky header fix already applied');
}
