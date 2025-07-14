// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BreedCard } from '@/components/BreedCard';
import { BreedFilters } from '@/components/BreedFilters'; // 필터 컴포넌트 임포트

export default function HomePage() {
  const [breeds, setBreeds] = useState<any[]>([]);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // 크기 필터 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBreeds = async () => {
      const supabase = createClient();
      // ✅ 기능 목적 요약: size_type을 함께 가져오도록 select 수정
      const { data, error } = await supabase.from('breeds').select('id, name_ko, name_en, thumbnail_url, size_type');
      if (data) {
        setBreeds(data);
      }
      if (error) {
        console.error("Error fetching breeds:", error);
      }
      setLoading(false);
    };
    getBreeds();
  }, []);

  // ✅ 기능 목적 요약: 검색어와 크기 필터를 모두 적용하는 로직
  const filteredBreeds = breeds.filter(breed => {
    const matchesSize = !selectedSize || breed.size_type === selectedSize;

    return matchesSize;
  });

  return (
    <main className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Woofpedia</h1>
        <p className="text-muted-foreground">나에게 꼭 맞는 견종을 찾아보세요</p>
      </div>

      <div className="space-y-4 mb-8 max-w-md mx-auto">
        <BreedFilters onSizeChange={setSelectedSize} />
      </div>

      {loading ? (
        <p className="text-center">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBreeds.map((breed) => (
            <BreedCard key={breed.id} breed={breed} />
          ))}
        </div>
      )}
    </main>
  );
}

