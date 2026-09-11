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
          max-width: 1240px;
          margin: 0 auto;
          padding: 50px 20px 80px;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .stories-header {
          text-align: center;
          margin-bottom: 44px;
        }
        .stories-header h2 {
          font-family: 'Oswald', sans-serif;
          font-size: 38px;
          font-weight: 700;
          color: #ffcd35;
          margin: 0 0 10px 0;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .stories-header p {
          color: #e5e7eb;
          font-size: 16px;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.5;
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
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid #e5e7eb;
          text-align: left;
        }
        .story-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
        .story-media {
          position: relative;
          width: 100%;
          min-height: 180px;
          background: #000000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .story-media img {
          width: 100%;
          height: auto;
          max-height: 520px;
          object-fit: contain;
          display: block;
          background: #111;
        }
        .story-media video {
          width: 100%;
          height: auto;
          max-height: 520px;
          object-fit: contain;
          display: block;
          background: #000;
        }
        .story-type-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.75);
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 5;
        }
        .story-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
          letter-spacing: 0.03em;
          z-index: 5;
          text-transform: uppercase;
        }
        .badge-permanent {
          background: rgba(34, 197, 94, 0.9);
        }
        .badge-timed {
          background: rgba(245, 158, 11, 0.9);
        }
        .story-body {
          padding: 14px 16px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          gap: 10px;
        }
        .story-caption {
          margin: 0;
          font-size: 14px;
          line-height: 1.45;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 500;
          word-break: break-word;
        }
        .story-time {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
          padding-top: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin-top: auto;
        }
        .stories-empty {
          text-align: center;
          padding: 70px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.15);
          border-radius: 16px;
        }
        .stories-empty h3 {
          font-family: 'Oswald', sans-serif;
          font-size: 24px;
          color: #ffd000;
          margin-bottom: 8px;
        }
        .stories-empty p {
          color: #9ca3af;
          font-size: 15px;
        }
        .yt-container {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
          overflow: hidden;
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
          <div style="display: flex; justify-content: center; margin-bottom: 16px;">
            <span style="display: inline-flex; align-items: center; gap: 8px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #ffcd35; font-size: 13px; font-weight: 700; padding: 6px 18px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block; box-shadow: 0 0 8px #ef4444;"></span>
              Acontecendo agora
            </span>
          </div>
          <h2>🐟 PESCARIAS NO RIO CUIABÁ</h2>
          <p>Acompanhe em tempo real fotos, vídeos e capturas direto das águas do Rio Cuiabá!</p>
        </div>
        ${stories.length > 0 ? `
          <div class="stories-grid">
            ${stories.map(story => {
              const media = parseMedia(story.mediaUrl);
              const isPermanent = !story.expiresAt || story.duration === 'PERMANENT';
              const formattedDate = formatStoryDate(story.createdAt);
              const timeRemainingText = getStoryTimeRemaining(story.expiresAt, isPermanent);
              
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
                mediaElement = `<img src="${story.mediaUrl}" alt="${(story.caption || 'Pescaria').replace(/"/g, '&quot;')}" loading="lazy" />`;
              }

              const typeLabel = media.type === 'YOUTUBE' ? 'YouTube' : (media.type === 'VIDEO' ? 'Vídeo' : 'Foto');
              const typeIcon = media.type === 'YOUTUBE'
                ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" style="vertical-align: middle;"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>'
                : (media.type === 'VIDEO'
                  ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>'
                  : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>');

              return `
                <div class="story-card">
                  <div class="story-media">
                    ${mediaElement}
                    <div class="story-type-badge">
                      ${typeIcon}
                      <span>${typeLabel}</span>
                    </div>
                    <div class="story-badge ${isPermanent ? 'badge-permanent' : 'badge-timed'}">
                      ${isPermanent ? '∞ Fixo' : 'Ao Vivo'}
                    </div>
                  </div>
                  <div class="story-body">
                    ${story.caption ? `<p class="story-caption">${story.caption}</p>` : ''}
                    <div class="story-time">
                      <span>${formattedDate}</span>
                      <span style="font-weight: 600; color: ${isPermanent ? '#16a34a' : '#d97706'};">
                        ${timeRemainingText}
                      </span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="stories-empty">
            <div style="font-size: 42px; margin-bottom: 12px;">🎣</div>
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

function formatStoryDate(dateStr: Date | string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

function getStoryTimeRemaining(expiresAt: Date | string | null, isPermanent: boolean): string {
  if (isPermanent || !expiresAt) return 'Permanente';
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expirado';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h restantes`;
  }
  return `${hours}h ${minutes}min restantes`;
}
