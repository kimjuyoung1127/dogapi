// ✅ 공통 헤더 컴포넌트
// 💡 PuppySpot.com의 레이아웃을 참고하여 앱의 핵심 탐색 기능을 제공합니다.
// 🤔 모바일 반응형 메뉴는 추후 햄버거 버튼과 드로어 메뉴로 구현할 예정입니다.

import Link from 'next/link';
import { PawPrint, Search, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-500 hover:text-blue-600 transition-colors">
              <PawPrint className="h-8 w-8" />
              <span>Woofpedia</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/breeds" className="text-gray-600 hover:text-blue-500 transition-colors font-medium">
              견종 정보
            </Link>
            <Link href="/mbti-test" className="text-gray-600 hover:text-blue-500 transition-colors font-medium">
              견종 MBTI 테스트
            </Link>
            {/* 추가 네비게이션 링크들... */}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <Link href="/login" className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors">
              <UserCircle className="h-5 w-5" />
              <span>로그인</span>
            </Link>
          </div>

          {/* Mobile Menu Button (placeholder) */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-colors">
              <span className="sr-only">메뉴 열기</span>
              {/* Hamburger Icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;