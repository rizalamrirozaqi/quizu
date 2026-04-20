// file: app/challenges/loading.tsx
import { Loader2 } from "lucide-react";

export default function ChallengesLoading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Placeholder Header biar layout gak lompat */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-64 mb-4"></div>
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-96"></div>
        </div>

        {/* Loading Spinner di tengah halaman */}
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p>Mempersiapkan tantangan...</p>
        </div>
      </div>
    </main>
  );
}