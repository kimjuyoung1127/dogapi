// src/components/BreedCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// ✅ 기능 목적 요약: 단일 견종의 정보를 표시하는 재사용 가능한 카드 컴포넌트
// 💡 여기서 배운 점: Next.js의 `Image` 컴포넌트와 `shadcn/ui`의 `AspectRatio`를 함께 사용하면,
// 다양한 크기의 이미지를 일관된 비율의 썸네일로 깔끔하게 표시할 수 있다.

interface BreedCardProps {
  breed: {
    id: string;
    name_ko: string;
    thumbnail_url: string | null;
  };
}

export function BreedCard({ breed }: BreedCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <AspectRatio ratio={4 / 3}>
          {breed.thumbnail_url ? (
            <Image
              src={breed.thumbnail_url}
              alt={breed.name_ko}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{breed.name_ko}</CardTitle>
      </CardContent>
    </Card>
  );
}
