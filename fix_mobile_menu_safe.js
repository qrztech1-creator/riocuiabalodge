const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const injection = `
<style id="custom-mobile-menu-style">
@media (max-width: 991px) {
  /* Make the header container relative so the dropdown can sit below it */
  .block-header-layout-mobile {
    position: relative !important;
  }

  /* Force the dropdown to show up right below the header */
  .block-header-layout-mobile__dropdown.is-open {
    display: flex !important;
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background-color: #1a1a1a !important;
    z-index: 99999 !important;
    flex-direction: column !important;
    padding: 40px 40px !important;
    align-items: flex-end !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    clip-path: none !important;
  }

  /* Force visibility on all children */
  .block-header-layout-mobile__dropdown.is-open * {
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* Fix the list direction */
  .block-header-layout-mobile__dropdown.is-open ul {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    gap: 15px !important;
  }

  /* Fix the burger icon to form a perfect X */
  .burger.is-open {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }
  .burger.is-open .burger__meat {
    display: none !important;
  }
  .burger.is-open .burger__bun:first-of-type {
    transform: translateY(8px) rotate(45deg) !important;
    background-color: #f9b233 !important;
  }
  .burger.is-open .burger__bun:last-of-type {
    transform: translateY(-8px) rotate(-45deg) !important;
    background-color: #f9b233 !important;
  }
}
</style>
<script id="custom-mobile-menu-script">
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      // Add Admin button below WhatsApp button
      const wppBtn = document.querySelector('.block-header-layout-mobile__dropdown a[href*="whatsapp.com"]');
      if (wppBtn && wppBtn.parentElement) {
        wppBtn.parentElement.style.display = 'flex';
        wppBtn.parentElement.style.flexDirection = 'column';
        wppBtn.parentElement.style.alignItems = 'flex-end';
        wppBtn.parentElement.style.gap = '10px';
        
        if (!document.getElementById('admin-btn-mobile')) {
          const adminBtn = document.createElement('a');
          adminBtn.id = 'admin-btn-mobile';
          adminBtn.href = '/admin';
          adminBtn.textContent = 'Admin';
          adminBtn.className = wppBtn.className;
          adminBtn.style.cssText = 'background-color: transparent !important; border: 1px solid white !important; color: white !important; width: 100%; text-align: center;';
          wppBtn.parentElement.appendChild(adminBtn);
        }
      }
    });

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.burger');
      if (btn) {
        var dropdown = document.querySelector('.block-header-layout-mobile__dropdown');
        if (dropdown) {
          dropdown.classList.toggle('is-open');
          btn.classList.toggle('is-open');
          
          if (dropdown.classList.contains('is-open')) {
             dropdown.style.setProperty('display', 'flex', 'important');
             document.body.style.overflow = 'hidden'; // Prevent background scrolling
          } else {
             dropdown.style.setProperty('display', 'none', 'important');
             document.body.style.overflow = '';
          }
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
  
  // Clean up any old injections if they exist
  content = content.replace(/<style id="custom-mobile-menu-style">[\s\S]*?<\/script>\s*<\/body>/g, '</body>');
  
  if (!content.includes('custom-mobile-menu-style')) {
    content = content.replace('</body>', injection);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Injected safely into ' + file);
  }
});
