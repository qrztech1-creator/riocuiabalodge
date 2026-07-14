const fs = require('fs');
const file = 'public/pages/inicio.html';
let html = fs.readFileSync(file, 'utf8');

// The hero youtube iframe needs scale to hide controls if they appear.
// Current style: pointer-events: none; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -1;
// By changing scale(1) to scale(1.15) we push the controls outside the screen.
html = html.replace('transform: translate(-50%, -50%);', 'transform: translate(-50%, -50%) scale(1.15);');
html = html.replace('disablekb=1&fs=0&modestbranding=1', 'disablekb=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0');
html = html.replace('transform: translate(-50%, -50%); z-index: -1;', 'transform: translate(-50%, -50%) scale(1.15); z-index: -1;');

fs.writeFileSync(file, html);
console.log('Fixed youtube hero in inicio.html');
