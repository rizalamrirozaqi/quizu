"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User as UserIcon, Settings, LogOut, LayoutDashboard, Trophy } from "lucide-react";

export default function UserMenu({ user, profile }: { user: any, profile: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Logic: Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Huruf depan untuk Avatar
  const initials = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      
      {/* 1. TRIGGER BUTTON (AVATAR) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border border-[var(--border)] transition-all ${isOpen ? 'ring-2 ring-blue-500' : 'hover:border-gray-400'}`}
             style={{ background: 'linear-gradient(135deg, #2563eb, #9333ea)' }}>
             {initials}
        </div>
      </button>

      {/* 2. DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header User Info */}
          <div className="px-4 py-3 border-b border-[#333]">
            <p className="text-sm text-white font-medium truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-yellow-500 font-mono">
               <Trophy size={12} /> {profile?.elo || 0} ELO
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link 
              href="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <UserIcon size={16} /> Your Profile
            </Link>
            
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <Settings size={16} /> Settings
            </Link>
          </div>

          <div className="border-t border-[#333] py-1">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer text-left"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

        </div>
      )}
    </div>
  );
}