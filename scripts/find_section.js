const fs = require('fs');

const findSectionBounds = (filepath) => {
    const html = fs.readFileSync(filepath, 'utf8');
    const token = 'Turismo de Experiência';
    const index = html.indexOf(token);
    if (index === -1) {
        console.log('Token not found in ' + filepath);
        return;
    }
    
    // Find the closest <section> before this token
    const sectionStart = html.lastIndexOf('<section ', index);
    const sectionEnd = html.indexOf('</section>', index) + 10;
    
    if (sectionStart !== -1 && sectionEnd !== -1) {
        console.log(`\n\n--- SECTION IN ${filepath} ---`);
        console.log('Starts at:', sectionStart);
        console.log('Ends at:', sectionEnd);
        // Print first 200 chars and last 200 chars of section
        const sectionContent = html.substring(sectionStart, sectionEnd);
        console.log(sectionContent.substring(0, 200) + '\n...\n' + sectionContent.substring(sectionContent.length - 200));
    }
};

findSectionBounds('public/pages/blog.html');
findSectionBounds('public/pages/eventos.html');
