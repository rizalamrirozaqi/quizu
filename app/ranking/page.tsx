import { createClient } from "@/utils/supabase/server";
import { Trophy, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const supabase = await createClient();
  
  // 1. Ambil User Login
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Ambil Leaderboard
  const { data: players } = await supabase
    .from("profiles")
    .select("id, username, elo, trophies, avatar_url")
    .order("elo", { ascending: false })
    .limit(50);
    
  return (
    // 🔥 WRAPPER UTAMA ADAPTIVE
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex justify-center items-center gap-3 text-gray-900 dark:text-white">
            <Trophy className="text-yellow-500" size={40} /> Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-zinc-400">Top developers hall of fame.</p>
        </div>

        {/* TABEL CONTAINER */}
        <div className="overflow-hidden border rounded-xl shadow-sm
          bg-white border-gray-200 
          dark:bg-[#111] dark:border-zinc-800">
          
          <table className="w-full text-left text-sm">
            {/* THEAD ADAPTIVE */}
            <thead className="font-medium
              bg-gray-50 text-gray-500 border-b border-gray-200
              dark:bg-[#111] dark:text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 w-16 text-center">#</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4 text-right">Trophies</th>
                <th className="px-6 py-4 text-right">ELO Rating</th>
              </tr>
            </thead>
            
            {/* TBODY ADAPTIVE */}
            <tbody className="divide-y 
              bg-white divide-gray-100 
              dark:bg-[#0a0a0a] dark:divide-zinc-800">
              
              {players?.map((player, index) => {
                const isMe = user?.id === player.id;

                return (
                  <tr 
                    key={player.id} 
                    className={`transition-colors ${
                      isMe 
                        ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:hover:bg-blue-900/30" // Warna Spesial User (Adaptive)
                        : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a] border-l-4 border-transparent" // Hover biasa
                    }`}
                  >
                    {/* RANK NUMBER */}
                    <td className="px-6 py-4 text-center font-mono text-gray-400 dark:text-gray-500">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </td>

                    {/* PLAYER INFO */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border 
                          bg-gray-100 border-gray-200 
                          dark:bg-gray-800 dark:border-zinc-700">
                          {player.avatar_url ? (
                            <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover"/>
                          ) : (
                            <User size={14} className="text-gray-400" />
                          )}
                        </div>
                        <span className={`font-medium ${isMe ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                          {player.username || "Anonymous"} {isMe && "(You)"}
                        </span>
                      </div>
                    </td>

                    {/* TROPHIES */}
                    <td className="px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-500">
                      {player.trophies || 0} 🏆
                    </td>

                    {/* ELO RATING */}
                    <td className="px-6 py-4 text-right font-bold font-mono text-blue-600 dark:text-blue-500">
                      {player.elo}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}