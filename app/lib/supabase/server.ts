// path/to/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest } from "next/server";

export function createSupabaseServer(request: NextRequest) {
    const cookieStore = request.cookies;

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // This method is called from a Server Component.
                    // You can set cookies here if needed.
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // This method is called from a Server Component.
                    // You can remove cookies here if needed.
                    cookieStore.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );
}
