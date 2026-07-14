import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const { page } = resolvedParams;
  
  const pagePath = path.join(process.cwd(), `public/pages/${page}.html`);
  
  if (!fs.existsSync(pagePath)) {
    return new NextResponse('Page not found', { status: 404 });
  }

  let html = fs.readFileSync(pagePath, 'utf8');

  // If this page contains a blog list, we inject the dynamic posts
  if (html.includes('class="block-blog-list__list"')) {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });

    let postsHtml = '';
    for (const post of posts) {
      postsHtml += `
      <div data-v-b99b1992="" data-v-1120e899="" class="block-blog-list-item" data-animation-role="block-element" data-qa="blog-list-item" data-animation-state="active" style="--525116cd: 24px;">
        <a data-v-b99b1992="" href="/${post.slug}" class="block-blog-list-item__cover-image-container" data-qa="blog-list-item-image">
          <div data-v-b99b1992="" class="block-blog-list-item__cover-image-wrapper">
            <img src="${post.thumbnailImage || post.coverImage || ''}" data-v-b99b1992="" class="block-blog-list-item__cover-image" alt="" style="object-fit: cover; width: 100%; height: 100%;" >
          </div>
        </a>
        <a data-v-b99b1992="" class="block-blog-list-item__content" href="/${post.slug}" data-qa="block-blog-list-item-content">
          <h3 data-v-b99b1992="" class="font-primary block-blog-list-item__title">${post.title}</h3>
          <p data-v-b99b1992="" class="block-blog-list-item__description font-secondary"></p>
        </a>
      </div>
      `;
    }

    // Find all occurrences of the blog list and replace their innerHTML
    const blockStartTag = '<div data-v-1120e899="" class="block-blog-list__list">';
    const parts = html.split(blockStartTag);
    
    if (parts.length > 1) {
      let newHtml = parts[0];
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        // We need to find the end of the block-blog-list__list div.
        // For simplicity, since the original code has </div><!----><!----><!----><!----><!----><!----><!----></section> right after, 
        // we can just use a regex or string replacement for the block contents.
        // Actually, the easiest way is to just replace the whole `<div class="block-blog-list__list">...</div>` up to the next `</div><!---->`
        
        // Wait, what if we just inject our HTML right after blockStartTag and then skip over the old items?
        // Let's use a simpler approach: we will use a regex to replace everything inside the block list wrapper.
        // The regex matches everything until the closing div of the list.
        // Because of nested divs, regex on HTML is tricky. 
      }
    }
    
    // Better approach: Replace the entire inner contents by matching the known item pattern
    // The Zyro output has multiple `<div ... class="block-blog-list-item" ...> ... </div>` inside the wrapper.
    // We can just replace the whole wrapper with our new wrapper.
    const startStr = '<div data-v-1120e899="" class="block-blog-list__list">';
    const endStr = '</div><!----><!----><!----><!----><!----><!----><!----></section>';
    
    const startIdx = html.indexOf(startStr);
    if (startIdx !== -1) {
       // Search for the end of the section
       const endIdx = html.indexOf(endStr, startIdx);
       if (endIdx !== -1) {
           const before = html.substring(0, startIdx + startStr.length);
           const after = html.substring(endIdx); // we keep the </div><!---->...
           
           // If there are multiple blog lists on the page (e.g. blog.html), we might need to loop.
           // Let's loop just in case
           html = html.replace(new RegExp(startStr + '[\\s\\S]*?' + endStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), startStr + postsHtml + endStr);
       }
    }
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
