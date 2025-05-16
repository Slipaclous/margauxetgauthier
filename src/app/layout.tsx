import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initDatabase } from '@/lib/init-db';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Initialiser la base de données au démarrage
if (process.env.NODE_ENV === 'production') {
  initDatabase().catch(console.error);
}

export const metadata: Metadata = {
  title: 'M & G - Mariage',
  description: 'Margaux & Gauthier - 5 juillet 2025',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
