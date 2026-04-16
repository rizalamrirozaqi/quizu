import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Terminal, Trophy } from "lucide-react";
import AnimatedCode from "@/components/home/AnimatedCode";
import CountUp from "@/components/home/CountUp";

export default async function HeroSection() {
  const supabase = await createClient();
  
  // Fetching hanya untuk data stats (berjalan paralel jika dibuat Promise.all, 
  // tapi untuk query ringan seperti count, await berurutan juga tidak masalah)
  const [{ count: challengeCount }, { count: badgeCount }, { count: userCount }] = await Promise.all([
    supabase.from("challenges").select("*", { count: 'exact', head: true }),
    supabase.from("badges").select("*", { count: 'exact', head: true }),
    supabase.from("profiles").select("*", { count: 'exact', head: true })
  ]);

  return (
    <section className="w-full pt-28 pb-20 lg:pt-40 lg:pb-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-gray-100 border-gray-200 text-gray-600 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium">v1.0 Public Beta is Live</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-white dark:to-zinc-500">
                Master the Art of
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                Algorithms.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Join <strong>{userCount || 100}+ developers</strong> competing daily. Solve challenges, analyze complexity, and climb the global leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Link href="/challenges" className="group relative flex items-center justify-center px-8 py-4 font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-lg shadow-blue-500/20 bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200">
                 <span className="relative z-10 flex items-center gap-2 ">
                   Start Coding <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                 </span>
              </Link>
              <Link href="/roadmap" className="px-8 py-4 font-bold rounded-full border transition-all flex items-center gap-2 justify-center bg-white text-gray-900 border-gray-200 hover:bg-gray-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800">
                 <Terminal size={18} /> View Roadmap
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t pt-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500 border-gray-200 dark:border-zinc-800/50">
              <div>
                 <div className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                   <CountUp end={challengeCount || 50} suffix="+" />
                 </div>
                 <div className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Challenges</div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800"></div>
              <div>
                 <div className="text-2xl font-bold flex items-center gap-1 tabular-nums text-gray-900 dark:text-white">
                    <CountUp end={badgeCount || 25} /> 
                    <Trophy size={16} className="text-yellow-500"/>
                 </div>
                 <div className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Badges to Earn</div>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
             <AnimatedCode />
          </div>

        </div>
      </div>
    </section>
  );
}