// app/auth/signout/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  // Hapus sesi user
  await supabase.auth.signOut();

  // Redirect ke halaman login setelah logout
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}