const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('public/pages/inicio.html', 'utf8'));

// Inject Slider Fix
const sliderJs = `
<style>
/* CSS Scroll Snap Slider for Zyro Galleries */
.custom-scroll-slider {
    display: flex !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    gap: 15px !important;
    padding-bottom: 20px !important;
    -webkit-overflow-scrolling: touch !important;
}
.custom-scroll-slider::-webkit-scrollbar {
    height: 8px;
}
.custom-scroll-slider::-webkit-scrollbar-thumb {
    background-color: rgba(255, 208, 0, 0.5);
    border-radius: 4px;
}
.custom-scroll-slider > div {
    flex: 0 0 80% !important;
    scroll-snap-align: center !important;
    min-width: 250px !important;
}
@media (min-width: 768px) {
    .custom-scroll-slider > div { flex: 0 0 30% !important; }
}
</style>
<script>
window.addEventListener('load', () => {
    // Find grid-gallery which has multiple image children
    const galleries = document.querySelectorAll('div[class*="grid-gallery"], div[class*="gallery-slider"]');
    galleries.forEach(gal => {
        if (gal.children.length > 2) {
            gal.classList.add('custom-scroll-slider');
            // Remove any grid layout styles that Zyro adds inline
            gal.style.display = 'flex';
            gal.style.gridTemplateColumns = 'none';
        }
    });

    // Another possible class is block-gallery-slider or similar
    const blockGalleries = document.querySelectorAll('.block-gallery-layout, .block-gallery-slider');
    blockGalleries.forEach(gal => {
        if (gal.children.length > 2) {
            gal.classList.add('custom-scroll-slider');
            gal.style.display = 'flex';
            gal.style.gridTemplateColumns = 'none';
        }
    });
});
</script>
`;

$('body').append(sliderJs);

fs.writeFileSync('public/pages/inicio.html', $.html());
console.log('Slider fix injected');
