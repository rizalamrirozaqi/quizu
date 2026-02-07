import { createClient } from "@/utils/supabase/server";
import { CheckCircle2, Circle, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Specific Roadmap
  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("*, roadmap_nodes(*, challenges(slug, difficulty, points))")
    .eq("id", id)
    .order("step_order", { foreignTable: "roadmap_nodes", ascending: true })
    .single();

  if (!roadmap) redirect("/roadmap");

  // 2. Fetch Progress
  const solvedIds = new Set();
  if (user) {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("challenge_id")
      .eq("user_id", user.id)
      .eq("status", "success");
    submissions?.forEach((s) => solvedIds.add(s.challenge_id));
  }

  // 3. Status Logic
  let foundActive = false;
  const nodesWithStatus = roadmap.roadmap_nodes.map((node: any) => {
    const isSolved = solvedIds.has(node.challenge_id);
    let status = "locked";

    if (isSolved) status = "completed";
    else if (!foundActive) {
      status = "active";
      foundActive = true;
    }

    return { ...node, status };
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen
      bg-white text-zinc-900
      dark:bg-black dark:text-zinc-100
    ">
      {/* Back */}
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-2 text-sm
          text-zinc-500 hover:text-zinc-900
          dark:text-zinc-400 dark:hover:text-white
          mb-8 transition"
      >
        <ArrowLeft size={16} /> Back to Tracks
      </Link>

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="
          text-5xl font-extrabold mb-4
          bg-clip-text text-transparent
          bg-gradient-to-b
          from-zinc-900 to-zinc-500
          dark:from-white dark:to-zinc-500
        ">
          {roadmap.title}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-lg">
          {roadmap.description}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Line */}
        <div className="
          absolute left-4 md:left-1/2 top-0 bottom-0 w-px
          bg-zinc-200 dark:bg-zinc-800
          -translate-x-1/2 hidden md:block
        " />
        <div className="
          absolute left-4 top-0 bottom-0 w-px
          bg-zinc-200 dark:bg-zinc-800
          md:hidden
        " />

        <div className="space-y-16">
          {nodesWithStatus.map((node: any, index: number) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={node.id}
                className={`relative flex items-center md:justify-between ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`ml-16 md:ml-0 w-full md:w-[45%] ${isLeft ? "md:text-right" : ""}`}>
                  <Link
                    href={node.challenges ? `/challenge/${node.challenges.slug}?roadmapId=${roadmap.id}` : "#"}
                    className={`
                      block p-6 rounded-2xl border transition-all duration-300 group
                      ${
                        node.status === "active"
                          ? `
                            bg-blue-500/10 border-blue-500/40
                            shadow-[0_0_30px_rgba(59,130,246,0.25)]
                          `
                          : node.status === "completed"
                          ? `
                            bg-green-500/10 border-green-500/30
                            opacity-90
                          `
                          : `
                            bg-zinc-50 border-zinc-200
                            dark:bg-zinc-900/50 dark:border-zinc-800
                            opacity-50 hover:opacity-100
                          `
                      }
                    `}
                  >
                    <div className={`flex items-center gap-2 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                      <span className="text-xs font-mono font-bold tracking-wider text-zinc-500">
                        STEP {index + 1}
                      </span>
                      {node.status === "active" && (
                        <span className="
                          text-[10px] font-bold px-2 py-0.5 rounded-full
                          bg-blue-500 text-white animate-pulse
                        ">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${
                      node.status === "active"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}>
                      {node.title}
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-500 mb-4">
                      {node.description}
                    </p>

                    {node.challenges && (
                      <div className={`
                        inline-flex items-center gap-2 text-xs font-bold
                        px-3 py-1.5 rounded border transition-colors
                        ${
                          node.status === "completed"
                            ? "border-green-500/40 text-green-600 bg-green-500/10"
                            : node.status === "active"
                            ? "border-blue-400/40 text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20"
                            : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                        }
                      `}>
                        {node.status === "completed" ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                        {node.challenges.slug}
                      </div>
                    )}
                  </Link>
                </div>

                {/* Center Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className={`
                    w-10 h-10 rounded-full border-4 flex items-center justify-center z-10
                    transition-all duration-500
                    ${
                      node.status === "completed"
                        ? "bg-green-500 border-green-700 scale-110"
                        : node.status === "active"
                        ? "bg-blue-500 border-blue-700 scale-125 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                        : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800"
                    }
                  `}>
                    {node.status === "completed" ? (
                      <CheckCircle2 size={20} className="text-white" />
                    ) : node.status === "active" ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                    ) : (
                      <Lock size={16} className="text-zinc-500" />
                    )}
                  </div>
                </div>

                <div className="hidden md:block w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
