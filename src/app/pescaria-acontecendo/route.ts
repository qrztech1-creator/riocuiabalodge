import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { parseMedia } from "@/lib/media-helper";

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
    const expiredStories = await prisma.story.findMany({
      where: {
        expiresAt: { not: null, lte: now },
      },
    });

    if (expiredStories.length > 0) {
      const { deleteStorageFile } = await import('@/lib/storage');
      await Promise.all(expiredStories.map(s => deleteStorageFile(s.mediaUrl)));
      await prisma.story.deleteMany({
        where: { id: { in: expiredStories.map(s => s.id) } }
      });
    }

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
          padding: 50px 20px 70px;
          font-family: 'DM Sans', sans-serif;
        }
        .stories-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .stories-header h2 {
          font-family: 'Oswald', sans-serif;
          font-size: 38px;
          font-weight: 700;
          color: #ffd000;
          margin-bottom: 8px;
          letter-spacing: 0.03em;
        }
        .stories-header p {
          color: #ccc;
          font-size: 16px;
        }
        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          align-items: start;
        }
        .story-card {
          border-radius: 16px;
          overflow: hidden;
          background: #1e1e1e;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .story-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.5);
        }
        .story-media {
          position: relative;
          width: 100%;
          min-height: 220px;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .story-media img {
          width: 100%;
          height: auto;
          max-height: 550px;
          object-fit: contain;
          display: block;
        }
        .story-media video {
          width: 100%;
          height: auto;
          max-height: 550px;
          object-fit: contain;
          display: block;
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
          z-index: 10;
        }
        .story-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(0,0,0,0.75);
          color: #fff;
          backdrop-filter: blur(8px);
          z-index: 10;
        }
        .badge-permanent {
          background: rgba(34, 197, 94, 0.9);
          color: white;
        }
        .badge-timed {
          background: rgba(245, 158, 11, 0.9);
          color: white;
        }
        .story-caption {
          padding: 16px 20px 10px;
          color: #eee;
          font-size: 15px;
          line-height: 1.5;
        }
        .story-time {
          padding: 0 20px 16px;
          font-size: 12px;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stories-empty {
          text-align: center;
          padding: 80px 20px;
          color: #888;
        }
        .stories-empty h3 {
          font-family: 'Oswald', sans-serif;
          font-size: 26px;
          color: #aaa;
          margin-bottom: 8px;
        }
        .yt-container {
          width: 100%;
          aspect-ratio: 16/9;
        }
        .yt-container.is-short {
          aspect-ratio: 9/16;
        }
        .yt-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        @media (max-width: 640px) {
          .stories-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .stories-header h2 {
            font-size: 28px;
          }
        }
      </style>
      <div class="stories-section">
        <div class="stories-header">
          <h2>🐟 PESCARIA ACONTECENDO AGORA</h2>
          <p>Acompanhe o que está acontecendo nas águas do Rio Cuiabá em tempo real!</p>
        </div>
        ${stories.length > 0 ? `
          <div class="stories-grid">
            ${stories.map(story => {
              const media = parseMedia(story.mediaUrl);
              const isPermanent = !story.expiresAt;
              const timeAgo = getTimeAgo(story.createdAt);
              
              let mediaElement = '';
              if (media.type === 'YOUTUBE') {
                mediaElement = `
                  <div class="yt-container ${media.isShort ? 'is-short' : ''}">
                    <iframe src="${media.embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                `;
              } else if (media.type === 'VIDEO') {
                mediaElement = `<video src="${story.mediaUrl}" autoplay muted loop playsinline controls></video>`;
              } else {
                mediaElement = `<img src="${story.mediaUrl}" alt="${story.caption || 'Pescaria'}" loading="lazy" />`;
              }

              return `
                <div class="story-card">
                  <div class="story-media">
                    ${mediaElement}
                    <div class="story-type-badge">
                      ${media.type === 'YOUTUBE' ? '▶ YouTube' : media.type === 'VIDEO' ? '🎥 Vídeo' : '📷 Foto'}
                    </div>
                    <div class="story-badge ${isPermanent ? 'badge-permanent' : 'badge-timed'}">
                      ${isPermanent ? '∞ Fixo' : getTimeRemaining(story.expiresAt)}
                    </div>
                  </div>
                  ${story.caption ? `<div class="story-caption">${story.caption}</div>` : ''}
                  <div class="story-time">
                    <span>${timeAgo}</span>
                    <span style="color: ${isPermanent ? '#4ade80' : '#fbbf24'}; font-weight: 600;">
                      ${isPermanent ? 'Permanente' : getTimeRemaining(story.expiresAt)}
                    </span>
                  </div>
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
