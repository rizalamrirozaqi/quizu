"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Play, Loader2, Trophy, Frown, ArrowLeft } from "lucide-react";
import Confetti from "react-confetti";
import Link from "next/link";

export default function BattleRoom() {
  const { id } = useParams(); // Match ID
  const supabase = createClient();
  const router = useRouter();

  // State Data
  const [match, setMatch] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // State Editor & Game
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  
  // State UI
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // 1. Fetch Match Data & Challenge Details
  useEffect(() => {
    const init = async () => {
      // Set window size for confetti
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (id) {
        // Ambil data Match sekaligus data Challenge dan Profile Players
        const { data, error } = await supabase
          .from("matches")
          .select(`
            *, 
            challenge:challenges(*),
            player1:player1_id(username, avatar_url), 
            player2:player2_id(username, avatar_url)
          `)
          .eq("id", id)
          .single();
        
        if (data) {
          setMatch(data);
          setChallenge(data.challenge);
          // Set starter code kalau belum ada
          setCode(data.challenge.starter_code || "// Start coding!");
        }
      }
    };
    init();
  }, [id]);

  // 2. Realtime Subscription (Jantungnya Multiplayer)
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`match-room-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${id}` },
        (payload) => {
          // Setiap kali ada update di database (misal status berubah atau ada winner), state diupdate
          setMatch((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);


  // 3. Logic Submit Jawaban
  const handleSubmit = async () => {
    setIsRunning(true);
    setOutput("Running tests...");

    // Simulasi Cek Jawaban (Harusnya via Judge API)
    setTimeout(async () => {
      const isCorrect = true; // Anggap selalu benar buat demo

      if (isCorrect) {
        setOutput("Tests Passed! 🚀 Claiming victory...");
        
        // UPDATE DATABASE: Set Winner & Status Finished
        // Trigger ini akan otomatis terdeteksi oleh Realtime Listener di layar lawan
        const { error } = await supabase
          .from("matches")
          .update({ 
            winner_id: currentUser.id,
            status: 'finished'
          })
          .eq("id", match.id);
        
        if (error) console.error(error);
      } else {
        setOutput("Test Failed ❌. Try again!");
      }
      setIsRunning(false);
    }, 1500);
  };


  // LOADING STATE
  if (!match || !challenge || !currentUser) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-gray-500">Preparing Battle Arena...</p>
      </div>
    );
  }

  // GAME OVER STATE (Menang/Kalah)
  if (match.status === 'finished') {
    const isWinner = match.winner_id === currentUser.id;
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        {isWinner && <Confetti width={windowSize.width} height={windowSize.height} />}
        
        <div className="z-10 text-center vercel-card p-12 bg-[#111] border-gray-800">
          {isWinner ? (
            <>
              <Trophy size={80} className="mx-auto text-yellow-500 mb-6 animate-bounce" />
              <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                VICTORY!
              </h1>
              <p className="text-gray-400 mb-8">+25 ELO Gained</p>
            </>
          ) : (
            <>
              <Frown size={80} className="mx-auto text-red-500 mb-6" />
              <h1 className="text-5xl font-bold mb-2 text-gray-200">DEFEAT</h1>
              <p className="text-gray-400 mb-8">Opponent was faster.</p>
            </>
          )}
          
          <Link href="/multiplayer" className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition">
            Find New Match
          </Link>
        </div>
      </div>
    );
  }

  // WAITING STATE (Kalau player 2 belum masuk)
  if (match.status === 'waiting') {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 text-center px-4">
         <div className="animate-pulse w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Loader2 className="animate-spin" />
         </div>
         <h2 className="text-2xl font-bold">Waiting for Opponent...</h2>
         <p className="text-gray-500">Share ID: <code className="bg-gray-100 p-1 rounded">{match.id}</code></p>
      </div>
    );
  }

  // --- BATTLE ARENA UI (Main Game) ---
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)]">
      
      {/* 1. Header VS Bar */}
      <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--accents-1)]">
        <div className="flex items-center gap-4">
           <Link href="/multiplayer"><ArrowLeft size={18} className="text-gray-500 hover:text-black"/></Link>
           <span className="font-bold text-sm">Battle Mode ⚔️</span>
        </div>

        {/* Player Status Center */}
        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 px-4 py-1 rounded-full">
           <div className={`flex items-center gap-2 ${match.player1_id === currentUser.id ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              {match.player1?.username || "Player 1"}
           </div>
           <span className="text-xs font-mono text-gray-400">VS</span>
           <div className={`flex items-center gap-2 ${match.player2_id === currentUser.id ? 'font-bold text-red-600' : 'text-gray-500'}`}>
              {match.player2?.username || "Player 2"}
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
           </div>
        </div>

        <div className="text-xs font-mono text-gray-500">
           Time: --:--
        </div>
      </div>

      {/* 2. Main Workspace (Split View) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Problem */}
        <div className="w-full md:w-1/3 border-r border-[var(--border)] flex flex-col bg-[var(--background)]">
          <div className="p-4 border-b border-[var(--border)]">
             <h2 className="font-bold text-lg">{challenge.title}</h2>
             <span className="text-xs px-2 py-0.5 border rounded uppercase text-green-600 border-green-200 bg-green-50">{challenge.difficulty}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 prose prose-sm prose-invert max-w-none">
             <ReactMarkdown>{challenge.description}</ReactMarkdown>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="w-full md:w-2/3 flex flex-col bg-[#1e1e1e]">
           <div className="h-10 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4">
              <span className="text-xs text-gray-400">solution.js</span>
              <button 
                onClick={handleSubmit}
                disabled={isRunning}
                className="text-xs font-bold bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded flex items-center gap-2 transition disabled:opacity-50"
              >
                {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                SUBMIT TO WIN
              </button>
           </div>
           
           <div className="flex-1">
             <Editor 
                height="100%" 
                defaultLanguage="javascript" 
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
             />
           </div>

           {output && (
             <div className="h-32 bg-black border-t border-[#333] p-4 font-mono text-sm overflow-y-auto text-gray-300">
                <div className="text-xs text-gray-500 mb-1">Console Output:</div>
                {output}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}