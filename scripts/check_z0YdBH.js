const fs = require('fs');
const html = fs.readFileSync('public/pages/post.html', 'utf8');

const searchStr = 'props="{&quot;pageData&quot;:';
const startIndex = html.indexOf(searchStr) + searchStr.length;
const endStr = '}]}" ssr client=';
const endIndexMatches = html.indexOf(endStr, startIndex);

let jsonStr = html.substring(startIndex, endIndexMatches + 2);
jsonStr = jsonStr.replace(/&quot;/g, '"');

const parsed = JSON.parse(jsonStr)[1];

const blockId = 'z0YdBH';
const blockData = parsed.blocks[1][blockId][1];
const components = blockData.components[1];

console.log('Components in z0YdBH:');
for (const compId of components) {
    const el = parsed.elements[compId][1];
    console.log(`- ${compId}: ${el.type[1]}`);
}
