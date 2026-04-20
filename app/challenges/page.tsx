import { Suspense } from "react";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import ChallengeListWrapper from "@/components/challenges/ChallengeListWrapper";
import { Section } from "lucide-react";

// export const dynamic = "force-dynamic";
export const revalidate = 60;

type Props = {
  searchParams: Promise<{ q?: string; lang?: string }>;
};

export default async function ChallengesPage ({ searchParams } : Props) {
  const params = await searchParams;

  return (
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
        <Suspense fallback={<SectionSkeleton title="Challenges" />}>
          <ChallengeList 
            initialData={initialChallenges || []} 
            solvedIds={Array.from(solvedIds)} 
            searchParams={params}
          />
        </Suspense>
      </div>
    </main>
  );
}