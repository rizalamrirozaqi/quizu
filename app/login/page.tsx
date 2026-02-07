"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, Suspense } from "react";
import { Github, Chrome, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Kita pisah jadi component LoginContent biar bisa dibungkus Suspense
function LoginContent() {
  const [loading, setLoading] = useState<string | null>(null); // Ubah jadi string biar tahu mana yang loading
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Kita bikin fungsi ini dinamis terima provider
  const handleLogin = async (provider: 'github' | 'google') => {
    setLoading(provider); // Set loading sesuai tombol yang diklik
    
    // Tentukan redirect URL (otomatis detect lagi di localhost atau vercel)
    // const redirectTo = `${window.location.origin}/auth/callback`;
    const redirectTo = `${window.location.origin}/auth/callback?next=/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectTo,
        queryParams: {
            // Khusus Google: paksa user pilih akun biar gak otomatis login akun sebelumnya
            access_type: 'offline',
            prompt: 'consent',
          },
      },
    });

    if (error) {
        alert(error.message);
        setLoading(null);
    }
  };

  return (
    <div className="vercel-card w-full max-w-md p-8 text-center border-t-4 border-t-black dark:border-t-white relative">
      <div className="mb-6 flex justify-center">
        <div className="w-10 h-10 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center rounded-md font-mono text-xl font-bold">Q</div>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-500 mb-6 text-sm">Sign in to track your progress.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-600 text-xs flex items-center gap-2 text-left">
           <AlertCircle size={16} />
           <span>Login gagal. Silakan coba lagi.</span>
        </div>
      )}

      {/* Tombol GitHub (Gelap) */}
      <button
        onClick={() => handleLogin('github')}
        disabled={loading !== null}
        className="bg-[#24292F] text-white hover:bg-[#24292F]/90 w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-md transition-all disabled:opacity-70"
      >
        {loading === 'github' ? <Loader2 className="animate-spin" size={20} /> : <Github size={20} />}
        {loading === 'github' ? "Connecting..." : "Continue with GitHub"}
      </button>

      {/* Tombol Google (Terang/Putih dengan border) */}
      <button
        onClick={() => handleLogin('google')}
        disabled={loading !== null}
        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-full flex items-center justify-center gap-2 py-3 rounded-md transition-all disabled:opacity-70"
      >
        {/* Pake icon Chrome sebagai representasi Google */}
        {loading === 'google' ? <Loader2 className="animate-spin text-gray-600" size={20} /> : <Chrome size={20} className="text-blue-600" />}
        {loading === 'google' ? "Connecting..." : "Continue with Google"}
      </button>
    </div>
  );
}

// Component Utama
export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      {/* Wajib bungkus Suspense kalau pakai useSearchParams di Client Component */}
      <Suspense fallback={<div className="animate-pulse w-full max-w-md h-64 bg-gray-100 rounded-lg"></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}