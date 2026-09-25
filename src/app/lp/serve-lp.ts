import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Reads a raw HTML file from the LP source folder, rewrites internal
 * asset/link paths so they work under /lp/*, and returns a full Response.
 *
 * The original LP was built with relative paths (assets/css/style.css,
 * privacidade.html, etc.). We rewrite them to absolute paths under /lp/.
 */
export function serveLpHtml(filename: string): Response {
  const filePath = join(process.cwd(), 'rio-cuiaba-lodge-lp', filename);
  let html = readFileSync(filePath, 'utf-8');

  // ── Asset paths ──────────────────────────────────────────────────────
  // "assets/..." → "/lp/assets/..."  (href, src, data-src, content)
  html = html.replace(
    /((?:href|src|data-src|content)=["'])assets\//g,
    '$1/lp/assets/'
  );

  // ── Internal page links ──────────────────────────────────────────────
  // "privacidade.html" → "/lp/privacidade"
  // "termos.html"      → "/lp/termos"
  // "index.html"       → "/lp"
  // "index.html#xxx"   → "/lp#xxx"
  html = html.replace(
    /(href=["'])index\.html(#[^"']*)?(?=["'])/g,
    '$1/lp$2'
  );
  html = html.replace(
    /(href=["'])privacidade\.html(["'])/g,
    '$1/lp/privacidade$2'
  );
  html = html.replace(
    /(href=["'])termos\.html(["'])/g,
    '$1/lp/termos$2'
  );

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
