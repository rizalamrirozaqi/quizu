"use client";

import React, { useEffect, useState, Suspense } from "react"; // Tambah Suspense
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, BrainCircuit, LineChart, Briefcase, ArrowRight, ThumbsUp, ThumbsDown, XCircle } from "lucide-react";

// Komponen pembungkus biar useSearchParams aman
function ResultContent() {
  const searchParams = useSearchParams();
  const timeSpentStr = searchParams.get("time") || "0";
  const questionCount = searchParams.get("count") || "0";
  const encodedData = searchParams.get("data"); // Data JSON dari AI ada di sini

  const [aiData, setAiData] = useState<any>(null);

  // Parse Data JSON Asli dari URL
  useEffect(() => {
    if (encodedData) {
       try {
         const decoded = decodeURIComponent(encodedData);
         const parsedData = JSON.parse(decoded);
         setAiData(parsedData);
       } catch (e) {
         console.error("Gagal parse data AI:", e);
         // Fallback kalau data rusak
         setAiData({
            overallScore: "?", summary: "Error loading results.",
            keyStrengths: [], keyWeaknesses: []
         });
       }
    }
  }, [encodedData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (!aiData) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-500"/></div>;

  // --- TAMPILAN HASIL ASLI (REAL AI) ---
  return (
    <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
       
       {/* Header Score */}
       <div className="bg-gradient-to-r from-blue-950 to-purple-950 p-8 text-center border-b border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] -z-10"/>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold mb-6">
             <CheckCircle2 size={14}/> AI ANALYSIS COMPLETE
          </div>
          
          <div className="flex flex-col items-center">
             <div className={`text-6xl font-extrabold mb-2 bg-clip-text text-transparent 
                ${aiData.overallScore.startsWith('A') ? "bg-gradient-to-r from-green-400 to-blue-500" : 
                  aiData.overallScore.startsWith('B') ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-red-400 to-pink-500"}`}>
                {aiData.overallScore}
             </div>
             <div className="text-sm font-bold text-zinc-400 tracking-wider uppercase mb-4">Overall Score</div>
          </div>
          <p className="text-zinc-300 italic max-w-lg mx-auto">"{aiData.summary}"</p>
       </div>

       {/* Stats Grid (Real Data) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border-b border-zinc-800">
          <div className="bg-zinc-900 p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition">
             <LineChart className="text-blue-400 mb-3" size={24}/>
             <div className="text-sm font-medium text-zinc-300 mb-1">Time Complexity</div>
             <div className="font-bold">{aiData.timeComplexityFeedback || "-"}</div>
          </div>
          <div className="bg-zinc-900 p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition">
             <BrainCircuit className="text-purple-400 mb-3" size={24}/>
             <div className="text-sm font-medium text-zinc-300 mb-1">Code Quality</div>
             <div className="font-bold">{aiData.codeQualityFeedback || "-"}</div>
          </div>
          <div className="bg-zinc-900 p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition">
             <Briefcase className="text-green-400 mb-3" size={24}/>
             <div className="text-sm font-medium text-zinc-300 mb-1">Est. Salary</div>
             <div className="font-bold text-green-400">{aiData.estimatedSalary || "-"}</div>
          </div>
       </div>

       {/* Feedback Detail Section */}
       <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                <ThumbsUp size={18}/> Key Strengths
             </h3>
             <ul className="space-y-3">
                {aiData.keyStrengths?.map((point: string, i: number) => (
                   <li key={i} className="flex gap-3 text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/>
                      {point}
                   </li>
                ))}
                {(!aiData.keyStrengths || aiData.keyStrengths.length === 0) && <li className="text-zinc-500 text-sm">No specific strengths detected.</li>}
             </ul>
          </div>
          
          {/* Weaknesses */}
          <div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                <ThumbsDown size={18}/> Areas for Improvement
             </h3>
             <ul className="space-y-3">
                {aiData.keyWeaknesses?.map((point: string, i: number) => (
                   <li key={i} className="flex gap-3 text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                      <XCircle size={16} className="text-red-500 shrink-0 mt-0.5"/>
                      {point}
                   </li>
                ))}
                 {(!aiData.keyWeaknesses || aiData.keyWeaknesses.length === 0) && <li className="text-zinc-500 text-sm">Good job! No major weaknesses found.</li>}
             </ul>
          </div>
       </div>

       {/* Footer Actions */}
       <div className="p-8 border-t border-zinc-800 bg-zinc-950 flex gap-4">
           <Link href="/" className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-center font-bold text-sm transition">
              Back to Home
           </Link>
           <Link href="/interview" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-center font-bold text-sm transition flex items-center justify-center gap-2">
              Start New Session <ArrowRight size={16}/>
           </Link>
       </div>

    </div>
  );
}

// Main Component (Wajib pakai Suspense di Next.js 13+ kalau pakai useSearchParams)
export default function InterviewResultPage() {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-white"><Loader2 className="animate-spin"/> Loading result...</div>}>
                <ResultContent />
            </Suspense>
        </main>
    )
}