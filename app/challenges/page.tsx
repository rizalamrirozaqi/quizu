import { createClient } from "@/utils/supabase/server";
import ChallengeFilters from "@/components/ChallengeFilters";
import ChallengeList from "@/components/ChallengeList"; 

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; lang?: string }>;
};

export default async function ChallengesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from("challenges")
    .select("id, title, slug, difficulty, description, points, language, created_at")
    .order("created_at", { ascending: true });

  if (params.q) query = query.ilike('title', `%${params.q}%`);
  if (params.lang && params.lang !== 'all') query = query.eq('language', params.lang);

  const LIMIT = 12;
  const { data: initialChallenges } = await query.range(0, LIMIT - 1);

  const { data: { user } } = await supabase.auth.getUser();
  let solvedIds = new Set();
  if (user) {
     const { data: subs } = await supabase.from('submissions').select('challenge_id').eq('user_id', user.id).eq('status', 'success');
     subs?.forEach(s => solvedIds.add(s.challenge_id));
  }

  return (
    // 🔥 FIX BACKGROUND UTAMA: Abu Muda (Light) vs Hitam (Dark)
    <main className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">
            All Challenges
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 transition-colors">
            Explore, filter, and solve problems to increase your ELO.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
            <ChallengeFilters />
        </div>

        {/* List Card */}
        <ChallengeList 
          initialData={initialChallenges || []} 
          solvedIds={Array.from(solvedIds)} 
          searchParams={params}
        />
      </div>
    </main>
  );
}