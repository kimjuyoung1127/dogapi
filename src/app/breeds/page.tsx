// ✅ 견종 목록 페이지 (클라이언트 컴포넌트로 전환)
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // 클라이언트용 Supabase 클라이언트 사용
import BreedCard from '@/components/BreedCard';
import BreedFilters from '@/components/BreedFilters';

// 💡 데이터 타입 정의. 실제 DB 스키마와 일치시키는 것이 중요합니다.
type Breed = {
  id: number;
  name_ko: string;
  name_en: string;
  thumbnail_url: string | null;
  size_type: string | null; // 필터링을 위해 size_type 추가
};

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const getBreeds = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('breeds')
        .select('id, name_ko, name_en, thumbnail_url, size_type')
        .order('name_ko', { ascending: true });

      if (error) {
        console.error('Error fetching breeds:', error);
      } else if (data) {
        setBreeds(data as Breed[]);
      }
      setLoading(false);
    };

    getBreeds();
  }, []);

  // ✅ 기능 목적 요약: 검색어와 크기 필터를 모두 적용하는 로직
  const filteredBreeds = breeds.filter(breed => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      breed.name_ko.toLowerCase().includes(query) || 
      breed.name_en.toLowerCase().includes(query);
    
    const matchesSize = !selectedSize || breed.size_type === selectedSize;

    return matchesSearch && matchesSize;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          견종 정보
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          당신과 가장 잘 맞는 반려견을 찾아보세요.
        </p>
      </div>

      {/* 필터 및 검색 UI */}
      <BreedFilters 
        onSearchChange={setSearchQuery}
        onSizeChange={setSelectedSize}
      />
      
      {/* 견종 카드 그리드 */}
      {loading ? (
        <p className="text-center">로딩 중...</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            {filteredBreeds.length > 0 
              ? `총 ${filteredBreeds.length}개의 견종을 찾았습니다.` 
              : '일치하는 견종이 없습니다.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredBreeds.map((breed) => (
              <BreedCard key={breed.id} breed={breed} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}