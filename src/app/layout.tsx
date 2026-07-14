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
      </body>
    </html>
  );
}
