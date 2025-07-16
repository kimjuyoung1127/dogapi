// ✅ 공통 푸터 컴포넌트
// 💡 PuppySpot.com의 다단 구조를 참고하여 사이트맵과 소셜 링크, 저작권 정보를 제공합니다.
// 🤔 각 링크의 실제 경로는 추후 페이지 구현에 따라 확정될 예정입니다.

import Link from 'next/link';
import { PawPrint, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              <PawPrint className="h-8 w-8" />
              <span>Woofpedia</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              세상의 모든 강아지들을 위한 지식 백과. Woofpedia에서 당신의 완벽한 반려견을 찾아보세요.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">Woofpedia</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/breeds" className="text-gray-400 hover:text-white transition-colors text-sm">견종 정보</Link></li>
              <li><Link href="/mbti-test" className="text-gray-400 hover:text-white transition-colors text-sm">견종 MBTI 테스트</Link></li>
            </ul>
          </div>

          {/* Column 3: For Puppy Lovers */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">For Puppy Lovers</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm">커뮤니티</Link></li>
              <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors text-sm">양육 가이드</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">자주 묻는 질문</Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="mt-8 md:mt-0">
             <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">Follow Us</h3>
             <div className="flex mt-4 space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Twitter</span><Twitter className="h-6 w-6" /></Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Facebook</span><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Instagram</span><Instagram className="h-6 w-6" /></Link>
             </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">&copy; {currentYear} Woofpedia. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;