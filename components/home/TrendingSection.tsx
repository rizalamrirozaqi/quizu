import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Terminal, Trophy, TrendingUp } from "lucide-react";

export default async function TrendingSection() {
  const supabase = await createClient();
  
  const { data: trendingChallenges } = await supabase.from("challenges")
    .select("id, title, slug, difficulty, points, language")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!trendingChallenges || trendingChallenges.length === 0) return null;

  return (
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
        {trendingChallenges.map((c) => (
          <Link href={`/challenge/${c.slug}`} key={c.id} className="p-5 rounded-xl border transition group shadow-sm hover:shadow-md bg-white border-gray-200 hover:border-gray-300 dark:bg-zinc-900/40 dark:backdrop-blur-sm dark:border-zinc-800 dark:hover:bg-zinc-800/60 dark:hover:border-zinc-700">
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
  );
}