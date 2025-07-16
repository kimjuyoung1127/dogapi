// ✅ 모든 페이지에 적용되는 최상위 레이아웃
// 💡 Header와 Footer를 추가하고, children을 통해 페이지별 콘텐츠를 렌더링합니다.
// 🤔 폰트는 추후 디자인 가이드에 맞춰 커스�� 폰트로 변경할 수 있습니다.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Woofpedia - 당신의 완벽한 반려견 찾기",
    template: "%s | Woofpedia",
  },
  description: "대한민국 No.1 견종 정보 플랫폼. 견종별 성격, 특징, MBTI 정보까지 한눈에 확인하세요.",
  icons: {
    icon: "/favicon.ico", // favicon 경로를 지정해주세요.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 text-gray-800 antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
