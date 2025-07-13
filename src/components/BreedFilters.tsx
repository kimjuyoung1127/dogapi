// src/components/BreedFilters.tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// ✅ 기능 목적 요약: 견종을 속성(크기 등)에 따라 필터링하는 버튼 그룹 UI
// 💡 여기서 배운 점: `ToggleGroup`은 여러 개 중 하나만 선택하거나, 모두 선택 해제하는 상호작용을 쉽게 구현하게 해준다.

interface BreedFiltersProps {
  onSizeChange: (size: string | null) => void;
}

const SIZES = ["소형", "중형", "대형"];

export function BreedFilters({ onSizeChange }: BreedFiltersProps) {
  return (
    <div className="flex justify-center">
      <ToggleGroup 
        type="single" 
        onValueChange={(value) => onSizeChange(value || null)}
        aria-label="견종 크기 필터"
      >
        {SIZES.map(size => (
          <ToggleGroupItem key={size} value={size} aria-label={`${size}견`}>
            {size}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
