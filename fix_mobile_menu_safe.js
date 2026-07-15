const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const injection = `
<style id="custom-mobile-menu-style">
/* Mobile Menu Override Fix */
.block-header-layout-mobile__dropdown.is-open {
  display: flex !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: #1a1a1a !important;
  z-index: 9999 !important;
  flex-direction: column !important;
  padding: 80px 40px !important;
  align-items: flex-end !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
  clip-path: none !important;
}
.burger.is-open {
  position: relative !important;
  z-index: 10000 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}
.burger.is-open .burger__meat {
  display: none !important;
}
.burger.is-open .burger__bun:first-child {
  transform: rotate(45deg) translate(2px, 5px) !important;
  background-color: #f9b233 !important;
}
.burger.is-open .burger__bun:last-child {
  transform: rotate(-45deg) translate(2px, -4px) !important;
  background-color: #f9b233 !important;
}
.block-header-layout-mobile__dropdown.is-open .block-header__nav-links {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-end !important;
  gap: 20px !important;
  opacity: 1 !important;
  visibility: visible !important;
}
.block-header-layout-mobile {
  position: static !important;
}
</style>
<script id="custom-mobile-menu-script">
  if (typeof window !== 'undefined') {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.burger');
      if (btn) {
        var dropdown = document.querySelector('.block-header-layout-mobile__dropdown');
        if (dropdown) {
          dropdown.classList.toggle('is-open');
          btn.classList.toggle('is-open');
        }
      }
    });
  }
</script>
</body>
`;

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (!content.includes('custom-mobile-menu-style')) {
    content = content.replace('</body>', injection);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Injected safely into ' + file);
  } else {
    console.log('Already injected in ' + file);
  }
});
