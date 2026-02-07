import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Terminal, Trophy, Map, TrendingUp } from "lucide-react";
import * as LucideIcons from "lucide-react"; 
import HeroBackground from "@/components/HeroBackground"; 
import AnimatedCode from "@/components/AnimatedCode";
import CountUp from "@/components/CountUp";

export const dynamic = "force-dynamic"; 

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Fetch Stats
  const { count: challengeCount } = await supabase.from("challenges").select("*", { count: 'exact', head: true });
  const { count: badgeCount } = await supabase.from("badges").select("*", { count: 'exact', head: true });
  const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
  
  // 2. Fetch User Solved IDs
  const solvedIds = new Set();
  if (user) {
    const { data: submissions } = await supabase.from("submissions").select("challenge_id").eq("user_id", user.id).eq("status", "success");
    submissions?.forEach(s => solvedIds.add(s.challenge_id));
  }

  // 3. Fetch Trending & Roadmaps
  const { data: trendingChallenges } = await supabase.from("challenges").select("id, title, slug, difficulty, points, language").order("created_at", { ascending: false }).limit(6);
  const { data: roadmaps } = await supabase.from("roadmaps").select("*, roadmap_nodes(id, challenge_id)").limit(3);

  return (
    // 🔥 WRAPPER UTAMA ADAPTIVE
    <main className="relative min-h-screen flex flex-col overflow-x-hidden bg-white dark:bg-black transition-colors duration-300">
      
      {/* BACKGROUND GLOBAL */}
      <HeroBackground />

      {/* =========================================
          SECTION 1: HERO (ANIMATED)
      ========================================= */}
      <section className="w-full pt-28 pb-20 lg:pt-40 lg:pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* KIRI: Text Content */}
            <div className="text-center lg:text-left">
              
              {/* Badge Version */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700
                bg-gray-100 border-gray-200 text-gray-600
                dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400">
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
                {/* Primary Button */}
                <Link href="/challenges" className="group relative flex items-center justify-center px-8 py-4 font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-lg shadow-blue-500/20
                  bg-gray-900 text-white hover:bg-black
                  dark:bg-white dark:text-black dark:hover:bg-gray-200">
                   <span className="relative z-10 flex items-center gap-2 ">
                     Start Coding <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                   </span>
                </Link>

                {/* Secondary Button */}
                <Link href="/roadmap" className="px-8 py-4 font-bold rounded-full border transition-all flex items-center gap-2 justify-center
                  bg-white text-gray-900 border-gray-200 hover:bg-gray-50
                  dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800">
                   <Terminal size={18} /> View Roadmap
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t pt-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500
                 border-gray-200 dark:border-zinc-800/50">
                
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

            {/* KANAN: SVG Animation */}
            <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
               <AnimatedCode />
            </div>

          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 2: ROADMAPS 🗺️
      ========================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 mb-24 relative z-10">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
               <Map className="text-blue-500"/> Learning Paths
            </h2>
            <Link href="/roadmap" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
               View All <ArrowRight size={14}/>
            </Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmaps?.map((map) => {
               // @ts-ignore
               const Icon = LucideIcons[map.icon_name] || LucideIcons.Map;
               const totalNodes = map.roadmap_nodes.length;
               const completedNodes = map.roadmap_nodes.filter((n: any) => solvedIds.has(n.challenge_id)).length;
               const percent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

               return (
                 <Link href={`/roadmap/${map.id}`} key={map.id} className="block p-6 rounded-2xl border transition group cursor-pointer shadow-sm hover:shadow-md
                    bg-white border-gray-200 hover:border-blue-400
                    dark:bg-zinc-900/40 dark:backdrop-blur-sm dark:border-zinc-800 dark:hover:border-blue-500/50 dark:hover:bg-zinc-800/60">
                    
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition
                        bg-blue-50 text-blue-600
                        dark:bg-blue-500/10 dark:text-blue-500">
                       <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-zinc-100">{map.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4 line-clamp-2">{map.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                       <div className="bg-blue-500 h-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500 dark:text-zinc-500">{percent}% Completed</p>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">Continue &rarr;</p>
                    </div>
                 </Link>
               )
            })}
         </div>
      </section>


      {/* =========================================
          SECTION 3: TRENDING CHALLENGES
      ========================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-20 relative z-10">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
               <TrendingUp className="text-red-500"/> Trending Challenges
            </h2>
            <Link href="/challenges" className="text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 transition-colors">
               Explore 1000+ Problems <ArrowRight size={14}/>
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingChallenges?.map((c) => (
               <Link href={`/challenge/${c.slug}`} key={c.id} className="p-5 rounded-xl border transition group shadow-sm hover:shadow-md
                 bg-white border-gray-200 hover:border-gray-300
                 dark:bg-zinc-900/40 dark:backdrop-blur-sm dark:border-zinc-800 dark:hover:bg-zinc-800/60 dark:hover:border-zinc-700">
                 
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold truncate pr-4 transition-colors text-gray-900 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400">{c.title}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
                       c.difficulty === 'hard' ? 'text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-500/20 dark:bg-red-500/10' : 
                       c.difficulty === 'medium' ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-500/20 dark:bg-yellow-500/10' :
                       'text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-500/20 dark:bg-green-500/10'
                    }`}>
                       {c.difficulty}
                    </span>
                 </div>
                 <div className="text-xs text-gray-500 dark:text-zinc-500 flex gap-4">
                    <span className="capitalize flex items-center gap-1">
                       <Terminal size={12}/> {c.language}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500/80">
                       <Trophy size={12}/> +{c.points} ELO
                    </span>
                 </div>
               </Link>
            ))}
         </div>
      </section>

    </main>
  );
}