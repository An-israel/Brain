import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRAIN — Aniekan Israel's AI OS",
  description: "Personal AI Operating System for Aniekan Israel",
};

export const viewport: Viewport = {
  themeColor: '#C9A84C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full bg-[#0A0A0A] text-white" style={{ fontFamily: 'Georgia, serif' }}>
        {children}
      </body>
    </html>
  );
}
