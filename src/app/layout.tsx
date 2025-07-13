// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Woofpedia",
  description: "대한민국 No.1 견종 정보 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background`}>
        {/* TODO: Header 컴포넌트 추가 예정 */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        {/* TODO: Footer 컴포넌트 추가 예정 */}
      </body>
    </html>
  );
}
