'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

function BlogGrid({ posts }: { posts: any[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-8 z-50 relative" style={{ zIndex: 9999 }}>
      {posts.map(post => (
        <Link key={post.id} href={`/blog-list/${post.slug}`} className="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white transform hover:-translate-y-1 duration-300">
          <div className="relative h-64 overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute top-4 right-4 bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {post.category}
            </div>
          </div>
          <div className="p-6 flex flex-col justify-between h-[200px] bg-white">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2 font-oswald tracking-tight leading-tight">{post.title}</h3>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')} • {post.readTime} min
              </span>
              <span className="text-[#bf8a17] font-bold hover:text-[#e5a61c] transition-colors uppercase text-sm tracking-widest">
                Leia mais
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function BlogInjector({ posts }: { posts: any[] }) {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    // Attempt to find the container that holds the static blog posts
    // Based on Zyro's DOM structure, we look for h3 with specific text
    const headings = Array.from(document.querySelectorAll('h3, h4, h5, h6, p, span, a'));
    const targetElement = headings.find(el => 
      el.textContent?.includes('Turismo de Experiência') || 
      el.textContent?.includes('Bird Watching') ||
      el.textContent?.includes('2 min de leitura')
    );

    if (targetElement) {
      // Find the closest large block-layout or section that contains these
      // We want to replace the content of the parent that holds the grid
      const section = targetElement.closest('section');
      if (section) {
        // We find the block-layout inside this section
        const blockLayout = section.querySelector('.block-layout');
        if (blockLayout) {
          // Hide all existing static children
          Array.from(blockLayout.children).forEach((child: any) => {
            // We don't hide headings if they are standalone, but typically the grid elements are siblings
            // Actually, to be safe, we can just append the new grid to the section, 
            // and hide the elements that look like cards.
            if (child.textContent?.includes('2 min de leitura') || child.querySelector('img')) {
               child.style.display = 'none';
            }
          });
          
          // Create a mount point if it doesn't exist
          let mountPoint = section.querySelector('#dynamic-blog-mount');
          if (!mountPoint) {
            mountPoint = document.createElement('div');
            mountPoint.id = 'dynamic-blog-mount';
            mountPoint.className = 'w-full max-w-[1224px] mx-auto px-4';
            section.appendChild(mountPoint);
          }
          setContainer(mountPoint);
        }
      }
    }
  }, []);

  if (!container) return null;

  return createPortal(<BlogGrid posts={posts} />, container);
}
