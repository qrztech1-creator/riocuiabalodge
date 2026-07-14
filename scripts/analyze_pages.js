const fs = require('fs');

const extractPostsSection = (filepath) => {
    try {
        const html = fs.readFileSync(filepath, 'utf8');
        console.log(`\n\n--- ANALYZING ${filepath} ---`);
        // Search for some known text from blog posts
        // From BlogInjector, we know 'Turismo de Experiência' is there
        const index = html.indexOf('Turismo de Experiência');
        if (index !== -1) {
            console.log(html.substring(Math.max(0, index - 800), index + 800));
        } else {
            console.log('Could not find specific post text. Dumping search for "2 min".');
            const index2 = html.indexOf('2 min');
            if (index2 !== -1) {
                console.log(html.substring(Math.max(0, index2 - 800), index2 + 800));
            }
        }
    } catch (e) {
        console.log(`Error reading ${filepath}:`, e);
    }
};

extractPostsSection('public/pages/blog.html');
extractPostsSection('public/pages/eventos.html');
