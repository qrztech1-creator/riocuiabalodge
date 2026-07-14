import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

function encodeForZyroJson(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const post = await prisma.post.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.next();
    }

    let templatePath = path.join(process.cwd(), `public/pages/${slug}.html`);
    if (!fs.existsSync(templatePath)) {
      templatePath = path.join(process.cwd(), 'public/pages/post.html');
    }
    let html = '';
    
    try {
      html = fs.readFileSync(templatePath, 'utf8');
    } catch (err) {
      console.error('Template not found', err);
      return new NextResponse('Template not found', { status: 500 });
    }

    const date = new Date(post.createdAt).toLocaleDateString('pt-BR');

    let finalContent = post.content;
    
    // Support natural language formatting: convert newlines to <br> if not already formatted
    if (!finalContent.includes('<p>') && !finalContent.includes('<br')) {
      finalContent = finalContent.replace(/\r?\n/g, '<br />');
    }

    // Process content with Cheerio
    const $ = cheerio.load(finalContent, null, false);
    
    const $images = $('img');
    let currentGallery: any = null;
    
    $images.each((i, el) => {
      const $el = $(el);
      const $parent = $el.parent('p');
      const $wrapper = $parent.length ? $parent : $el;
      
      const $next = $wrapper.next();
      const hasNextImg = $next.find('img').length > 0 || $next.is('img');
      
      const $prev = $wrapper.prev();
      const hasPrevImg = $prev.find('img').length > 0 || $prev.is('img');
      
      if (hasPrevImg || hasNextImg) {
        if (!currentGallery) {
          currentGallery = $('<div class="post-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 32px 0;"></div>');
          $wrapper.before(currentGallery);
        }
        
        const src = $el.attr('src');
        const $link = $(`<a href="${src}" class="lightbox-link" style="display: block; cursor: pointer;"></a>`);
        $el.css({
          'width': '100%',
          'height': '250px',
          'object-fit': 'cover',
          'border-radius': '8px',
          'box-shadow': '0 4px 6px rgba(0,0,0,0.1)',
          'margin': '0',
          'transition': 'transform 0.3s ease'
        });
        $link.append($el.clone());
        currentGallery.append($link);
        $wrapper.remove(); // Remove original
        
        if (!hasNextImg) {
            currentGallery = null; // Reset for next group
        }
      } else {
        currentGallery = null;
        $el.css({
          'max-width': '100%',
          'height': 'auto',
          'border-radius': '12px',
          'box-shadow': '0 4px 12px rgba(0,0,0,0.1)',
          'margin': '32px auto',
          'display': 'block',
          'cursor': 'zoom-in'
        });
        const src = $el.attr('src');
        const $link = $(`<a href="${src}" class="lightbox-link" style="display: block;"></a>`);
        $el.wrap($link);
      }
    });

    finalContent = $.html();

    // The Custom CSS to "jailbreak" Zyro's grid for the post text
    const customCss = `
    <style>
      /* Hide original Zyro image inside the text block layout */
      #zUfFuv { display: none !important; }
      
      /* Make the text box fluid and centered */
      #z15bpT {
          position: relative !important;
          width: 100% !important;
          max-width: 800px !important;
          margin: 0 auto !important;
          left: auto !important;
          top: auto !important;
          height: auto !important;
          transform: none !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 18px !important;
          line-height: 1.8 !important;
          color: #1a1a1a !important;
          padding: 0 20px !important;
      }
      
      /* Let the layout block expand its height automatically */
      #z0YdBH .block-layout {
          display: block !important;
          height: auto !important;
          padding: 60px 0 !important;
      }
      #z0YdBH {
          height: auto !important;
          min-height: auto !important;
      }
      
      #z15bpT p { margin-bottom: 1.5em; }
      #z15bpT h1, #z15bpT h2, #z15bpT h3, #z15bpT h4 {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          color: #111;
          margin-top: 2em;
          margin-bottom: 0.75em;
          line-height: 1.3;
      }
      #z15bpT h2 { font-size: 30px; }
      #z15bpT h3 { font-size: 24px; }
      #z15bpT a { color: #bf8a17; text-decoration: underline; font-weight: 500; }
      #z15bpT a:hover { color: #a37411; }
      #z15bpT strong { font-weight: 700; color: #000; }
      #z15bpT blockquote {
          border-left: 4px solid #bf8a17;
          padding: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #555;
          background-color: #fcfaf5;
          border-radius: 0 8px 8px 0;
      }
      
      .lightbox-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.9);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
      }
      .lightbox-overlay.active {
          opacity: 1;
          pointer-events: auto;
      }
      .lightbox-overlay img {
          max-width: 90%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .lightbox-close {
          position: absolute;
          top: 20px; right: 30px;
          color: white;
          font-size: 40px;
          cursor: pointer;
          font-weight: 100;
      }
    </style>
    
    <div id="custom-lightbox" class="lightbox-overlay">
      <div class="lightbox-close">&times;</div>
      <img src="" alt="Fullscreen view" />
    </div>
    
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('.lightbox-link');
        const overlay = document.getElementById('custom-lightbox');
        const overlayImg = overlay.querySelector('img');
        const closeBtn = overlay.querySelector('.lightbox-close');
        
        links.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            overlayImg.src = link.getAttribute('href');
            overlay.classList.add('active');
          });
        });
        
        const close = () => overlay.classList.remove('active');
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
          if(e.target === overlay) close();
        });
        
        // Hide the original Zyro image wrapper to prevent empty space
        const zUfFuv = document.getElementById('zUfFuv');
        if (zUfFuv) {
          const wrapper = zUfFuv.closest('.layout-element');
          if (wrapper) wrapper.style.display = 'none';
        }
      });
    </script>
    `;

    finalContent = finalContent + customCss;
    const escapedJsonContent = encodeForZyroJson(finalContent);

    if (html.includes('</head>')) {
        html = html.replace('</head>', customCss + '</head>');
    }

    // --- JSON pageData REPLACEMENT ---

    // 1. Content in z15bpT
    html = html.replace(
      /(&quot;z15bpT&quot;:\[0,\{.*?)&quot;content&quot;:\[0,&quot;.*?&quot;\](.*?\}\])/s,
      `$1&quot;content&quot;:[0,&quot;${escapedJsonContent}&quot;]$2`
    );

    // 2. Cover image in zzY2Oo (Hero)
    if (post.coverImage && post.coverImage.endsWith('.mp4')) {
       html = html.replace(
        /(&quot;zzY2Oo&quot;:\[0,\{.*?)&quot;videoSrc&quot;:\[0,&quot;.*?&quot;\](.*?\}\])/s,
        `$1&quot;videoSrc&quot;:[0,&quot;${post.coverImage}&quot;]$2`
      );
    } else {
       // Since the original might not have a video set, we might need to change background current to "image"
       // But wait! The original Zyro template `10-dicas...` HAS a video currently?
       // Let's check test_regex2.js: "videoSrc Match? true"
       // Yes! The original template uses a video for the hero. If the new cover is an image, we should probably set "current" to "image" and set "imagePath".
       // Actually, it's safer to just set BOTH videoSrc and imagePath. If we want it to show an image, we change `&quot;current&quot;:[0,&quot;video&quot;]` to `&quot;current&quot;:[0,&quot;image&quot;]`.
       const isVideo = post.coverImage?.endsWith('.mp4');
       const bgType = isVideo ? 'video' : 'image';
       
       html = html.replace(
         /(&quot;zzY2Oo&quot;:\[0,\{.*?)&quot;current&quot;:\[0,&quot;.*?&quot;\]/s,
         `$1&quot;current&quot;:[0,&quot;${bgType}&quot;]`
       );
       
       html = html.replace(
        /(&quot;zzY2Oo&quot;:\[0,\{.*?)&quot;videoSrc&quot;:\[0,&quot;.*?&quot;\]/s,
        `$1&quot;videoSrc&quot;:[0,&quot;${post.coverImage}&quot;]`
      );
      
      html = html.replace(
        /(&quot;zzY2Oo&quot;:\[0,\{.*?)&quot;videoThumbnailSrc&quot;:\[0,&quot;.*?&quot;\]/s,
        `$1&quot;videoThumbnailSrc&quot;:[0,&quot;${post.coverImage}&quot;]`
      );
      
      // Inject image property if it doesn't exist, but it's easier to just use the meta coverImagePath
    }

    // 3. CoverImagePath in zbLn2C
    html = html.replace(
      /(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;coverImagePath&quot;:\[0,&quot;.*?&quot;\]/s,
      `$1&quot;coverImagePath&quot;:[0,&quot;${post.coverImage}&quot;]`
    );
    html = html.replace(
      /(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;ogImagePath&quot;:\[0,&quot;.*?&quot;\]/s,
      `$1&quot;ogImagePath&quot;:[0,&quot;${post.coverImage}&quot;]`
    );
    
    // 4. Title in zbLn2C
    const encodedTitle = post.title.replace(/"/g, '\\&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(
      /(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;title&quot;:\[0,&quot;.*?&quot;\]/s,
      `$1&quot;title&quot;:[0,&quot;${encodedTitle}&quot;]`
    );
    html = html.replace(
      /(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;name&quot;:\[0,&quot;.*?&quot;\]/s,
      `$1&quot;name&quot;:[0,&quot;${encodedTitle}&quot;]`
    );
    
    // 5. Date
    const isoDate = new Date(post.createdAt).toISOString();
    html = html.replace(
      /(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;date&quot;:\[0,&quot;.*?&quot;\]/s,
      `$1&quot;date&quot;:[0,&quot;${isoDate}&quot;]`
    );
    
    // 6. ReadTime
    html = html.replace(
      /(&quot;zbLn2C&quot;:\[0,\{.*?)&quot;minutesToRead&quot;:\[0,&quot;.*?&quot;\]/s,
      `$1&quot;minutesToRead&quot;:[0,&quot;${post.readTime}&quot;]`
    );

    // --- HTML FALLBACK REPLACEMENT ---
    // This is optional but prevents flicker
    html = html.replace(
      /(<h1[^>]*>)(.*?)(<\/h1>)/g,
      `$1${post.title}$3`
    );
    html = html.replace(/16\.06\.2025/g, date.replace(/\//g, '.'));
    html = html.replace(/3 MIN LEITURA/g, `${post.readTime} MIN LEITURA`);
    html = html.replace(/3 min leitura/g, `${post.readTime} min leitura`);

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
