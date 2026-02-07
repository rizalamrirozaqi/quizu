"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Shield, ArrowRight, Type, AlignLeft } from "lucide-react";

export default function CreateClanPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Auto-generate slug dari nama
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please login first!");
        router.push("/login");
        return;
    }

    try {
        // 1. Insert Clan Baru
        const { data: clan, error: clanError } = await supabase
            .from("clans")
            .insert({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                leader_id: user.id,
                total_elo: 0 // Awalnya 0
            })
            .select()
            .single();

        if (clanError) throw clanError;

        // 2. Update Profile User (Otomatis Join sebagai member)
        const { error: profileError } = await supabase
            .from("profiles")
            .update({ clan_id: clan.id })
            .eq("id", user.id);

        if (profileError) throw profileError;

        // 3. Redirect ke Halaman Clan
        router.refresh();
        router.push(`/clan/${clan.id}`);

    } catch (error: any) {
        alert("Error creating clan: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors">
      <div className="max-w-md w-full">
        
        {/* HEADER */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
                <Shield size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Establish Your Clan</h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-2">Gather your team, compete in wars, and dominate the ranking.</p>
        </div>

        {/* FORM CARD */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
            <div className="space-y-6">
                
                {/* 1. CLAN NAME */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                        <Shield size={12}/> Clan Name
                    </label>
                    <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="e.g. Amikom Cyber Squad"
                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition font-bold"
                    />
                </div>

                {/* 2. CLAN SLUG (Read Only) */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                        <Type size={12}/> Clan ID (Unique)
                    </label>
                    <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-400 text-sm font-mono">
                        quizu.com/clan/
                        <span className="text-gray-900 dark:text-white font-bold ml-1">{formData.slug || "..."}</span>
                    </div>
                </div>

                {/* 3. DESCRIPTION */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                        <AlignLeft size={12}/> Description
                    </label>
                    <textarea 
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="What is your clan about?"
                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading || !formData.name}
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin"/> : <ArrowRight size={18}/>}
                    Create Clan Now
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}