"use client";

import { useState, useEffect } from "react"; // 1. Tambahkan useEffect
import Link from "next/link";
import { Zap, Code2, CheckCircle2, ArrowUpRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ChallengeList({ initialData, solvedIds, searchParams }: any) {
  const [challenges, setChallenges] = useState(initialData);
  const [offset, setOffset] = useState(initialData.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const solvedSet = new Set(solvedIds);

  // 2. TAMBAHKAN KODE INI
  // Fungsi ini akan mereset list setiap kali hasil search/filter dari server berubah
  useEffect(() => {
    setChallenges(initialData);
    setOffset(initialData.length);
    // Jika data awal kurang dari 12, berarti tidak ada halaman berikutnya
    setHasMore(initialData.length >= 12); 
  }, [initialData]); 

  const loadMore = async () => {
    setLoading(true);
    const LIMIT = 12;

    let query = supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: true })
      .range(offset, offset + LIMIT - 1);

    if (searchParams.q) query = query.ilike("title", `%${searchParams.q}%`);
    if (searchParams.lang && searchParams.lang !== "all")
      query = query.eq("language", searchParams.lang);

    const { data } = await query;

    if (data && data.length > 0) {
      setChallenges((prev: any) => [...prev, ...data]); // Gunakan prev state agar aman
      setOffset((prevOffset: number) => prevOffset + data.length);
      if (data.length < LIMIT) setHasMore(false);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((c: any) => {
          const isSolved = solvedSet.has(c.id);

          return (
            <Link
              key={c.id}
              href={`/challenge/${c.slug}`}
              className="group relative"
            >
              <div
                className={`
                  relative h-full flex flex-col p-6 rounded-3xl border
                  transition-all duration-300
                  ${
                    isSolved
                      ? `
                        bg-green-500/5 border-green-500/30
                        dark:bg-green-500/[0.06]
                      `
                      : `
                        bg-white border-zinc-200
                        hover:border-zinc-300 hover:shadow-md
                        dark:bg-zinc-900/50 dark:border-zinc-800
                        dark:hover:border-zinc-700
                      `
                  }
                `}
              >
                {/* Top */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`
                      px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border
                      ${
                        c.difficulty === "easy"
                          ? "border-green-500/30 text-green-600 dark:text-green-400"
                          : c.difficulty === "medium"
                          ? "border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
                          : "border-red-500/30 text-red-600 dark:text-red-400"
                      }
                    `}
                  >
                    {c.difficulty}
                  </span>

                  {isSolved && (
                    <CheckCircle2
                      size={16}
                      className="text-green-500"
                    />
                  )}
                </div>

                {/* Title */}
                <h3
                  className="
                    text-lg font-bold mb-2
                    text-zinc-900 dark:text-zinc-100
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                    transition-colors
                  "
                >
                  {c.title}
                </h3>

                {/* Footer */}
                <div className="
                  mt-auto pt-4 border-t
                  border-zinc-200 dark:border-zinc-800
                  flex justify-between items-center
                  text-xs text-zinc-500
                ">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Zap size={12} className="text-yellow-500" />
                      {c.points}
                    </div>
                    <div className="flex items-center gap-1">
                      <Code2 size={12} />
                      {c.language}
                    </div>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="
                      opacity-0 translate-x-1
                      group-hover:opacity-100 group-hover:translate-x-0
                      transition-all
                    "
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="mt-14 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="
              inline-flex items-center gap-2
              px-8 py-3 rounded-full
              text-sm font-semibold
              bg-zinc-900 text-white
              hover:bg-zinc-800
              dark:bg-white dark:text-black dark:hover:bg-zinc-200
              transition
              disabled:opacity-50
            "
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Loading..." : "Load More Challenges"}
          </button>
        </div>
      )}
    </>
  );
}
