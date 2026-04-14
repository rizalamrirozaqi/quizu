"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Baby, Swords, Crown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingModalProps {
  user?: any;
  currentElo?: number;
}

export default function OnboardingModal({ user, currentElo }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: profile } = await supabase.from('profiles').select('score').eq('id', user.id).single();
      if (profile && profile.score === 0) setIsOpen(true);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSelectElo = async (elo: number) => {
    setIsUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error } = await supabase.from('profiles').update({ score: elo }).eq('id', user.id);
        if (!error) { setIsOpen(false); router.refresh(); }
    }
    setIsUpdating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* CONTAINER MODAL ADAPTIVE */}
      <div className="relative max-w-3xl w-full rounded-3xl p-8 shadow-2xl overflow-hidden
        bg-white border border-gray-200 
        dark:bg-[#09090b] dark:border-zinc-800">
        
        {/* Hiasan Atas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">Welcome to Quizu! 👋</h2>
          <p className="text-gray-500 dark:text-zinc-400">How experienced are you with algorithms?</p>
          <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">(This sets your initial ELO matchmaking)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card Component Helper */}
          {[
            { label: 'Newbie', elo: 400, desc: "I'm just starting out.", icon: Baby, color: 'green' },
            { label: 'Intermediate', elo: 800, desc: "I know my way around.", icon: Swords, color: 'yellow' },
            { label: 'Expert', elo: 1200, desc: "I eat bugs for breakfast.", icon: Crown, color: 'red' }
          ].map((item) => (
             <button 
                key={item.elo}
                onClick={() => handleSelectElo(item.elo)}
                disabled={isUpdating}
                className={`group relative flex flex-col items-start p-6 rounded-2xl border transition-all text-left shadow-sm hover:shadow-md
                   bg-gray-50 border-gray-200 hover:bg-white
                   dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:bg-zinc-900
                   ${item.color === 'green' ? 'hover:border-green-400' : item.color === 'yellow' ? 'hover:border-yellow-400' : 'hover:border-red-400'}
                `}
             >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition
                    ${item.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-500' : 
                      item.color === 'yellow' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500' : 
                      'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500'}`}
                >
                   <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{item.label}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">{item.desc}</p>
                <div className={`mt-auto text-xs font-mono font-bold px-2 py-1 rounded border
                    ${item.color === 'green' ? 'text-green-600 bg-green-50 border-green-200 dark:text-green-500 dark:bg-green-500/10 dark:border-green-500/20' : 
                      item.color === 'yellow' ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500/20' : 
                      'text-red-600 bg-red-50 border-red-200 dark:text-red-500 dark:bg-red-500/10 dark:border-red-500/20'}`}
                >
                   Start: {item.elo} ELO
                </div>
             </button>
          ))}
        </div>

        {isUpdating && (
           <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[2px] bg-white/50 dark:bg-black/50">
              <Loader2 className="animate-spin text-gray-900 dark:text-white" size={32} />
           </div>
        )}
      </div>
    </div>
  );
}