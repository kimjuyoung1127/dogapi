// src/app/breeds/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureRating } from '@/components/FeatureRating';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createServerSupabaseClient } from '@/lib/supabase/server';

type BreedPageProps = {
  params: {
    id: string;
  };
};

// ✅ 기능 목적 요약: 단일 견종의 모든 상세 정보를 조회하고 UI에 렌더링합니다.
export default async function BreedPage({ params }: BreedPageProps) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  // 💡 여기서 배운 점:
  // Supabase에서 데이터를 조회할 때, 파라미터로 받은 id의 타입을 그대로 사용해야 한다.
  // id가 숫자 형태의 문자열이 아닐 수 있으므로, isNaN과 같은 숫자 변환 로직을 제거한다.
  const { data: breed, error } = await supabase
    .from('breeds')
    .select(`
      *,
      breed_details (*),
      breed_diseases (
        disease_name,
        description
      ),
      mbti_descriptions (
        description
      )
    `)
    .eq('id', id) // 🐞 버그 수정: Number() 변환 제거
    .single();

  if (error || !breed) {
    // --- 🐞 디버깅 코드 ---
    console.error('Error fetching breed data:', error);
    console.log('--- 🐞 Full Response Object ---');
    console.log(JSON.stringify({ data: breed, error }, null, 2));
    // --------------------
    notFound();
  }
  
  // --- 🐞 디버깅 코드 ---
  console.log('--- ✅ Fetched Breed Data ---');
  console.log(JSON.stringify(breed, null, 2));
  // --------------------

  const details = (breed.breed_details && breed.breed_details.length > 0) ? breed.breed_details[0] : {};
  const mbtiDesc = breed.mbti_descriptions?.description ?? '관련 정보가 없습니다.';
  const diseases = breed.breed_diseases || [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* 견종 이미지 */}
        <div className="w-full">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={breed.thumbnail_url || '/placeholder.svg'}
                alt={breed.name_ko}
                width={700}
                height={700}
                className="object-cover w-full h-full aspect-square"
              />
            </CardContent>
          </Card>
        </div>

        {/* 기본 정보 */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            {breed.mbti && <Badge variant="secondary" className="text-lg">{breed.mbti}</Badge>}
            <h1 className="text-5xl font-extrabold tracking-tight">{breed.name_ko}</h1>
            <p className="text-2xl text-muted-foreground">{breed.name_en}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">크기: {details.size ?? '정보 없음'}</Badge>
            <Badge variant="outline">원산지: {breed.origin ?? '정보 없음'}</Badge>
          </div>
          <p className="text-base leading-relaxed">{details.description ?? '설명이 없습니다.'}</p>
        </div>
      </div>

      <div className="mt-16">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {/* 특징 평가 */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-2xl font-semibold">견종 특징</AccordionTrigger>
            <AccordionContent className="pt-4">
              <Card>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <FeatureRating label="적응력" rating={details.adaptability} />
                  <FeatureRating label="친화력" rating={details.friendliness} />
                  <FeatureRating label="건강 관리" rating={details.health_needs} />
                  <FeatureRating label="훈련 용이성" rating={details.trainability} />
                  <FeatureRating label="필요 운동량" rating={details.exercise_needs} />
                  <FeatureRating label="털 빠짐" rating={details.shedding_level} />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* MBTI 정보 */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-2xl font-semibold">MBTI 분석 ({breed.mbti})</AccordionTrigger>
            <AccordionContent className="pt-4">
               <Card>
                <CardContent className="p-6">
                  <p className="text-base leading-relaxed">{mbtiDesc}</p>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* 유전 질환 정보 */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-2xl font-semibold">주요 유전 질환</AccordionTrigger>
            <AccordionContent className="pt-4">
              <Card>
                <CardContent className="p-6">
                  {diseases.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {diseases.map((d: { disease_name: string }) => <li key={d.disease_name}>{d.disease_name}</li>)}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">특별히 알려진 주요 유전 질환이 없습니다.</p>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}