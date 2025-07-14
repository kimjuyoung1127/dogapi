
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Woofpedia</h3>
            <p className="text-gray-400 text-sm">
              대한민국 No.1 견종 정보 및 커뮤니티 플랫폼
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">소개</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">Woofpedia 비전</Link></li>
              <li><Link href="/team" className="text-gray-400 hover:text-white">팀 소개</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">고객 지원</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white">문의하기</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">자주 묻는 질문</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">법적 고지</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-400 hover:text-white">서비스 이용약관</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Woofpedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
