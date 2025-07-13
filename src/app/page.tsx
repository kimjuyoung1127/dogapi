// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  // ✅ 기능 목적 요약: 메인 페이지에서 Supabase의 'breeds' 테이블 데이터를 가져와 보여줍니다.
  // 💡 여기서 배운 점: `async` 함수로 선언하면 이 컴포넌트는 자동으로 서버 컴포넌트가 되며,
  // 서버에서 직접 데이터 fetching을 수행할 수 있습니다.
  const supabase = createClient();
  const { data: breeds } = await supabase.from("breeds").select();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Woofpedia 견종 목록</h1>
      <ul>
        {breeds?.map((breed) => (
          <li key={breed.id}>{breed.name_ko}</li>
        ))}
      </ul>
    </main>
  );
}
