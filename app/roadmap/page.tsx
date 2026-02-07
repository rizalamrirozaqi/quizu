import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import RoadmapPreviewSVG from "@/components/RoadmapPreviewSVG";

export const dynamic = "force-dynamic";

export default async function RoadmapListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const solvedIds = new Set<string>();

  if (user) {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("challenge_id")
      .eq("user_id", user.id)
      .eq("status", "success");

    submissions?.forEach((s) => solvedIds.add(s.challenge_id));
  }

  const { data: roadmaps } = await supabase
    .from("roadmaps")
    .select("*, roadmap_nodes(id, challenge_id)");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
            Learning Roadmaps
          </h1>
          <p className="mt-4 text-gray-500 dark:text-zinc-400 text-lg">
            Structured paths. Visual progress. Real mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {roadmaps?.map((map) => {
            const total = map.roadmap_nodes.length;
            const completed = map.roadmap_nodes.filter((n: any) =>
              solvedIds.has(n.challenge_id)
            ).length;

            const percent =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <Link
                key={map.id}
                href={`/roadmap/${map.id}`}
                className="
                  group relative flex flex-col
                  rounded-[28px] p-8
                  border bg-white
                  dark:bg-zinc-900/60
                  border-gray-200 dark:border-zinc-800
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                {/* Soft glow */}
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <RoadmapPreviewSVG total={total} completed={completed} />

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {map.title}
                </h3>

                <p className="text-gray-500 dark:text-zinc-400 flex-grow mb-6">
                  {map.description}
                </p>

                <div>
                  <div className="flex justify-between text-xs font-semibold uppercase mb-2 text-gray-400">
                    <span>Progress</span>
                    <span className={percent === 100 ? "text-green-500" : ""}>
                      {percent}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gray-900 dark:bg-white transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
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
