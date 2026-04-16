import { Suspense } from "react";
import HeroBackground from "@/components/home/HeroBackground"; 
import HeroSection from "@/components/home/HeroSection";
import RoadmapSection from "@/components/home/RoadmapSection";
import TrendingSection from "@/components/home/TrendingSection";

// Gunakan salah satu. Jika butuh data selalu real-time setiap detik, gunakan force-dynamic.
// Jika 60 detik cukup, hapus force-dynamic dan biarkan revalidate.
export const revalidate = 60;

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden bg-white dark:bg-black transition-colors duration-300">
      <HeroBackground />

      {/* Hero Section langsung di-render */}
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Hero...</div>}>
        <HeroSection />
      </Suspense>

      {/* Roadmap akan muncul setelah datanya siap, tanpa menahan Hero */}
      <Suspense fallback={<SectionSkeleton title="Learning Paths" />}>
        <RoadmapSection />
      </Suspense>

      {/* Trending juga me-load datanya sendiri secara paralel */}
      <Suspense fallback={<SectionSkeleton title="Trending Challenges" />}>
        <TrendingSection />
      </Suspense>
    </main>
  );
}

// Komponen Skeleton sederhana untuk loading state
function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 mb-24 relative z-10 animate-pulse">
      <h2 className="text-2xl font-bold mb-8 text-gray-300 dark:text-zinc-700">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-zinc-800/50 rounded-2xl"></div>
        ))}
      </div>
    </section>
  );
}