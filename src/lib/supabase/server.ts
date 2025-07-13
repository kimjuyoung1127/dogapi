// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 💡 여기서 배운 점:
// 1. Next.js 13+의 서버 컴포넌트에서 cookies()는 비동기(async/await)로 처리해야 한다.
// 2. 서버 전용 로직(데이터 fetching 등)에서는 RLS를 우회할 수 있는 'service_role' 키를 사용하는 것이 더 안정적이다.
//    이 키는 'NEXT_PUBLIC_' 접두사 없이 환경 변수로 관리하여 브라우저 노출을 막는다.

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // anon key 대신 service_role key 사용
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value
        },
        async set(name:string, value: string, options: CookieOptions) {
          await cookieStore.set({ name, value, ...options })
        },
        async remove(name: string, options: CookieOptions) {
          await cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}