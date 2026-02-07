import Link from "next/link";
import { Github, Twitter, Linkedin, Heart, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t transition-colors duration-300
      bg-white border-gray-200 
      dark:bg-black dark:border-zinc-800">
      
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-2">
            <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 flex items-center justify-center rounded-md font-mono text-sm font-bold shadow-sm transition-colors
                  bg-black text-white 
                  dark:bg-white dark:text-black">
                  Q
              </div>
              <span className="text-gray-900 dark:text-white">quizu.</span>
            </Link>
            <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
              Platform competitive programming masa depan. Asah logika, panjat leaderboard, dan bertarung dalam mode 1v1 Real-time.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
               {[Github, Twitter, Linkedin].map((Icon, i) => (
                 <a key={i} href="#" className="p-2 rounded-full transition-colors
                    bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black
                    dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white">
                    <Icon size={18} />
                 </a>
               ))}
            </div>
          </div>

          {/* LINKS COLUMN 1 */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
              <li><Link href="/challenges" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Problems</Link></li>
              <li><Link href="/roadmap" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Learning Path</Link></li>
              <li><Link href="/multiplayer" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Multiplayer <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-1">Beta</span></Link></li>
              <li><Link href="/ranking" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Leaderboard</Link></li>
            </ul>
          </div>

          {/* LINKS COLUMN 2 */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Community</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Discord Server</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contribute Question</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">API Docs</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-zinc-500">
          <p>© 2026 Quizu Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> by <span className="text-gray-900 dark:text-zinc-300 font-bold">Rizal Amri</span>
          </p>
        </div>
      </div>
    </footer>
  );
}