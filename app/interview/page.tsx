"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Briefcase, Clock, Zap, ArrowRight, BrainCircuit, CheckCircle2 } from "lucide-react";

export default function InterviewLobbyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* HERO SECTION */}
      <div className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-6">
           <BrainCircuit size={14}/> AI-Powered Assessment
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ace the Interview?</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Simulate real technical interviews. Solve algorithmic problems under time pressure and get instant AI feedback on your code quality.
        </p>
      </div>

      {/* MODE SELECTION */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* CARD 1: QUICK */}
           <div className="group relative p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 hover:border-blue-500 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                 <Zap size={24}/>
              </div>
              <h3 className="text-2xl font-bold mb-2">Quick Drill</h3>
              <p className="text-sm text-gray-500 mb-6">Perfect for a quick warm-up before your day starts.</p>
              
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-green-500"/> 1 Random Problem
                 </li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="text-gray-400"/> 15 Minutes Limit
                 </li>
              </ul>

              <Link href="/interview/session?mode=quick" className="block w-full py-3 rounded-xl bg-white dark:bg-zinc-800 text-center font-bold border border-gray-200 dark:border-zinc-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition">
                 Start Quick
              </Link>
           </div>

           {/* CARD 2: STANDARD (POPULAR) */}
           <div className="relative p-8 rounded-3xl border-2 border-blue-500 bg-white dark:bg-zinc-900 shadow-2xl shadow-blue-500/10 transform scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                 RECOMMENDED
              </div>

              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                 <Briefcase size={24}/>
              </div>
              <h3 className="text-2xl font-bold mb-2">Standard</h3>
              <p className="text-sm text-gray-500 mb-6">The classic technical interview experience.</p>
              
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-blue-500"/> 2 Problems (Easy + Med)
                 </li>
                 <li className="flex items-center gap-2 text-sm font-medium">
                    <Clock size={16} className="text-gray-400"/> 45 Minutes Limit
                 </li>
              </ul>

              <Link href="/interview/session?mode=standard" className="block w-full py-3 rounded-xl bg-blue-600 text-white text-center font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/25">
                 Start Interview
              </Link>
           </div>

           {/* CARD 3: HARDCORE */}
           <div className="group relative p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 hover:border-purple-500 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                 <BrainCircuit size={24}/>
              </div>
              <h3 className="text-2xl font-bold mb-2">Hardcore</h3>
              <p className="text-sm text-gray-500 mb-6">Push your limits with complex system logic.</p>
              
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-purple-500"/> 2 Problems (Med + Hard)
                 </li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="text-gray-400"/> 60 Minutes Limit
                 </li>
              </ul>

              <Link href="/interview/session?mode=hardcore" className="block w-full py-3 rounded-xl bg-white dark:bg-zinc-800 text-center font-bold border border-gray-200 dark:border-zinc-700 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition">
                 Start Hardcore
              </Link>
           </div>

        </div>
      </div>
    </main>
  );
}