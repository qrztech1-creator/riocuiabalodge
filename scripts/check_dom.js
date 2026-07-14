const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('public/pages/post.html', 'utf8');
const $ = cheerio.load(html);
const z15bpT = $('#z15bpT');
console.log('z15bpT parent id:', z15bpT.parent().attr('id'));
console.log('z15bpT parent class:', z15bpT.parent().attr('class'));
console.log('z15bpT parent parent id:', z15bpT.parent().parent().attr('id'));
console.log('z15bpT parent parent class:', z15bpT.parent().parent().attr('class'));
