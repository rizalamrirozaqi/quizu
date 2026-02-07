import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Ambil parameter "next" atau default ke "/"
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // --- LOGIC PROFILE KAMU (Tetap dipertahankan) ---
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
         const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single();
         if (!profile) {
            await supabase.from('profiles').insert({
                id: user.id,
                username: user.user_metadata.user_name || user.email?.split('@')[0],
                avatar_url: user.user_metadata.avatar_url,
                elo: 1000,
                trophies: 0
            });
         }
      }
      // ------------------------------------------------

      // FIX VERCEL: Deteksi apakah running di localhost atau production
      const forwardedHost = request.headers.get('x-forwarded-host'); // Host asli Vercel
      const isLocal = origin.includes('localhost');

      if (isLocal) {
        // Kalau di laptop, pakai origin biasa
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Kalau di Vercel, PAKSA HTTPS biar cookies aman
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        // Fallback
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Kalau gagal
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}