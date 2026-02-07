"use client";

import { useState, useEffect, use } from "react"; 
import Editor from "@monaco-editor/react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Play, Lightbulb, CheckCircle2, XCircle, Settings, Moon, Sun, Terminal, Send, ArrowLeft, Trophy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"; // 🔥 Buat navigasi balik

export default function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); 
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil ID Roadmap dari URL (kalau user datang dari roadmap)
  // Contoh URL: /challenge/two-sum?roadmapId=123-abc
  const sourceRoadmapId = searchParams.get("roadmapId");

  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");

  const supabase = createClient();

  useEffect(() => {
    const fetchChallenge = async () => {
      const { data } = await supabase.from("challenges").select("*").eq("slug", slug).single();
      if (data) {
        setChallenge(data);
        setCode(data.starter_code || "// Write your code here...");
      }
    };
    fetchChallenge();
  }, [slug]);

  // --- FUNGSI UTAMA EXECUTE CODE (Panggil api/judge) ---
  const executeCode = async () => {
    setStatus("idle");
    setOutput("Compiling & Running...");
    
    try {
        // 🔥 FIX: Arahkan ke /api/judge (sesuai file tree Abang)
        const res = await fetch("/api/judge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code, 
                language: challenge.language,
                testCases: challenge.test_cases,
                functionName: challenge.function_name
            })
        });

        const data = await res.json();
        return data;

    } catch (e: any) {
        return { success: false, message: "Server Connection Error: " + e.message };
    }
  };

  // 1. TOMBOL RUN (Cuma Tes)
  const handleRun = async () => {
    setIsRunning(true);
    const result = await executeCode();
    
    if (result.success) {
        setStatus("success");
        setOutput("✅ " + result.message);
        toast.success("Code Passed! Ready to Submit.");
    } else {
        setStatus("error");
        setOutput("❌ " + result.message);
        toast.error("Test Failed.");
    }
    
    setIsRunning(false);
  };

  // 2. TOMBOL SUBMIT (Tes + Save + Modal)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Step A: Run Test dulu
    const result = await executeCode();

    if (!result.success) {
        setStatus("error");
        setOutput("❌ " + result.message);
        toast.error("Code failed tests. Cannot submit.");
        setIsSubmitting(false);
        return;
    }

    // Step B: Kalau Sukses, Save ke DB
    setStatus("success");
    setOutput("✅ Validation Passed! Saving submission...");
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && challenge) {
             await supabase.from("submissions").insert({
                 user_id: user.id,
                 challenge_id: challenge.id,
                 code: code,
                 status: "success",
                 language: challenge.language
             });
             
             confetti();
             setShowSuccessModal(true); // 🔥 Munculin Modal
        }
    } catch (err) {
        toast.error("Failed to save submission.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // 3. FUNGSI NAVIGASI BALIK (Dinamis)
  const handleBack = () => {
      if (sourceRoadmapId) {
          router.push(`/roadmap/${sourceRoadmapId}`); // Balik ke Roadmap spesifik
      } else {
          router.push("/challenges"); // Balik ke list problems biasa
      }
  };

  // ... (Fungsi AI Hint sama kayak sebelumnya) ...
  const askAI = async () => {
    setLoadingHint(true);
    setHint(null);
    try {
        const res = await fetch("/api/ai-hint", {
            method: "POST",
            body: JSON.stringify({ code, description: challenge.description, language: challenge.language })
        });
        const data = await res.json();
        if (data.success) setHint(data.hint);
        else setHint("AI error.");
    } catch (e) { setHint("Connection error."); }
    setLoadingHint(false);
  };

  if (!challenge) return <div className="flex h-screen items-center justify-center bg-white dark:bg-black"><Loader2 className="animate-spin text-black dark:text-white"/></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white transition-colors relative">
      
      {/* --- 🔥 SUCCESS MODAL OVERLAY --- */}
      {showSuccessModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-6 relative overflow-hidden">
                  
                  {/* Efek Glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 blur-3xl rounded-full pointer-events-none"></div>

                  <div className="relative">
                      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                          <Trophy size={32} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Challenge Solved!</h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                          Great job! You've earned <span className="text-yellow-500 font-bold">+10 Points</span>.
                      </p>
                  </div>

                  <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleBack}
                        className="w-full py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                      >
                          <ArrowLeft size={18} />
                          Back to {sourceRoadmapId ? "Map" : "List"}
                      </button>
                      
                      <button 
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition"
                      >
                          Stay Here
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- TOOLBAR --- */}
      <div className="h-12 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#111] flex items-center justify-between px-4">
         <div className="flex items-center gap-4">
             {/* Tombol Back di Header juga */}
             <button onClick={handleBack} className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500">
                 <ArrowLeft size={16} />
             </button>

             <h1 className="font-bold text-sm truncate max-w-[200px]">{challenge.title}</h1>
             <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold
                ${challenge.difficulty === 'easy' ? 'bg-green-100 text-green-700 border-green-200' : 
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  'bg-red-100 text-red-700 border-red-200'}`}>
                {challenge.difficulty}
             </span>
         </div>

         <div className="flex items-center gap-2">
             <button onClick={() => setEditorTheme(prev => prev === "vs-dark" ? "light" : "vs-dark")} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 transition text-gray-600 dark:text-gray-300">
                {editorTheme === 'vs-dark' ? <Sun size={14} /> : <Moon size={14} />}
             </button>

             <button onClick={askAI} disabled={loadingHint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700 dark:hover:bg-yellow-900/40 transition">
                {loadingHint ? <Loader2 size={12} className="animate-spin"/> : <Lightbulb size={12} />}
                {loadingHint ? "Thinking..." : "Get Hint"}
             </button>

             <button onClick={handleRun} disabled={isRunning || isSubmitting} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-gray-700 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 dark:text-white dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 transition">
                {isRunning ? <Loader2 size={12} className="animate-spin"/> : <Play size={12} />}
                Run
             </button>

             <button onClick={handleSubmit} disabled={isRunning || isSubmitting} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-green-600 rounded hover:bg-green-500 transition disabled:opacity-50">
                {isSubmitting ? <Loader2 size={12} className="animate-spin"/> : <Send size={12} />}
                Submit
             </button>
         </div>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
         {/* LEFT: DESC */}
         <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-[#0a0a0a]">
             <div className="flex-1 overflow-y-auto p-6">
                 <div className="prose prose-sm prose-stone dark:prose-invert max-w-none mb-8">
                     <ReactMarkdown>{challenge.description}</ReactMarkdown>
                 </div>
                 {/* Test Cases View */}
                 {challenge.test_cases && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                           <Terminal size={14} className="text-blue-500"/> Example Test Cases
                        </h3>
                        <div className="space-y-4">
                            {challenge.test_cases.slice(0, 3).map((tc: any, i: number) => (
                                <div key={i} className="p-3 rounded-lg border bg-gray-50 dark:bg-zinc-900/50 font-mono text-xs">
                                    <div className="mb-2"><span className="text-gray-500">Input:</span> {JSON.stringify(tc.input)}</div>
                                    <div><span className="text-gray-500">Output:</span> {JSON.stringify(tc.output)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
                 {hint && (
                     <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500">AI Hint:</p>
                        <p className="text-xs text-yellow-800 dark:text-yellow-200 italic">"{hint}"</p>
                     </div>
                 )}
             </div>
         </div>

         {/* RIGHT: EDITOR */}
         <div className="w-full md:w-2/3 flex flex-col relative h-full">
             <div className="flex-1 relative min-h-0">
                <Editor 
                    height="100%"
                    // 🔥 FIX: Mapping Language biar sesuai data Database vs Monaco ID
                    language={
                            // Kalau di DB 'python', pake 'python'. Kalau 'py', pake 'python'.
                            challenge.language === 'python' || challenge.language === 'py' ? 'python' : 
                            challenge.language === 'go' || challenge.language === 'golang' ? 'go' : 
                            challenge.language === 'tsx' || challenge.language === 'ts' || challenge.language === 'typescript' ? 'typescript' : 
                            challenge.language === 'html' ? 'html' : 
                            'javascript' // Default ke JS
                    }
                    theme={editorTheme}
                    value={code}
                    onChange={(val) => {
                        setCode(val || "");
                    }}
                    options={{ 
                        minimap: { enabled: false }, 
                        fontSize: 14, 
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true // Biar layout gak gepeng
                    }}
                />
             </div>

             {output && (
                 <div className={`h-40 flex-shrink-0 border-t border-gray-200 dark:border-zinc-800 p-4 font-mono text-xs overflow-y-auto
                    ${status === 'error' ? 'bg-red-50 dark:bg-red-900/10' : 
                      status === 'success' ? 'bg-green-50 dark:bg-green-900/10' : 
                      'bg-gray-50 dark:bg-[#111]'}`}>
                    
                    <div className="flex items-center gap-2 mb-2 sticky top-0">
                        {status === 'success' ? <CheckCircle2 size={14} className="text-green-500"/> : 
                         status === 'error' ? <XCircle size={14} className="text-red-500"/> : 
                         <Settings size={14} className="animate-spin text-gray-500"/>}
                        <span className="font-bold uppercase text-gray-500 dark:text-gray-400">
                            {isRunning ? "Running..." : "Execution Result"}
                        </span>
                    </div>
                    
                    <pre className={`whitespace-pre-wrap ${status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {output}
                    </pre>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
}