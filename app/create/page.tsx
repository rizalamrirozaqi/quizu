"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react"; 
import { 
  Loader2, Sparkles, Save, ArrowLeft, Bot, 
  Eye, KeyRound, CheckCircle, XCircle 
} from "lucide-react"; 
import Link from "next/link";

export default function CreateChallengePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"starter" | "solution">("solution"); 

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    starter_code: "// Function shell for user", 
    solution_code: "// Full answer key for AI",
    test_cases: '[\n  {"input": [1], "output": 2}\n]',
    difficulty: "",
    points: 0,
    language: "javascript",
    
    // AI Status
    ai_approved: false,
    ai_refusal_reason: null as string | null
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUserId(user.id);
    };
    getUser();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(prev => ({
        ...prev, title: val, slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }));
  };

  useEffect(() => {
     let template = "";
     if (form.language === "javascript") template = "function solution(x) {\n  // Write code here\n}";
     if (form.language === "python") template = "def solution(x):\n    # Write code here\n    pass";
     if (form.language === "go") template = "func solution(x int) int {\n  // Write code here\n}";
     if (form.language === "java") template = "class Solution {\n    public int solution(int x) {\n        // Code here\n    }\n}";
     
     if (form.solution_code === "// Full answer key for AI") {
         setForm(prev => ({ ...prev, starter_code: template, solution_code: template }));
     }
  }, [form.language]);

  const handleAutoDetect = async () => {
    if (!form.description || form.solution_code.length < 10) {
      alert("⚠️ Isi Deskripsi & Solution Code dulu!");
      setActiveTab("solution");
      return;
    }

    setAnalyzing(true);
    setForm(prev => ({ ...prev, ai_approved: false, ai_refusal_reason: null }));

    try {
      const res = await fetch("/api/ai-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          solutionCode: form.solution_code,
        }),
      });

      const result = await res.json();
      if (result.success) {
        if (result.data.approved === true) {
             setForm(prev => ({
                ...prev,
                difficulty: result.data.difficulty,
                points: result.data.points,
                language: result.data.language,
                ai_approved: true,
                ai_refusal_reason: null
             }));
        } else {
             setForm(prev => ({
                ...prev,
                ai_approved: false,
                ai_refusal_reason: result.data.refusal_reason || "Code quality invalid."
             }));
             alert("⛔ DITOLAK AI:\n" + result.data.refusal_reason);
        }
      } 
    } catch (err) {
      alert("Gagal konek ke AI.");
    }
    setAnalyzing(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const parsedTests = JSON.parse(form.test_cases);
      const { error } = await supabase.from("challenges").insert({
        title: form.title,
        slug: form.slug,
        description: form.description,
        starter_code: form.starter_code,
        solution_code: form.solution_code,
        test_cases: parsedTests,
        difficulty: form.difficulty,
        points: form.points,
        language: form.language,
        function_name: "solution",
        creator_id: userId,
      });

      if (error) throw error;
      alert("🎉 Challenge Published!");
      router.push("/challenges");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    // 🔥 CONTAINER UTAMA ADAPTIVE (Gray di Light, Black di Dark)
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      {/* HEADER */}
      <header className="h-16 border-b bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 transition-colors">
        <div className="flex items-center gap-4">
          <Link href="/challenges" className="text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <span className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-zinc-500">Create Mode</span>
            <h1 className="font-bold text-lg leading-none">New Challenge</h1>
          </div>
          
          {/* BADGES (Tetap berwarna biar kontras) */}
          {form.ai_approved && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 ml-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase
                ${form.difficulty === 'easy' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                  form.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' : 
                  'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                {form.difficulty}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                {form.points} PTS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.ai_approved}
          className={`text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm
            ${form.ai_approved 
                ? "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" 
                : "bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
            }`}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {form.ai_approved ? "Publish Challenge" : "Waiting Approval"}
        </button>
      </header>

      {/* SPLIT SCREEN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* KIRI: FORM INPUT (Adaptive BG) */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 transition-colors">
           <div className="space-y-6 max-w-2xl mx-auto">
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Title</label>
                      <input 
                        className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none 
                        dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-0 text-sm"
                        value={form.title} onChange={handleTitleChange} placeholder="Ex: Two Sum"/>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Slug</label>
                      <input 
                        className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500 transition-all outline-none 
                        dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:border-white text-sm"
                        value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Ex: Two Sum"/>
                  </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Description</label>
                  <textarea 
                    className="w-full h-40 p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500 transition-all outline-none resize-none 
                    dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:border-white text-sm"
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Write problem description in Markdown..."/>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Test Cases (JSON)</label>
                  <textarea 
                    className="w-full h-32 p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-900 font-mono text-sm focus:border-purple-500 outline-none resize-none
                    dark:bg-black dark:border-zinc-700 dark:text-green-400 dark:focus:border-green-500"
                    value={form.test_cases} onChange={e => setForm({...form, test_cases: e.target.value})}/>
              </div>
              
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Language</label>
                  <select 
                     className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-900 outline-none focus:border-purple-500
                     dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:border-white text-sm"
                     value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
                     <option value="javascript">JavaScript</option>
                     <option value="python">Python</option>
                     <option value="go">Go</option>
                     <option value="java">Java</option>
                  </select>
              </div>

               {/* AI STATUS BOX (Adaptive Color) */}
               <div className={`p-4 rounded-xl border transition-all duration-300
                    ${form.ai_approved 
                        ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-500/30" 
                        : form.ai_refusal_reason 
                            ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-500/30"
                            : "bg-gray-100 border-gray-200 dark:bg-zinc-950 dark:border-zinc-800"
                    }`}>
                   
                   <div className="flex items-center gap-2 mb-2">
                      {form.ai_approved ? (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <CheckCircle size={18} /> 
                              <span className="font-bold text-xs">APPROVED BY AI</span>
                          </div>
                      ) : form.ai_refusal_reason ? (
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                              <XCircle size={18} /> 
                              <span className="font-bold text-xs">REJECTED</span>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                              <Bot size={18} /> 
                              <span className="font-bold text-xs">AI JUDGE</span>
                          </div>
                      )}
                   </div>

                   {form.ai_refusal_reason ? (
                     <p className="text-xs text-red-600 dark:text-red-300 italic">"{form.ai_refusal_reason}"</p>
                   ) : form.ai_approved ? (
                     <p className="text-xs text-green-700 dark:text-green-300">Code is valid and ready to publish.</p>
                   ) : (
                     <p className="text-xs text-gray-500 dark:text-zinc-500">Waiting for Auto-Detect...</p>
                   )}
               </div>
           </div>
        </div>

        {/* KANAN: DUAL EDITOR (Background menyesuaikan) */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-100 dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-zinc-800 transition-colors">
          
          {/* TAB SWITCHER */}
          <div className="h-12 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center px-4 gap-4">
             
             {/* Tab 1 */}
             <button 
                onClick={() => setActiveTab("solution")}
                className={`flex items-center gap-2 px-1 py-3 text-xs font-bold transition border-b-2 
                ${activeTab === "solution" 
                    ? "text-purple-600 border-purple-600 dark:text-green-400 dark:border-green-500" 
                    : "text-gray-400 border-transparent hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
             >
                <KeyRound size={14}/> 
                Full Solution (For AI)
             </button>

             {/* Tab 2 */}
             <button 
                onClick={() => setActiveTab("starter")}
                className={`flex items-center gap-2 px-1 py-3 text-xs font-bold transition border-b-2 
                ${activeTab === "starter" 
                    ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-500" 
                    : "text-gray-400 border-transparent hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
             >
                <Eye size={14}/> 
                User Starter (View)
             </button>

             <div className="ml-auto">
                <button
                  onClick={handleAutoDetect}
                  disabled={analyzing}
                  className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full flex items-center gap-2 transition disabled:opacity-50 shadow-md shadow-purple-500/20"
                >
                  {analyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Auto-Detect
                </button>
             </div>
          </div>

          {/* MONACO EDITOR */}
          <div className="flex-1 relative">
             <Editor
               height="100%"
               language={form.language === 'java' ? 'java' : form.language === 'python' ? 'python' : form.language === 'go' ? 'go' : 'javascript'}
               // 👇 THEME: Abang bisa ganti 'vs-dark' jadi 'light' kalo mau full light mode. 
               // Tapi biasanya coder lebih suka editor tetep gelap walau UI terang. 
               // Kalo mau otomatis: theme={document.documentElement.classList.contains('dark') ? "vs-dark" : "light"}
               theme="vs-dark" 
               value={activeTab === "solution" ? form.solution_code : form.starter_code}
               onChange={(val) => {
                   if (activeTab === "solution") setForm({ ...form, solution_code: val || "" });
                   else setForm({ ...form, starter_code: val || "" });
               }}
               options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }}
             />
             
             {/* Floating Badge (Adaptive) */}
             <div className={`absolute bottom-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full border pointer-events-none opacity-90 shadow-sm
                ${activeTab === "solution" 
                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/80 dark:text-green-300 dark:border-green-500/50" 
                    : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/80 dark:text-blue-300 dark:border-blue-500/50"}`}>
                Editing: {activeTab === "solution" ? "Admin Answer Key" : "User Template"}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}