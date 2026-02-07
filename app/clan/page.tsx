import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Users, Shield, Plus, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Top Clans
  const { data: clans } = await supabase
    .from("clans")
    .select("*")
    .order("total_elo", { ascending: false })
    .limit(20);

  // 2. Cek User punya clan ga?
  let myClanId = null;
  if (user) {
     const { data: profile } = await supabase.from("profiles").select("clan_id").eq("id", user.id).single();
     myClanId = profile?.clan_id;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
         
         {/* HEADER */}
         <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
               <h1 className="text-4xl font-extrabold flex items-center gap-3">
                  <Shield className="text-blue-500 fill-blue-500/20" size={40}/> Clan Wars
               </h1>
               <p className="text-gray-500 dark:text-zinc-400 mt-2">Join forces, stack ELO, and dominate the server.</p>
            </div>

            {myClanId ? (
                <Link href={`/clan/${myClanId}`} className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
                   Go to My Clan
                </Link>
            ) : (
                <Link href="/clan/create" className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition flex items-center gap-2">
                   <Plus size={18}/> Create New Clan
                </Link>
            )}
         </div>

         {/* CLAN LIST GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clans?.map((clan, index) => (
               <Link href={`/clan/${clan.id}`} key={clan.id} className="group relative p-6 rounded-2xl border transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl
                  bg-white border-gray-200 hover:border-blue-400
                  dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:border-blue-500/50">
                  
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 dark:text-zinc-600 font-mono">
                     #{index + 1}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {clan.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                        <h3 className="font-bold text-lg group-hover:text-blue-500 transition-colors">{clan.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500 font-mono font-bold">
                           <Trophy size={12}/> {clan.total_elo} ELO
                        </div>
                     </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-6 h-10">
                     {clan.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4">
                     <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Users size={12}/> Members
                     </span>
                     <span className="text-xs font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-zinc-300">
                        View Details
                     </span>
                  </div>
               </Link>
            ))}

            {/* Empty State */}
            {(!clans || clans.length === 0) && (
               <div className="col-span-full py-20 text-center border border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl">
                  <Shield size={48} className="mx-auto text-gray-300 dark:text-zinc-700 mb-4"/>
                  <h3 className="font-bold text-gray-900 dark:text-white">No Clans Yet</h3>
                  <p className="text-sm text-gray-500">Be the first to create a legendary clan.</p>
               </div>
            )}
         </div>
      </div>
    </main>
  );
}