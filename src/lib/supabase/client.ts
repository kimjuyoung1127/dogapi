// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // ✅ 기능 목적 요약: 클라이언트(브라우저) 환경에서 사용할 Supabase 클라이언트를 생성합니다.
  // 🤔 고민 지점: 환경 변수를 process.env가 아닌 import.meta.env로 접근해야 합니다.
  // 💡 여기서 배운 점: Next.js에서는 환경 변수 앞에 `NEXT_PUBLIC_`을 붙여야 브라우저에 노출됩니다.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
