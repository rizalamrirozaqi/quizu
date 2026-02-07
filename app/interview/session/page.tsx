"use client";

import { useEffect, useState, use, useRef } from "react"; // Tambah useRef
import { useRouter, useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Loader2, Clock, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, Maximize2 } from "lucide-react";

// Tipe Data Soal
type Challenge = {
  id: string;
  title: string;
  description: string;
  starter_code: string;
  language: string;
};

export default function InterviewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "standard";

  // State Data
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Simpan jawaban per soal ID
  
  // State UI
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // Default 45 menit
  const [isTabActive, setIsTabActive] = useState(true);
  const [warnings, setWarnings] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

// 1. FETCH SOAL (DENGAN BAN SEREP "NERAKA")
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
          // Coba panggil API
          const res = await fetch(`/api/interview/start?mode=${mode}`, { cache: 'no-store' });
          
          if (!res.ok) throw new Error(`API Error: ${res.status}`);
          
          const data = await res.json();
          if (data.success && data.challenges.length > 0) {
             setupSession(data.challenges);
          } else {
             throw new Error("Data kosong dari server");
          }

      } catch (err) {
          console.error("⚠️ Server Error, Menggunakan SOAL CADANGAN (Offline Mode)", err);
          
          // 🔥 BAN SEREP: SOAL LEVEL SENIOR ENGINEER
          // Dipakai kalau API 404 / Error
          const hardcoreBackups = [
             {
                id: "backup-hard-1",
                title: "Trapping Rain Water (Offline Mode)",
                difficulty: "hard",
                description: "### Problem (Server Offline)\nGiven `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n**Example:**\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n\n**Constraint:** `O(n)` time complexity required.",
                starter_code: "function trap(height) {\n  // Logic 'Two Pointers' biasanya dipakai disini\n  \n}",
                language: "javascript"
             },
             {
                id: "backup-hard-2",
                title: "Design LRU Cache (Offline Mode)",
                difficulty: "medium",
                description: "### System Design (Server Offline)\nDesign a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(capacity)` Initialize with positive size capacity.\n- `get(key)` Return value if exists, otherwise -1.\n- `put(key, value)` Update value if exists. If not, add key-value pair. If capacity exceeded, **evict the least recently used key**.\n\n**Requirement:** `get` and `put` must run in `O(1)` average time complexity.",
                starter_code: "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n\n  get(key) {\n    // Implementation here\n  }\n\n  put(key, value) {\n    // Implementation here\n  }\n}",
                language: "javascript"
             }
          ];
          setupSession(hardcoreBackups);
      } finally {
          setLoading(false);
      }
    };

    // Helper Setup
    const setupSession = (questions: any[]) => {
        setChallenges(questions);
        
        // Timer Logic
        if (mode === "quick") setTimeLeft(15 * 60);
        else if (mode === "hardcore") setTimeLeft(60 * 60);
        else setTimeLeft(45 * 60);

        // Init Jawaban
        const initialAnswers: Record<string, string> = {};
        questions.forEach((c: any) => {
            initialAnswers[c.id] = c.starter_code || "// Code here";
        });
        setAnswers(initialAnswers);
    };

    initSession();
  }, [mode]);

  // 2. TIMER LOGIC
  useEffect(() => {
    if (!hasStarted) return;
    if (timeLeft <= 0) {
        finishInterview();
        return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft]);

  // 3. ANTI-CHEAT (Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
       if (document.hidden) {
          setWarnings(prev => prev + 1);
          setIsTabActive(false);
       } else {
          setIsTabActive(true);
       }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Format Waktu (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    // Request Fullscreen
    document.documentElement.requestFullscreen().catch((e) => {
        console.log("Fullscreen denied", e);
    });
    setHasStarted(true);
  };

// FUNGSI FINISH INTERVIEW YANG BARU (REAL AI)
  const finishInterview = async () => {
    if (isAnalyzing) return; // Cegah double click

    // 1. Keluar Fullscreen & Stop Timer
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
    }
    setHasStarted(false); // Stop timer di background

    // 2. Hitung Waktu
    let totalDuration = 45 * 60;
    if (mode === "quick") totalDuration = 15 * 60;
    else if (mode === "hardcore") totalDuration = 60 * 60;
    const timeSpent = totalDuration - timeLeft;
    const questionCount = challenges.length;

    // 3. Mulai Analisa AI
    setIsAnalyzing(true);

    try {
       // Kirim data ke API Backend kita
       const res = await fetch('/api/interview/analyze', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               challenges: challenges,
               userAnswers: answers,
               timeSpent: timeSpent
           })
       });

       const responseJson = await res.json();
       const aiResult = responseJson.data; // Ini data JSON asli dari AI

       // 4. Redirect ke Result Page membawa DATA ASLI
       // Kita serialize objek JSON jadi string biar masuk URL (Cara cepat)
       // *Catatan: Untuk produksi, lebih baik simpan ke DB lalu kirim ID-nya. Tapi ini cukup untuk sekarang.
       const encodedResult = encodeURIComponent(JSON.stringify(aiResult));
       router.push(`/interview/result?time=${timeSpent}&count=${questionCount}&data=${encodedResult}`);

    } catch (error) {
       console.error("Gagal menganalisa:", error);
       alert("Gagal menghubungi AI. Mengalihkan ke hasil manual.");
       router.push(`/interview/result?time=${timeSpent}&count=${questionCount}`);
    } finally {
       setIsAnalyzing(false);
    }
  };

  // Update Codingan di State
  const handleCodeChange = (value: string | undefined) => {
     const currentId = challenges[currentIndex]?.id;
     if (currentId) {
        setAnswers(prev => ({ ...prev, [currentId]: value || "" }));
     }
  };

  if (loading || isAnalyzing) {
     return (
       <div className="h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
         <Loader2 className="animate-spin text-blue-500" size={40}/>
         {isAnalyzing && <p className="text-zinc-400 animate-pulse">AI is reviewing your code... This may take a minute.</p>}
       </div>
     );
  }
  // --- LAYAR PERSIAPAN (START SCREEN) ---
  if (!hasStarted) {
     return (
        <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4 text-center">
            <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                <Maximize2 size={40} />
            </div>
            <h1 className="text-4xl font-extrabold mb-4">Interview Session Ready</h1>
            <p className="text-zinc-400 max-w-md mb-8">
               You are about to start the <strong>{mode.toUpperCase()}</strong> session. 
               Please enable Fullscreen and do not switch tabs.
            </p>
            <ul className="text-left bg-zinc-900 p-6 rounded-xl mb-8 space-y-3 text-sm text-zinc-300 border border-zinc-800">
               <li className="flex gap-3"><Clock size={18} className="text-blue-500"/> Duration: {formatTime(timeLeft)}</li>
               <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500"/> Questions: {challenges.length} Problems</li>
               <li className="flex gap-3"><AlertTriangle size={18} className="text-yellow-500"/> Warning: Tab Switching is monitored</li>
            </ul>
            <button onClick={handleStart} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition shadow-lg shadow-blue-600/20">
               Start Interview Now
            </button>
        </div>
     );
  }

  // --- LAYAR UTAMA INTERVIEW ---
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      
      {/* WARNING OVERLAY (Kalau pindah tab) */}
      {!isTabActive && (
          <div className="absolute inset-0 z-50 bg-red-900/90 backdrop-blur-md flex items-center justify-center text-center p-8">
              <div>
                 <AlertTriangle size={64} className="mx-auto mb-4 text-white"/>
                 <h2 className="text-3xl font-bold mb-2">Focus on the Interview!</h2>
                 <p className="text-xl">You have left the window {warnings} times.</p>
                 <p className="text-sm mt-4 opacity-70">Click anywhere to resume.</p>
              </div>
          </div>
      )}

      {/* TOP BAR */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
              <span className="font-bold text-lg">Interview Mode</span>
              <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-mono text-zinc-400 border border-zinc-700">
                 Problem {currentIndex + 1} of {challenges.length}
              </div>
          </div>

          <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-blue-400"}`}>
              {formatTime(timeLeft)}
          </div>

          <button onClick={finishInterview} disabled={isAnalyzing} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition disabled:opacity-50">
            {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : "Finish Session"}
          </button>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: SOAL */}
          <div className="w-1/3 border-r border-zinc-800 bg-zinc-950 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4 text-white no-underline">{challenges[currentIndex]?.title}</h2>
                  <ReactMarkdown>{challenges[currentIndex]?.description}</ReactMarkdown>
              </div>
              
              {/* NAVIGASI SOAL */}
              <div className="p-4 border-t border-zinc-800 flex justify-between bg-zinc-900">
                  <button 
                     disabled={currentIndex === 0}
                     onClick={() => setCurrentIndex(prev => prev - 1)}
                     className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-sm font-bold flex items-center gap-2 transition"
                  >
                     <ChevronLeft size={16}/> Prev
                  </button>
                  <button 
                     disabled={currentIndex === challenges.length - 1}
                     onClick={() => setCurrentIndex(prev => prev + 1)}
                     className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 transition"
                  >
                     Next <ChevronRight size={16}/>
                  </button>
              </div>
          </div>

          {/* RIGHT: EDITOR */}
          <div className="w-2/3 bg-[#1e1e1e]">
              <Editor 
                 height="100%"
                 theme="vs-dark"
                 language={challenges[currentIndex]?.language || "javascript"}
                 value={answers[challenges[currentIndex]?.id] || ""}
                 onChange={handleCodeChange}
                 options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 20 }
                 }}
              />
          </div>
      </div>
    </div>
  );
}