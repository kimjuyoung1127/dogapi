// src/components/BreedCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// ✅ 기능 목적 요약: 단일 견종의 정보를 표시하는 재사용 가능한 카드 컴포넌트
// 💡 여기서 배운 점: Next.js의 `Image` 컴포넌트는 자동으로 이미지를 최적화해준다.

interface BreedCardProps {
  breed: {
    id: string;
    name_ko: string;
    thumbnail_url: string | null;
  };
}

export function BreedCard({ breed }: BreedCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{breed.name_ko}</CardTitle>
      </CardHeader>
      <CardContent>
        {breed.thumbnail_url && (
          <div className="relative aspect-square">
            <Image
              src={breed.thumbnail_url}
              alt={breed.name_ko}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
