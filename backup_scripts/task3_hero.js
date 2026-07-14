const fs = require('fs');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

const iframeHtml = `<iframe src="https://www.youtube.com/embed/vNTGe9Tr8OI?autoplay=1&mute=1&loop=1&playlist=vNTGe9Tr8OI&controls=0&showinfo=0&rel=0" title="riocuiabalodge" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="block-background__video--fixed block-background__image" style="pointer-events: none; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></iframe>`;

html = html.replace(/<video src="\/assets\/inicio\/asset_23\.mp4"[^>]*><\/video>/, iframeHtml);

fs.writeFileSync(file, html);
console.log('Replaced hero video');
