"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Save, User, Shuffle, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username || "");
        setAvatarUrl(profile.avatar_url || "");
        setBio(profile.bio || ""); // Pastikan kolom 'bio' ada di DB, kalau error nanti kita tambah
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  // Generate Random Avatar (DiceBear)
  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    // Pake style 'notionists' biar estetik
    setAvatarUrl(`https://api.dicebear.com/9.x/notionists/svg?seed=${randomSeed}`);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        avatar_url: avatarUrl,
        // bio: bio, // Uncomment kalau kolom bio sudah dibuat di DB
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      router.refresh(); // Refresh biar navbar update
      router.push("/profile"); // Balik ke profile
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-white dark:bg-black"><Loader2 className="animate-spin text-gray-500"/></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
           <div>
              <Link href="/profile" className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 mb-2 transition">
                 <ArrowLeft size={14}/> Back to Profile
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
              <p className="text-gray-500 dark:text-zinc-400">Manage your account profile and appearance.</p>
           </div>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
           
           {/* 1. AVATAR SECTION */}
           <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                 <div className="w-24 h-24 rounded-full border-2 border-gray-100 dark:border-zinc-700 overflow-hidden bg-gray-50 dark:bg-zinc-800">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={32}/>
                        </div>
                    )}
                 </div>
                 {/* Overlay Edit Icon */}
                 <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-not-allowed">
                     <Camera className="text-white" size={20}/>
                 </div>
              </div>

              <div className="flex-1 w-full text-center md:text-left">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Avatar URL</label>
                  <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                     />
                     <button 
                        onClick={generateRandomAvatar}
                        className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                        title="Generate Random Avatar"
                     >
                        <Shuffle size={18}/>
                     </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                      Pro Tip: Use <a href="https://dicebear.com" target="_blank" className="underline hover:text-blue-500">DiceBear</a> for cool avatars.
                  </p>
              </div>
           </div>

           <div className="space-y-6">
              {/* 2. USERNAME */}
              <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Username</label>
                 <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                 />
              </div>

              {/* 3. EMAIL (Read Only) */}
              <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                 <input 
                    type="text" 
                    value={user?.email}
                    disabled
                    className="w-full bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                 />
              </div>
              
              {/* 4. BIO (Optional) */}
              <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Bio</label>
                 <textarea 
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                 />
              </div>
           </div>

           {/* ACTIONS */}
           <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
               <Link href="/profile" className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition">
                  Cancel
               </Link>
               <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
               >
                  {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                  Save Changes
               </button>
           </div>
        </div>
      </div>
    </div>
  );
}