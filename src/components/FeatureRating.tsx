// ✅ 기능 목적 요약: 1~5점의 숫자 점수를 프로그레스 바로 시각화합니다.
// 💡 div와 TailwindCSS의 너비(width) 속성만으로 구현하여 안정성을 높였습니다.

interface FeatureRatingProps {
  label: string;
  rating: number | null | undefined;
  maxRating?: number;
}

export function FeatureRating({ label, rating, maxRating = 5 }: FeatureRatingProps) {
  const normalizedRating = rating || 0;
  const percentage = (normalizedRating / maxRating) * 100;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs font-semibold text-gray-500">{normalizedRating} / {maxRating}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}