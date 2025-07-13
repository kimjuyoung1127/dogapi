// src/components/MbtiResult.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MbtiResultProps {
  result: string;
  onReset: () => void;
}

interface MbtiInfo {
  title: string;
  description: string;
}

interface Breed {
  id: string;
  name_ko: string;
}

export function MbtiResult({ result, onReset }: MbtiResultProps) {
  const [info, setInfo] = useState<MbtiInfo | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // 1. MBTI 설명 가져오기
      const { data: mbtiData, error: mbtiError } = await supabase
        .from('mbti_descriptions')
        .select('title, description')
        .eq('mbti_type', result);
      
      if (mbtiError) console.error("MBTI fetch error:", mbtiError);
      if (mbtiData && mbtiData.length > 0) setInfo(mbtiData[0]);

      // 2. 대표 견종 목록 가져오기 (최대 5개)
      const { data: breedData } = await supabase
        .from('breeds')
        .select('id, name_ko')
        .eq('dog_mbti', result)
        .limit(5);
      if (breedData) setBreeds(breedData);

      setLoading(false);
    };

    fetchData();
  }, [result]);

  if (loading) {
    return <div className="text-center">결과를 분석 중입니다...</div>;
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <CardDescription>내 강아지의 성향은?</CardDescription>
        <CardTitle className="text-4xl font-bold text-primary">{result}</CardTitle>
        <p className="text-2xl font-semibold">{info?.title || "알려지지 않은 유형"}</p>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6 text-left">
          {info?.description || "이 유형에 대한 자세한 설명이 아직 준비되지 않았습니다."}
        </p>
        
        {breeds.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">이런 성향의 친구들이에요!</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {breeds.map(breed => (
                <Link key={breed.id} href={`/breeds/${breed.id}`} passHref>
                  <Button variant="outline">{breed.name_ko}</Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Button size="lg" onClick={onReset}>
          다시 테스트하기
        </Button>
      </CardContent>
    </Card>
  );
}
