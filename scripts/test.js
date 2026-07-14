
window.addEventListener('scroll', function() {
  const headerLayouts = document.querySelectorAll('.block-layout--header, header, [data-block-id="header"]');
  headerLayouts.forEach(header => {
    const bg = header.querySelector('.block-background') || header;
    if (window.scrollY > 0) {
      bg.style.setProperty('background-color', 'rgb(26, 26, 26)', 'important');
      bg.style.transition = 'background-color 0.2s';
    } else {
      bg.style.backgroundColor = '';
    }
  });
});

setInterval(function() {
  // 1. YouTube video
  const vids = document.querySelectorAll('video');
  vids.forEach(vid => {
    if(vid.src && vid.src.includes('asset_23')) {
      vid.style.display = 'none';
      if(!vid.dataset.iframeInjected) {
        vid.dataset.iframeInjected = "true";
        const iframe = document.createElement('iframe');
        const videoId = 'vNTGe9Tr8OI';
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&mute=1&loop=1&playlist=' + videoId + '&controls=0&showinfo=0&rel=0';
        iframe.className = vid.className;
        iframe.style.width = '100vw';
        iframe.style.height = '56.25vw';
        iframe.style.minHeight = '100vh';
        iframe.style.minWidth = '177.77vh';
        iframe.style.position = 'absolute';
        iframe.style.top = '50%';
        iframe.style.left = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
        iframe.style.pointerEvents = 'none';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen');
        vid.parentNode.appendChild(iframe);
      }
    }
  });

  // 2. Instagram overrides
  const instaFeed = document.querySelector('.instagram-feed');
  if (instaFeed) {
    let customCount = 0;
    Array.from(instaFeed.children).forEach(child => {
      if (!child.classList.contains('custom-ig-iframe')) {
        child.style.cssText = "display: none !important; position: absolute !important; width: 0 !important; height: 0 !important; overflow: hidden !important;"; child.remove();
      } else {
        customCount++;
      }
    });
    
    if (customCount < 4) {
      Array.from(instaFeed.querySelectorAll('.custom-ig-iframe')).forEach(el => el.remove());
      
      const urls = [
        'https://www.instagram.com/p/DIEK4aguFXF/embed',
        'https://www.instagram.com/p/DLOUnZuMKpd/embed',
        'https://www.instagram.com/p/Daie2cHIcMu/embed',
        'https://www.instagram.com/p/Dag3sYwF6Rh/embed'
      ];
      
      urls.forEach(url => {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '450px';
        iframe.style.border = '0';
        iframe.style.borderRadius = '12px';
        iframe.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        iframe.style.background = '#fff';
        iframe.className = 'custom-ig-iframe';
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allowtransparency', 'true');
        instaFeed.appendChild(iframe);
      });
    }
  }
}, 500);

