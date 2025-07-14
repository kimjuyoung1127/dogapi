// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// 💡 여기서 배운 점:
// 생성된 DB 타입을 제네릭으로 전달하면, Supabase 클라이언트는
// 테이블과 컬럼 이름을 완벽하게 인지하여 자동 완성 및 타입 체크를 제공한다.
// 이를 통해 'column not found'와 같은 런타임 오류를 사전에 방지할 수 있다.
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value
          } catch (error) {
            // The `get` method was called from a Server Component.
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );

  // --- 🐞 디버깅 코드 ---
  console.log("Supabase server client object:", supabase);
  // --------------------

  return supabase;
}

