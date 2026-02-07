import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  
  // 1. CEK ERROR: Kalau user klik Cancel di GitHub, param 'error' bakal muncul
  const error = searchParams.get("error");
  if (error) {
    // Balikin ke Login biar gak 404
    return NextResponse.redirect(`${origin}/login?error=access_denied`);
  }

  if (code) {
    // 2. WAJIB AWAIT: Karena Next.js 15, createClient harus diawait
    const supabase = await createClient(); 
    
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!sessionError) {
      // Logic buat user profile otomatis (Check & Create)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
         const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single();
         
         if (!profile) {
            // Insert profile default untuk user baru
            await supabase.from('profiles').insert({
                id: user.id,
                username: user.user_metadata.user_name || user.email?.split('@')[0],
                avatar_url: user.user_metadata.avatar_url,
                elo: 1000,
                trophies: 0
            });
         }
      }
      // Sukses! Masuk ke Home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Kalau code gak ada & gak ada error spesifik, balikin ke login juga
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}