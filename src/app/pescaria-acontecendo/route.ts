import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const templatePath = path.join(process.cwd(), "public/pages/pescaria-acontecendo.html");
    let html = "";

    try {
      html = fs.readFileSync(templatePath, "utf8");
    } catch (err) {
      console.error("Template not found", err);
      return new NextResponse("Template not found", { status: 500 });
    }

    const now = new Date();

    // Delete expired stories automatically
    await prisma.story.deleteMany({
      where: {
        expiresAt: { not: null, lte: now },
      },
    });

    // Fetch active stories
    const stories = await prisma.story.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build the stories grid HTML
    const storiesHtml = `
      <style>
        .stories-section {
          width: 100%;
          max-width: 1224px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .stories-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .stories-header h2 {
          font-family: 'Oswald', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #ffd000;
          margin-bottom: 8px;
        }
        .stories-header p {
          color: #ccc;
          font-size: 16px;
        }
        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .story-card {
          border-radius: 16px;
          overflow: hidden;
          background: #222;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .story-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .story-media {
          position: relative;
          aspect-ratio: 9/16;
          max-height: 480px;
          overflow: hidden;
          background: #111;
        }
        .story-media img, .story-media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .story-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(8px);
        }
        .badge-permanent {
          background: rgba(34, 197, 94, 0.8);
          color: white;
        }
        .badge-timed {
          background: rgba(245, 158, 11, 0.8);
          color: white;
        }
        .story-caption {
          padding: 16px 20px;
          color: #eee;
          font-size: 15px;
          line-height: 1.5;
        }
        .story-time {
          padding: 0 20px 16px;
          font-size: 12px;
          color: #888;
        }
        .stories-empty {
          text-align: center;
          padding: 80px 20px;
          color: #888;
        }
        .stories-empty h3 {
          font-family: 'Oswald', sans-serif;
          font-size: 24px;
          color: #aaa;
          margin-bottom: 8px;
        }
        @media (max-width: 640px) {
          .stories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .story-media {
            max-height: 320px;
          }
          .stories-header h2 {
            font-size: 28px;
          }
        }
      </style>
      <div class="stories-section">
        <div class="stories-header">
          <h2>🐟 PESCARIA ACONTECENDO AGORA</h2>
          <p>Veja o que está rolando na pescaria em tempo real!</p>
        </div>
        ${stories.length > 0 ? `
          <div class="stories-grid">
            ${stories.map(story => {
              const isVideo = story.mediaType === 'VIDEO';
              const isPermanent = !story.expiresAt;
              const timeAgo = getTimeAgo(story.createdAt);
              
              return `
                <div class="story-card">
                  <div class="story-media">
                    ${isVideo
                      ? `<video src="${story.mediaUrl}" autoplay muted loop playsinline></video>`
                      : `<img src="${story.mediaUrl}" alt="${story.caption || 'Pescaria'}" loading="lazy" />`
                    }
                    <div class="story-badge ${isPermanent ? 'badge-permanent' : 'badge-timed'}">
                      ${isPermanent ? '∞ Fixo' : getTimeRemaining(story.expiresAt)}
                    </div>
                  </div>
                  ${story.caption ? `<div class="story-caption">${story.caption}</div>` : ''}
                  <div class="story-time">${timeAgo}</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="stories-empty">
            <h3>Nenhuma pescaria no momento</h3>
            <p>Volte em breve para ver o que está acontecendo no Rio Cuiabá!</p>
          </div>
        `}
      </div>
    `;

    // Hide the old static text content and gallery, inject stories
    const hideOldContent = `
      <style>
        /* Hide the old static body/gallery content, keep header and footer */
        #zQqI7Z { display: none !important; }
      </style>
    `;

    // Inject stories before the footer
    const footerMarker = '<section id="zdS1_7"';
    if (html.includes(footerMarker)) {
      html = html.replace(footerMarker, hideOldContent + storiesHtml + '<section id="zdS1_7"');
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', hideOldContent + storiesHtml + '</body>');
    }

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error in pescaria-acontecendo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function getTimeAgo(dateStr: Date | string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `Há ${minutes} min`;
  if (hours < 24) return `Há ${hours}h`;
  if (days === 1) return 'Ontem';
  return `Há ${days} dias`;
}

function getTimeRemaining(expiresAt: Date | string | null): string {
  if (!expiresAt) return '∞';
  const expires = new Date(expiresAt);
  const now = new Date();
  const diff = expires.getTime() - now.getTime();
  if (diff <= 0) return 'Expirado';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d restante${days > 1 ? 's' : ''}`;
  }
  return `${hours}h restante${hours > 1 ? 's' : ''}`;
}
