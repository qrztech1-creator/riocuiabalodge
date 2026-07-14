const fs = require('fs');

const getSurrounding = (file) => {
    const html = fs.readFileSync(file, 'utf8');
    const start = html.indexOf('<header');
    const end = html.indexOf('</header>') + 9;
    
    const before = html.substring(start - 200, start);
    const after = html.substring(end, end + 200);
    
    return { before, after };
};

console.log('--- INICIO ---');
console.log(getSurrounding('public/pages/inicio.html'));

console.log('\n--- POST ---');
console.log(getSurrounding('public/pages/post.html'));
