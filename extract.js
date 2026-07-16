const fs=require('fs'); 
const content = fs.readFileSync('public/pages/inicio.html', 'utf8'); 
const start = content.indexOf('class="burger'); 
if (start > -1) { 
  console.log(content.substring(Math.max(0, start - 20), start + 300)); 
}
