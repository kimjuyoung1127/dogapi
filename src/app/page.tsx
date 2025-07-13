// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";
import { BreedCard } from "@/components/BreedCard";

export default async function HomePage() {
  // ✅ 기능 목적 요약: 메인 페이지에서 Supabase의 'breeds' 테이블 데이터를 가져와 카드로 보여줍니다.
  // 💡 여기서 배운 점: 서버 컴포넌트의 console.log는 브라우저가 아닌, 실행 터미널에 출력된다.
  const supabase = createClient();
  const { data: breeds, error } = await supabase.from("breeds").select();

  // --- 🐞 디버깅 코드 ---
  console.log("Fetched breeds data:", breeds);
  if (error) {
    console.error("Supabase fetch error:", error);
  }
  // --------------------

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Woofpedia 견종 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {breeds?.map((breed) => (
          <BreedCard key={breed.id} breed={breed} />
        ))}
      </div>
    </main>
  );
}
