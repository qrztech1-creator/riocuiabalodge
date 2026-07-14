const fs = require('fs');

const html = fs.readFileSync('public/pages/10-dicas-para-pescar-dourado.html', 'utf8');
const searchStr = 'props="{&quot;pageData&quot;:';
const startIndex = html.indexOf(searchStr);

if (startIndex !== -1) {
    const jsonStart = startIndex + searchStr.length;
    let braceCount = 0;
    let jsonEnd = jsonStart;
    
    // The JSON is encoded in HTML entities, but let's just find the closing }&quot;"
    const endStr = '}]}" ssr client=';
    const endIndexMatches = html.indexOf(endStr, jsonStart);
    
    if (endIndexMatches !== -1) {
        let jsonStr = html.substring(jsonStart, endIndexMatches + 2);
        // Decode HTML entities
        jsonStr = jsonStr.replace(/&quot;/g, '"');
        
        try {
            const parsed = JSON.parse(jsonStr);
            const data = parsed[1];
            
            console.log('z15bpT settings:', JSON.stringify(data.elements.z15bpT[1], null, 2));
            console.log('z0YdBH (section) settings:', JSON.stringify(data.pages[1].zbLn2C[1].blocks[1].find(b => b[1] === 'z0YdBH') || data.blocks[1].z0YdBH[1], null, 2));
        } catch (e) {
            console.error('Failed to parse:', e.message);
            console.log(jsonStr.substring(0, 100));
        }
    } else {
        console.log('Could not find end of JSON');
    }
}
