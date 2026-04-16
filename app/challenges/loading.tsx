import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          {/* Skeleton Title */}
          <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
          {/* Skeleton Subtitle */}
          <div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 flex flex-wrap gap-4 animate-pulse">
          <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700"></div>
          <div className="h-10 w-full md:w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700"></div>
        </div>

        {/* Challenge List Skeleton (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div 
              key={i} 
              className="p-5 h-32 rounded-xl border bg-white border-gray-200 dark:bg-zinc-900/40 dark:border-zinc-800 animate-pulse flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                {/* Difficulty Badge */}
                <div className="h-5 w-12 bg-gray-100 dark:bg-zinc-800 rounded"></div>
              </div>
              
              <div className="flex gap-4">
                {/* Lang & Points */}
                <div className="h-4 w-16 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                <div className="h-4 w-16 bg-gray-100 dark:bg-zinc-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Spinner in the center just to assure user it's loading */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
           <div className="bg-white/80 dark:bg-black/80 p-3 rounded-full shadow-lg backdrop-blur-sm">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
           </div>
        </div>

      </div>
    </main>
  );
}