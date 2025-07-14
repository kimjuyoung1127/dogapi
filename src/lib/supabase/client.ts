// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export function createClient() {
  // ✅ 기능 목적 요약: 클라이언트(브라우저) 환경에서 사용할 Supabase 클라이언트를 생성합니다.
  // 🤔 고민 지점: 환경 변수를 process.env가 아닌 import.meta.env로 접근해야 합니다.
  // 💡 여기서 배운 점: 생성된 DB 타입을 제네릭으로 전달하면, 클라이언트에서도 타입 안정성을 확보할 수 있다.
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
