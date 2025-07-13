// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 💡 여기서 배운 점:
// Next.js 13+의 서버 환경에서 Supabase SSR을 사용하려면,
// cookies 객체의 모든 메서드(get, set, remove)를 try...catch 블록으로 감싸
// 서버 컴포넌트 렌더링 과정에서 발생할 수 있는 예외를 안전하게 처리해야 한다.

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
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

