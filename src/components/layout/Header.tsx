
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Woofpedia
          </Link>
        </div>
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="견종을 검색해보세요..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/breeds" className="text-gray-600 hover:text-blue-500">
            견종 백과
          </Link>
          <Link href="/mbti" className="text-gray-600 hover:text-blue-500">
            MBTI 테스트
          </Link>
          <Link href="/community" className="text-gray-600 hover:text-blue-500">
            커뮤니티
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-blue-500">
            로그인
          </Link>
          <Link href="/signup" className="text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full">
            회원가입
          </Link>
        </div>
        <div className="md:hidden">
          {/* Mobile Menu Button */}
          <button className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
