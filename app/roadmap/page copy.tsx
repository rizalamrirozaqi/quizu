import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RoadmapListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch User Progress
  const solvedIds = new Set();
  if (user) {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("challenge_id")
      .eq("user_id", user.id)
      .eq("status", "success");
    submissions?.forEach(s => solvedIds.add(s.challenge_id));
  }

  // 2. Fetch All Roadmaps
  const { data: roadmaps } = await supabase
    .from("roadmaps")
    .select("*, roadmap_nodes(id, challenge_id)");

  return (
    // 🔥 MAIN CONTAINER
    <main className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Choose Your Path.
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Select a specialized track to master specific skills. From Algorithms to Systems Design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmaps?.map((map) => {
            // @ts-ignore
            const Icon = LucideIcons[map.icon_name] || LucideIcons.Map;
            
            const totalNodes = map.roadmap_nodes.length;
            const completedNodes = map.roadmap_nodes.filter((n: any) => solvedIds.has(n.challenge_id)).length;
            const percent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

            return (
              <Link 
                href={`/roadmap/${map.id}`} 
                key={map.id} 
                // 🔥 CARD STYLING ADAPTIVE
                className="group relative flex flex-col p-8 rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg
                  bg-white border-gray-200 hover:border-gray-300
                  dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>

                {/* Icon Box */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300
                    bg-gray-100 text-gray-900 
                    dark:bg-zinc-800 dark:text-white">
                  <Icon size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{map.title}</h3>
                <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed flex-grow">
                  {map.description}
                </p>

                <div className="mt-auto">
                   <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">
                      <span>Progress</span>
                      <span className={percent === 100 ? "text-green-500" : "text-gray-900 dark:text-zinc-300"}>{percent}%</span>
                   </div>
                   {/* Progress Bar Track */}
                   <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${percent === 100 ? 'bg-green-500' : 'bg-gray-900 dark:bg-white'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                   </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}