import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value;
          } catch (error) {
            // 서버 컴포넌트에서 `get` 메소드가 호출될 때 발생할 수 있는 오류입니다.
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 서버 컴포넌트에서 `set` 메소드가 호출될 때 발생할 수 있는 오류입니다.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // 서버 컴포넌트에서 `remove` 메소드가 호출될 때 발생할 수 있는 오류입니다.
          }
        },
      },
    }
  );
}
