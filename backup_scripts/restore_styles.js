const fs = require('fs');
const cheerio = require('cheerio');
const inicio = fs.readFileSync('public/pages/inicio.html', 'utf8');
const pousada = fs.readFileSync('public/pages/pousada.html', 'utf8');

const $pousada = cheerio.load(pousada);
let largestStyle = '';
$pousada('style').each((i, el) => {
    let s = $pousada(el).html();
    if (s.length > largestStyle.length) largestStyle = s;
});

console.log('Largest style in pousada is:', largestStyle.length, 'bytes');

const $inicio = cheerio.load(inicio);
// Prepend this style to inicio's head
$inicio('head').append('<style>' + largestStyle + '</style>');
fs.writeFileSync('public/pages/inicio.html', $inicio.html());
console.log('Injected largest style into inicio.html');
