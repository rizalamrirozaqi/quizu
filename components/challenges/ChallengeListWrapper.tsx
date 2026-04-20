// file: components/challenges/ChallengeListWrapper.tsx
import { createClient } from "@/utils/supabase/server";
import ChallengeList from "./ChallengeList"; 

export default async function ChallengeListWrapper({ searchParams }: { searchParams: any }) {
  const supabase = await createClient();

  // 1. Fetching Data Challenges
  let query = supabase
    .from("challenges")
    .select("id, title, slug, difficulty, description, points, language, created_at")
    .order("created_at", { ascending: true });

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`);
  if (searchParams.lang && searchParams.lang !== 'all') {
    query = query.eq('language', searchParams.lang);
  }

  const LIMIT = 12;
  const { data: initialChallenges } = await query.range(0, LIMIT - 1);

  // 2. Fetching Solved Status User
  const { data: { user } } = await supabase.auth.getUser();
  let solvedIds = new Set();
  
  if (user) {
     const { data: subs } = await supabase.from('submissions')
       .select('challenge_id')
       .eq('user_id', user.id)
       .eq('status', 'success');
       
     subs?.forEach(s => solvedIds.add(s.challenge_id));
  }

  // 3. Lempar data matang ke Client Component kamu
  return (
    <ChallengeList 
      initialData={initialChallenges || []} 
      solvedIds={Array.from(solvedIds)} 
      searchParams={searchParams}
    />
  );
}