import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rio Cuiabá Lodge",
  description: "Pousada no Pantanal - Pescaria, Ecoturismo e Eventos",
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Script async src="//www.instagram.com/embed.js" strategy="lazyOnload" />
        <Script id="mobile-menu-script" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              document.addEventListener('click', function(e) {
                var btn = e.target.closest('.burger');
                if (btn) {
                  var dropdown = document.querySelector('.block-header-layout-mobile__dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('is-open');
                    btn.classList.toggle('is-open');
                  }
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
