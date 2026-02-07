import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import { Trophy, PlusSquare, LogIn } from 'lucide-react';
import UserMenu from "./UserMenu"; 
import NavLinks from "./NavLinks"; // 👈 Import komponen baru

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300
        bg-white/80 border-gray-200
        dark:bg-black/80 dark:border-zinc-800">
        
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO & MENU KIRI */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 hover:opacity-80 transition group text-gray-900 dark:text-white">
            <div className="w-7 h-7 flex items-center justify-center rounded-md font-mono text-sm font-bold shadow-sm transition-colors
                bg-black text-white 
                dark:bg-white dark:text-black">
                Q
            </div>
            quizu.
          </Link>

          {/* 🔥 NAV LINKS YANG PINTAR (Active State) */}
          <NavLinks />
        </div>
        
        {/* MENU KANAN (User/Auth) */}
        <div className="flex items-center gap-4 text-sm">
           {user && profile ? (
             <>
                <Link href="/create" className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded transition
                    bg-white border-gray-200 text-gray-700 hover:bg-gray-50
                    dark:bg-transparent dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                   <PlusSquare size={14} /> <span>Create</span>
                </Link>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border
                    bg-yellow-50 border-yellow-200 text-yellow-600
                    dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-500">
                   <Trophy size={12} fill="currentColor" />
                   <span className="font-bold">{profile.elo || 0}</span>
                </div>

                <UserMenu user={user} profile={profile} />
             </>
           ) : (
             <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition shadow-sm
                bg-black text-white hover:bg-gray-800
                dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <LogIn size={14} /> Sign In
             </Link>
           )}
        </div>
      </div>
    </nav>
  );
}