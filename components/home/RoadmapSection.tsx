import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import * as LucideIcons from "lucide-react"; 

export default async function RoadmapSection() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const solvedIds = new Set();
  if (user) {
    const { data: submissions } = await supabase.from("submissions")
      .select("challenge_id")
      .eq("user_id", user.id)
      .eq("status", "success");
    submissions?.forEach(s => solvedIds.add(s.challenge_id));
  }

  const { data: roadmaps } = await supabase.from("roadmaps")
    .select("*, roadmap_nodes(id, challenge_id)")
    .limit(3);

  if (!roadmaps || roadmaps.length === 0) return null;

  return (
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
        {roadmaps.map((map) => {
          // @ts-ignore
          const Icon = LucideIcons[map.icon_name] || LucideIcons.Map;
          const totalNodes = map.roadmap_nodes?.length || 0;
          const completedNodes = map.roadmap_nodes?.filter((n: any) => solvedIds.has(n.challenge_id)).length || 0;
          const percent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

          return (
            <Link href={`/roadmap/${map.id}`} key={map.id} className="block p-6 rounded-2xl border transition group cursor-pointer shadow-sm hover:shadow-md bg-white border-gray-200 hover:border-blue-400 dark:bg-zinc-900/40 dark:backdrop-blur-sm dark:border-zinc-800 dark:hover:border-blue-500/50 dark:hover:bg-zinc-800/60">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-zinc-100">{map.title}</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4 line-clamp-2">{map.description}</p>
              
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
  );
}