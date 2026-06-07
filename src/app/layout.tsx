import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechPort",
  description: "IT ニュース集約ポータル",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur sticky top-0 z-10">
          <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold text-base">
              TechPort
            </Link>
            <Link href="/" className="hover:underline">
              記事一覧
            </Link>
            <Link href="/saved" className="hover:underline">
              あとで読む
            </Link>
            <Link href="/feeds" className="hover:underline">
              フィード管理
            </Link>
          </nav>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
