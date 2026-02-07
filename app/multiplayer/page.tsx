"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Swords, Loader2, Users } from "lucide-react";

export default function MultiplayerPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [statusText, setStatusText] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const findMatch = async () => {
    setIsSearching(true);
    setStatusText("Checking user status...");

    // 1. Cek User Login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    setStatusText("Looking for opponents...");

    // 2. Cek apakah ada Room yang statusnya 'waiting' (dan bukan buatan sendiri)
    const { data: existingMatch } = await supabase
      .from("matches")
      .select("*")
      .eq("status", "waiting")
      .neq("player1_id", user.id) // Jangan join room sendiri
      .maybeSingle(); // Pakai maybeSingle biar gak error kalau kosong

    if (existingMatch) {
      // --> SKENARIO A: Ada lawan menunggu! Kita Join.
      setStatusText("Opponent found! Joining match...");
      
      const { error } = await supabase
        .from("matches")
        .update({ 
          player2_id: user.id, 
          status: "playing" 
        })
        .eq("id", existingMatch.id);

      if (!error) {
        // Redirect ke Battle Room
        router.push(`/multiplayer/${existingMatch.id}`);
      }

    } else {
      // --> SKENARIO B: Gak ada lawan. Kita Bikin Room Baru.
      setStatusText("Creating new lobby...");

      // Pilih soal random dulu dari DB buat match ini
      const { data: challenges } = await supabase.from("challenges").select("id");
      
      if (!challenges || challenges.length === 0) {
        alert("Belum ada soal di database!");
        setIsSearching(false);
        return;
      }
      
      // Acak soal
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

      // Insert Match Baru
      const { data: newMatch, error } = await supabase
        .from("matches")
        .insert({
          player1_id: user.id,
          challenge_id: randomChallenge.id,
          status: "waiting"
        })
        .select()
        .single();

      if (error) {
        alert("Error creating match");
        setIsSearching(false);
      } else {
        // Kita yang nunggu, redirect ke room match-nya
        router.push(`/multiplayer/${newMatch.id}`);
      }
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
        <Swords size={80} className="relative z-10 text-black dark:text-white" />
      </div>

      <h1 className="text-5xl font-bold tracking-tighter mb-4">1v1 Code Battle</h1>
      <p className="text-xl text-gray-500 mb-10 max-w-lg">
        Compete in real-time. The fastest correct submission wins +25 ELO.
      </p>

      {isSearching ? (
        <div className="vercel-card py-8 px-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
           <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
           <h3 className="text-xl font-bold mb-2">Matchmaking...</h3>
           <p className="text-gray-500 text-sm font-mono">{statusText}</p>
        </div>
      ) : (
        <button 
          onClick={findMatch}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-black px-8 font-medium text-white transition-all duration-300 hover:bg-neutral-800 hover:w-64 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <span className="mr-2 flex items-center gap-2">
            <Users size={18} /> Find Match
          </span>
          <div className="absolute right-0 translate-x-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:relative group-hover:opacity-100">
            →
          </div>
        </button>
      )}
    </div>
  );
}