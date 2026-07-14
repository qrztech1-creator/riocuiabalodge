const fs = require('fs');

const extractHeader = (file) => {
    const html = fs.readFileSync(file, 'utf8');
    const start = html.indexOf('<header');
    const end = html.indexOf('</header>') + 9;
    return html.substring(start, end);
};

const headerInicio = extractHeader('public/pages/inicio.html');
const headerPost = extractHeader('public/pages/post.html');

fs.writeFileSync('header_inicio.html', headerInicio);
fs.writeFileSync('header_post.html', headerPost);
console.log('Headers extracted.');
