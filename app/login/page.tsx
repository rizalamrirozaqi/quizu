"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, Suspense } from "react";
import { Github, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Kita pisah jadi component LoginContent biar bisa dibungkus Suspense
function LoginContent() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // Ambil error dari URL

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
        alert(error.message);
        setLoading(false);
    }
  };

  return (
    <div className="vercel-card w-full max-w-md p-8 text-center border-t-4 border-t-black dark:border-t-white relative">
      <div className="mb-6 flex justify-center">
        <div className="w-10 h-10 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center rounded-md font-mono text-xl font-bold">Q</div>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-500 mb-6 text-sm">Sign in to track your progress.</p>

      {/* Tampilkan Error kalau ada (misal habis cancel) */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-600 text-xs flex items-center gap-2 text-left">
           <AlertCircle size={16} />
           <span>Login dibatalkan atau gagal. Silakan coba lagi.</span>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="vercel-btn-dark w-full flex items-center justify-center gap-2 py-3 mb-4 disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Github size={20} />}
        {loading ? "Connecting..." : "Continue with GitHub"}
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