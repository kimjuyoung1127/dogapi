// src/components/FeatureRating.tsx
import { Star } from 'lucide-react';

// ✅ 기능 목적 요약: 1~5점의 숫자 점수를 별점 아이콘으로 시각화합니다.
// 💡 여기서 배운 점: `Array.from`과 `map`을 사용하면 반복적인 UI 요소를 쉽게 생성할 수 있다.

interface FeatureRatingProps {
  label: string;
  rating: number | null | undefined;
  maxRating?: number;
}

export function FeatureRating({ label, rating, maxRating = 5 }: FeatureRatingProps) {
  const filledStars = rating || 0;
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < filledStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
