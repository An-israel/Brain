import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRAIN — Aniekan Israel's AI OS",
  description: "Personal AI Operating System for Aniekan Israel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0A0A0A] text-white" style={{ fontFamily: 'Georgia, serif' }}>
        {children}
      </body>
    </html>
  );
}
