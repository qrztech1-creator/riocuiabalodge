import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rio Cuiabá Lodge",
  description: "Pousada no Pantanal - Pescaria, Ecoturismo e Eventos",
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
                    if (dropdown.style.display === 'block') {
                      dropdown.style.display = 'none';
                    } else {
                      dropdown.style.display = 'block';
                    }
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
