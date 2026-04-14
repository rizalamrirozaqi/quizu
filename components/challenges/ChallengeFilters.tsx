"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Code2, XCircle } from "lucide-react";
import { Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentLang = searchParams.get("lang") || "all";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");
    router.replace(`/challenges?${params.toString()}`);
  }, 300);

  const handleFilter = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    if (lang && lang !== "all") params.set("lang", lang);
    else params.delete("lang");
    router.replace(`/challenges?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/challenges');
  };

  const hasFilter = currentSearch || currentLang !== "all";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 mt-2">
      <div className="relative w-full md:max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors" size={16} />
        </div>
        <input
          type="text"
          placeholder="Search challenges..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 rounded-full text-sm transition-all outline-none bg-white text-gray-900 border border-gray-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:bg-zinc-900/50 dark:text-zinc-200 dark:border-zinc-800 dark:focus:ring-white/20 dark:focus:border-zinc-500"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Code2 className="text-gray-400 dark:text-zinc-500" size={14} />
          </div>
          <select
            value={currentLang}
            onChange={(e) => handleFilter(e.target.value)}
            className="appearance-none w-full md:w-auto pl-9 pr-10 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all outline-none bg-white text-gray-700 border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:bg-zinc-900/50 dark:text-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-600 dark:focus:ring-white/20"
          >
            <option value="all" className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-300">All Languages</option>
            <option value="javascript" className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-300">JavaScript</option>
            <option value="python" className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-300">Python</option>
            <option value="go" className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-300">Go (Golang)</option>
            <option value="java" className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-300">Java</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
             <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 dark:text-zinc-500"><path d="M4 6L0.535898 0L7.4641 0L4 6Z" fill="currentColor"/></svg>
          </div>
        </div>

        {hasFilter && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full transition-colors text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-transparent dark:hover:bg-red-400/10">
                <XCircle size={14} />
                <span>Clear</span>
            </button>
        )}
      </div>
    </div>
  );
}

export default function ChallengeFilters() {
  return (
    <Suspense fallback={<div className="h-12 w-full bg-gray-100 dark:bg-zinc-900/20 rounded-full animate-pulse"></div>}>
      <FilterContent />
    </Suspense>
  );
}