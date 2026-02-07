import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  Trophy,
  Target,
  Zap,
  Clock,
  CalendarDays,
  Code2,
  Medal,
  Lock,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import ActivityHeatmap from "@/components/ActivityHeatmap";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  /* ================= DATA ================= */

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, status, created_at, challenges(title, slug, difficulty, points)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: allBadges } = await supabase.from("badges").select("*");
  const { data: unlockedBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", user.id);

  const unlockedSet = new Set(unlockedBadges?.map(b => b.badge_id));

  const solvedCount =
    submissions?.filter(s => s.status === "success").length || 0;
  const totalSubmissions = submissions?.length || 0;
  const winRate =
    totalSubmissions > 0
      ? Math.round((solvedCount / totalSubmissions) * 100)
      : 0;

  const { count: rankCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("elo", profile?.elo || 0);

  const currentRank = (rankCount || 0) + 1;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {user.email?.charAt(0).toUpperCase()}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">
              {profile?.username || user.email?.split("@")[0]}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              <CalendarDays size={14} />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="md:ml-auto">
            <Link
              href="/settings"
              className="px-4 py-2 rounded-lg border text-sm font-medium
              border-gray-300 dark:border-zinc-700
              bg-white dark:bg-transparent
              hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Trophy, label: "ELO", value: profile?.elo, color: "text-yellow-500" },
            { icon: Target, label: "Solved", value: solvedCount, color: "text-green-500" },
            { icon: Zap, label: "Win Rate", value: `${winRate}%`, color: "text-blue-500" },
            { icon: Clock, label: "Rank", value: `#${currentRank}`, color: "text-purple-500" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center gap-2"
            >
              <s.icon size={22} className={s.color} />
              <div className="text-2xl font-bold font-mono">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ================= BADGES ================= */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Medal className="text-yellow-500" /> Achievements
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {allBadges?.map(badge => {
              const unlocked = unlockedSet.has(badge.id);
              // @ts-ignore
              const Icon = LucideIcons[badge.icon_name] || LucideIcons.Award;

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center
                  ${unlocked
                    ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30"
                    : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 opacity-60 grayscale"
                  }`}
                >
                  {!unlocked && (
                    <Lock size={12} className="absolute top-3 right-3 text-gray-400" />
                  )}

                  <div
                    className={`p-3 rounded-full mb-3
                    ${unlocked
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                      : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="text-xs font-bold">{badge.name}</div>
                  <div className="text-[10px] text-gray-500">
                    {badge.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <ActivityHeatmap userId={user.id} />
        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="text-gray-500" /> Recent Submissions
          </h2>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {submissions?.map(sub => {
              const challenge = Array.isArray(sub.challenges) ? sub.challenges[0] : sub.challenges;
              const diffColor =
                  challenge?.difficulty === "easy"
                    ? "text-green-500 bg-green-500/10"
                    : challenge?.difficulty === "medium"
                    ? "text-yellow-500 bg-yellow-500/10"
                    : "text-red-500 bg-red-500/10";

              return (
                <div
                  key={sub.id}
                  className="px-5 py-4 flex items-center justify-between border-b
                  border-gray-100 dark:border-zinc-800 last:border-0"
                >
                  <div>
                    <div
                      className={`font-semibold ${
                        sub.status === "success"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {challenge?.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${diffColor}`}>
                      {challenge?.difficulty}
                    </span>
                    {sub.status === "success" && (
                      <span className="font-mono font-bold text-yellow-500">
                        +{challenge?.points || 0} pts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {submissions?.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">
                No submissions yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
