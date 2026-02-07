"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

// KODE TS (Sama kayak sebelumnya)
const CODE_SNIPPET = `interface UserResult {
  id: string;
  role: "ADMIN" | "MEMBER";
}

async function getUser(id: string): Promise<UserResult> {
  const data = await db.users.findUnique({ where: { id } });
  
  if (!data) throw new Error("User not found");
  return { id: data.id, role: data.role };
}`;

export default function AnimatedCode() {
  const [displayedText, setDisplayedText] = useState("");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < CODE_SNIPPET.length) {
          index++;
          return CODE_SNIPPET.slice(0, index);
        }
        return prev; 
      });
      if (index >= CODE_SNIPPET.length + 80) { 
        index = 0;
        setDisplayedText("");
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / rect.width) * 15;
    const rotateX = ((y - rect.height / 2) / rect.height) * -15;
    setRotation({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      className="relative w-full max-w-xl mx-auto perspective-1000 py-10 lg:py-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
    >
      <div 
        ref={containerRef}
        className="relative group transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 transform translate-z-[-20px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

        {/* CONTAINER EDITOR (Tetap Dark biar keren) */}
        <div className="animate-border-glow relative bg-[#09090b] rounded-xl overflow-hidden shadow-2xl min-h-[280px] border border-gray-200 dark:border-white/5">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="ml-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                 <Terminal size={10} /> user.service.ts
              </div>
            </div>
            <div className="text-zinc-600"><Copy size={12} /></div>
          </div>

          {/* Code Area */}
          <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-hidden text-zinc-300">
            <pre className="whitespace-pre-wrap relative z-10 font-medium">
              <code dangerouslySetInnerHTML={{ 
                  __html: highlightSyntax(displayedText) 
              }} />
              <span className="cursor-blink ml-1"></span>
            </pre>
          </div>
          
          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 py-1 px-4 bg-[#09090b] border-t border-white/5 flex justify-between text-[10px] text-zinc-600 font-mono">
              <div className="flex gap-3">
               <span>Ln 8, Col 2</span>
               <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                 <Check size={10}/> 0 Errors
              </div>
          </div>
        </div>

        {/* Floating Badge (Adaptive) */}
        <div 
           className="absolute -right-6 top-16 p-3 rounded-lg shadow-xl flex items-center gap-3 transform translate-z-[40px]
           bg-white border border-gray-200 
           dark:bg-[#1e1e1e] dark:border-blue-500/30"
           style={{ transform: `translateX(${rotation.y * -1.5}px) translateY(${rotation.x * -1.5}px) translateZ(40px)` }}
        >
           <div className="text-right">
              <div className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-bold">Latency</div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">12ms</div>
           </div>
           <div className="w-1 h-8 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function highlightSyntax(code: string) {
  const tokens = code.split(/(".*?"|[a-zA-Z0-9_]+|[{}():;,.<>=+-\[\]|\s])/g).filter(Boolean);
  return tokens.map((token, i) => {
    if (/^(interface|async|function|const|await|return|if|throw|new|try|catch)$/.test(token)) return `<span style="color:#c084fc">${token}</span>`;
    if (/^(Promise|string|UserResult|Error|void|any|number|boolean)$/.test(token)) return `<span style="color:#fb923c">${token}</span>`;
    if (/^(getUser|findUnique|users|id|role|where|db|data|ADMIN|MEMBER)$/.test(token)) return `<span style="color:#60a5fa">${token}</span>`;
    if (/^".*"$/.test(token)) return `<span style="color:#4ade80">${token}</span>`;
    if (/^[{}():;,.<>=+-\[\]|]$/.test(token)) return `<span style="color:#facc15">${token}</span>`;
    return token;
  }).join('');
}