const http = require('http');

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function main() {
    // Check blog-list cards
    const blogHtml = await fetch('http://localhost:3000/blog-list');
    
    // Find our injected SSR posts
    const ssrStart = blogHtml.indexOf('id="ssr-injected-posts"');
    if (ssrStart === -1) {
        console.log('SSR posts NOT found');
        return;
    }
    
    // Extract the SSR section
    const ssrEnd = blogHtml.indexOf('</div>', ssrStart + 5000) + 6;
    const ssrSection = blogHtml.substring(ssrStart - 50, ssrStart + 3000);
    
    console.log('=== FIRST CARD HTML (first 1500 chars) ===');
    console.log(ssrSection.substring(0, 1500));
    
    // Check if the Zyro lightbox script exists
    const hasLightbox = blogHtml.includes('is-lightbox') || blogHtml.includes('ecommerce-modal') || blogHtml.includes('image-zoom');
    console.log('\n=== Lightbox related:', hasLightbox);
    
    // Check for Zyro scripts that might intercept clicks
    const scriptMatches = blogHtml.match(/<script[^>]*src="[^"]*"[^>]*>/g);
    console.log('\n=== External scripts ===');
    if (scriptMatches) scriptMatches.forEach(s => console.log(s));
}

main().catch(console.error);
