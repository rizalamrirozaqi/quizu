"use client";

import { useEffect, useState, use, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Shield, Users, Trophy, LogOut, UserPlus, Crown, Settings, Trash2, Save, Send, MessageSquare, MoreVertical, Hash } from "lucide-react";

export default function ClanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const router = useRouter();

  // Data State
  const [clan, setClan] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Chat State
  const [activeTab, setActiveTab] = useState<"overview" | "chat">("overview");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('clan-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clan_messages', filter: `clan_id=eq.${id}` }, (payload) => {
          if (payload.new.user_id !== currentUser?.id) {
             fetchNewMessage(payload.new.id);
          }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, [id, currentUser?.id]);

  // Auto Scroll saat buka tab chat / ada pesan baru
  useEffect(() => {
    if (activeTab === "chat" && chatContainerRef.current) {
        const container = chatContainerRef.current;
        setTimeout(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth"
            });
        }, 100);
    }
  }, [messages, activeTab]);

  const fetchData = async () => {
    const { data: clanData } = await supabase.from("clans").select("*").eq("id", id).single();
    if (clanData) {
        setClan(clanData);
        setFormData({ name: clanData.name, description: clanData.description || "" });
    }

    const { data: membersData } = await supabase.from("profiles").select("*").eq("clan_id", id).order("elo", { ascending: false });
    setMembers(membersData || []);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        setCurrentUser(user);
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setUserProfile(profile);
    }
    
    const { data: chatData } = await supabase
        .from("clan_messages")
        .select("*, profiles(username, avatar_url)")
        .eq("clan_id", id)
        .order("created_at", { ascending: false }) // 🔥 Ambil dari yang paling baru
        .limit(50);

        setMessages(chatData ? chatData.reverse() : []);
    setLoading(false);
  };

  const fetchNewMessage = async (msgId: string) => {
    const { data } = await supabase.from("clan_messages").select("*, profiles(username, avatar_url)").eq("id", msgId).single();
    if (data) setMessages((prev) => [...prev, data]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!currentUser) return alert("Please login first.");

    const content = newMessage;
    setNewMessage(""); // Optimistic clear

    // 1. Insert ke DB
    const { data, error } = await supabase
        .from("clan_messages")
        .insert({
            clan_id: id,
            user_id: currentUser.id,
            content: content
        })
        .select("*, profiles(username, avatar_url)"); 

    if (error) {
        console.error("🔥 SUPABASE ERROR:", error);
        alert(`Gagal Kirim: ${error.message}`);
        setNewMessage(content); 
    } else {
        // 2. Fix Array Handling
        const messageItem = Array.isArray(data) ? data[0] : data;

        if (messageItem) {
            setMessages((prev) => [...prev, messageItem]);
            
            // Scroll otomatis ke bawah
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: "smooth"
                    });
                }
            }, 100);
        }
    }
  };

  const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Logic Join/Leave/Update/Delete/Kick
  const handleUpdate = async () => { setProcessing(true); await supabase.from("clans").update(formData).eq("id", id); setClan({...clan, ...formData}); setIsEditMode(false); setProcessing(false); };
  const handleDeleteClan = async () => { if(confirm("Disband clan?")) { await supabase.from("clans").delete().eq("id", id); router.push("/clan"); } };
  const handleKick = async (mid: string) => { if(confirm("Kick?")) { await supabase.from("profiles").update({clan_id: null}).eq("id", mid); setMembers(members.filter(m=>m.id!==mid)); } };
  const handleJoin = async () => { setProcessing(true); const { error } = await supabase.from("profiles").update({ clan_id: id }).eq("id", currentUser.id); if(!error) window.location.reload(); setProcessing(false); };
  const handleLeave = async () => { if(confirm("Leave?")) { setProcessing(true); const { error } = await supabase.from("profiles").update({ clan_id: null }).eq("id", currentUser.id); if(!error) window.location.reload(); setProcessing(false); } };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-black"><Loader2 className="animate-spin text-black dark:text-white"/></div>;
  if (!clan) return <div className="h-screen flex items-center justify-center text-red-500">Clan Not Found</div>;

  const isMember = userProfile?.clan_id === clan.id;
  const isLeader = clan.leader_id === currentUser?.id;
  const totalElo = members.reduce((sum, m) => sum + (m.elo || 0), 0);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 pb-20">
      
      {/* --- HERO HEADER --- */}
      {activeTab === "overview" && (
        <div className="relative h-64 bg-zinc-900 overflow-hidden">
             {/* Abstract Grid Pattern */}
             <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` }}>
             </div>
             
             <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-black p-2 shadow-2xl">
                    <div className="w-full h-full rounded-2xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white text-4xl font-bold border border-gray-200 dark:border-zinc-800">
                        {clan.name.substring(0, 2).toUpperCase()}
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* --- TITLE & TABS --- */}
      <div className={`max-w-4xl mx-auto px-4 text-center ${activeTab === "overview" ? "mt-20" : "mt-6"}`}>
         {activeTab === "overview" && (
             <>
                <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{clan.name}</h1>
                <p className="text-gray-500 dark:text-zinc-400 max-w-lg mx-auto mb-6">{clan.description}</p>
             </>
         )}

         <div className="inline-flex p-1 bg-gray-200 dark:bg-zinc-900 rounded-lg mb-8">
            <button 
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "overview" ? "bg-white dark:bg-black text-black dark:text-white shadow-sm" : "text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-white"}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab("chat")}
                disabled={!isMember}
                className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "chat" ? "bg-white dark:bg-black text-black dark:text-white shadow-sm" : "text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50"}`}
            >
                <MessageSquare size={14}/> Discussion
            </button>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 md:px-4">
         
         {/* --- OVERVIEW TAB --- */}
         {activeTab === "overview" && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-xl text-center">
                        <div className="text-2xl font-bold tracking-tight mb-1">{totalElo}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total ELO</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-xl text-center">
                        <div className="text-2xl font-bold tracking-tight mb-1">{members.length} <span className="text-gray-400 text-lg">/ 50</span></div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Members</div>
                    </div>
                 </div>

                 <div className="mb-8 text-center">
                     {!isMember ? (
                        <button onClick={handleJoin} className="w-full md:w-auto px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-80 transition">Join Clan</button>
                     ) : (
                        <button onClick={handleLeave} className="text-red-500 text-sm font-bold hover:underline">Leave Clan</button>
                     )}
                 </div>

                 <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                    {members.map((member, i) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-gray-400 text-sm w-6">{i + 1}</span>
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                                    {member.avatar_url && <img src={member.avatar_url} className="w-full h-full object-cover"/>}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                                        {member.username}
                                        {member.id === clan.leader_id && <Crown size={12} className="text-yellow-500 fill-yellow-500"/>}
                                    </span>
                                </div>
                            </div>
                            <span className="font-mono text-sm font-bold text-gray-500">{member.elo}</span>
                        </div>
                    ))}
                 </div>
             </div>
         )}

         {/* --- CHAT TAB --- */}
         {activeTab === "chat" && (
             <div className="flex flex-col h-[600px] border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-black shadow-sm animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="h-14 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <Hash size={16} className="text-gray-400"/>
                        <span className="font-bold text-sm">general-chat</span>
                    </div>
                    <MoreVertical size={16} className="text-gray-400 cursor-pointer"/>
                </div>

                {/* Chat Area */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
                    {messages.map((msg) => {
                        const isMe = msg.user_id === currentUser?.id;
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-gray-200 dark:border-zinc-700">
                                    {msg.profiles?.avatar_url && <img src={msg.profiles.avatar_url} className="w-full h-full object-cover"/>}
                                </div>

                                <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-500">
                                            {isMe ? "You" : msg.profiles?.username}
                                        </span>
                                        <span className="text-[10px] text-gray-300 dark:text-zinc-600">
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                    
                                    <div className={`px-4 py-2 rounded-2xl text-sm border
                                        ${isMe 
                                            ? "bg-black text-white dark:bg-white dark:text-black border-transparent rounded-tr-none" 
                                            : "bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-gray-200 border-gray-200 dark:border-zinc-800 rounded-tl-none"}
                                    `}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message #general-chat..."
                            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition disabled:opacity-30"
                        >
                            <Send size={16} className="text-black dark:text-white"/>
                        </button>
                    </div>
                </form>
             </div>
         )}
      </div>
    </main>
  );
}