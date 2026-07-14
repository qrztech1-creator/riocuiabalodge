import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        category: { not: "Eventos" },
      },
      orderBy: { createdAt: "desc" },
    });

    const templatePath = path.join(process.cwd(), "public/pages/blog.html");
    let html = "";

    try {
      html = fs.readFileSync(templatePath, "utf8");
    } catch (err) {
      console.error("Template not found", err);
      return new NextResponse("Template not found", { status: 500 });
    }

    const postsHtml = `
      <div id="ssr-injected-posts" style="width: 100%; max-width: 1224px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; padding: 40px 20px; font-family: 'DM Sans', sans-serif;">
        ${posts
          .map(
            (post) => `
          <a href="/${post.slug}" onclick="event.stopPropagation();" style="display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); background-color: white; text-decoration: none; color: inherit; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; position: relative; z-index: 50;">
            <div style="position: relative; height: 256px; overflow: hidden; flex-shrink: 0; background-color: #f3f4f6; pointer-events: none;">
              ${(post.coverImage && (post.coverImage.endsWith('.mp4') || post.coverImage.endsWith('.webm') || post.coverImage.endsWith('.mov'))) 
                ? `<video src="${post.coverImage}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></video>`
                : `<img src="${post.coverImage}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" loading="lazy" />`
              }
              <div style="position: absolute; top: 16px; right: 16px; background-color: rgba(255, 255, 255, 0.95); color: #1a1a1a; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 2px 4px rgba(0,0,0,0.1); pointer-events: none;">
                ${post.category}
              </div>
            </div>
            <div style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1; background-color: white; pointer-events: none;">
              <h3 style="font-size: 26px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; margin-top: 0; font-family: 'Oswald', sans-serif; letter-spacing: -0.025em; line-height: 1.2;">
                ${post.title}
              </h3>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                <span style="font-size: 14px; font-weight: 600; color: #6b7280;">
                  ${new Date(post.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")} • ${post.readTime} min leitura
                </span>
                <span style="color: #bf8a17; font-weight: 700; text-transform: uppercase; font-size: 14px; letter-spacing: 0.1em;">
                  Leia mais &rarr;
                </span>
              </div>
            </div>
          </a>
        `,
          )
          .join("")}
      </div>
      <style>
        a:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
      </style>
    `;

    const customCss = `
    <style>
      #zlzkDh { background-color: #1a1a1a !important; height: auto !important; min-height: auto !important; }
      /* Hide Zyro's empty blog grid and pagination */
      #zlzkDh .block-blog-list__empty-block, #zlzkDh .pagination { display: none !important; }
    </style>
    `;

    const script = `
        ${customCss}
        <div id="dynamic-posts-data" style="display:none;">
             ${postsHtml}
        </div>
        <script>
          (function() {
            let injected = false;
            function inject() {
               if (injected) return true;
               const target = document.getElementById('zlzkDh');
               const source = document.getElementById('dynamic-posts-data');
               if (target && source && target.querySelector('.block-blog-list__empty-block')) {
                  if (!document.getElementById('ssr-injected-posts')) {
                     target.insertAdjacentHTML('afterbegin', source.innerHTML);
                  }
                  injected = true;
                  return true;
               }
               return false;
            }
            
            if (!inject()) {
               const intv = setInterval(() => {
                  if (inject()) clearInterval(intv);
               }, 20);
               setTimeout(() => clearInterval(intv), 2000);
            }
          })();
        </script>
    `;

    const regex = new RegExp("(<div id=\"zlzkDh\"[^>]*>)");
    if (regex.test(html)) {
       html = html.replace(regex, `$1${postsHtml}`);
    }

    if (html.includes('</body>')) {
        html = html.replace('</body>', script + '</body>');
    } else {
        html += script;
    }

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
