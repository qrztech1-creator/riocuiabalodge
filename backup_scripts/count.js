const html = require('fs').readFileSync('../clone_10-dicas-para-pescar-dourado/index.html', 'utf8'); console.log(html.match(/<section id=.([^.]+)./g));
