// ✅ 견종 정보 카드 컴포넌트
// 💡 그리드 레이아웃에 사용되며, 각 견종의 요약 정보를 보여줍니다.
// 🤔 클릭 시 해당 견종의 상세 페이지로 이동해야 합니다.

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

// 임시 타입 정의. 실제 데이터 구조에 맞게 수정될 예정입니다.
type Breed = {
  id: number;
  name_ko: string;
  thumbnail_url: string | null;
  // 'breeds' 테이블에 temperament 컬럼이 없으므로, name_en을 대신 사용하거나 추후 수정합니다.
  name_en: string; 
};

type BreedCardProps = {
  breed: Breed;
};

const BreedCard = ({ breed }: BreedCardProps) => {
  const { id, name_ko, thumbnail_url, name_en } = breed;

  return (
    <Link href={`/breeds/${id}`} className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative w-full aspect-square">
        <Image
          src={thumbnail_url || '/placeholder-dog.jpg'} // 이미지가 없을 경우를 대비한 플레이스홀더
          alt={name_ko}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name_ko}</h3>
        <p className="mt-1 text-sm text-gray-500 truncate">{name_en}</p>
      </div>
    </Link>
  );
};

export default BreedCard;