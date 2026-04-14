import { Github, Twitter, Disc, Globe, UsersRound } from "lucide-react";

export default function Footer() {
  return (
<footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black/80 pt-16 pb-8">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
    
    {/* COL 1: PLATFORM */}
    <div>
      <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Platform</h3>
      <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
        <li><a href="/problems" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Browse Problems</a></li>
        <li><a href="/roadmap" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Roadmaps</a></li>
        <li><a href="/interview" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Interview Prep</a></li>
        <li><a href="/multiplayer" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Multiplayer <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded ml-1">BETA</span></a></li>
      </ul>
    </div>

    {/* COL 2: RESOURCES */}
    <div>
      <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Resources</h3>
      <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
        <li><a href="/resources/api-docs" className="hover:text-blue-600 dark:hover:text-blue-400 transition">API Documentation</a></li>
        <li><a href="/resources/changelog" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Changelog</a></li>
        <li><a href="/resources/system-status" className="hover:text-blue-600 dark:hover:text-blue-400 transition">System Status</a></li>
        <li><a href="/resources/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">FAQ & Help</a></li>
      </ul>
    </div>

    {/* COL 3: COMMUNITY */}
    <div>
      <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Community</h3>
      <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
        <li>
            <a href="https://discord.gg/GgRBW7Yw" target="_blank" className="flex items-center gap-2 hover:text-indigo-500 transition">
                <Disc size={16} /> Discord Server
            </a>
        </li>
        <li>
            <a href="https://github.com/rizalamrirozaqi" target="_blank" className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition">
                <Github size={16} /> GitHub
            </a>
        </li>
        <li>
            <a href="https://x.com/rizalamrirozaqi" target="_blank" className="flex items-center gap-2 hover:text-blue-400 transition">
                <Twitter size={16} /> Twitter / X
            </a>
        </li>
        <li>
          <a href="/clans" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            <UsersRound size={16} className="inline mr-2" /> Clans
          </a>
        </li>
      </ul>
    </div>

    {/* COL 4: LEGAL */}
    <div>
      <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Legal</h3>
      <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
        <li><a href="/legal/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</a></li>
        <li><a href="/legal/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms of Service</a></li>
        <li><a href="/legal/cookie" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Cookie Policy</a></li>
      </ul>
    </div>

  </div>

  {/* BOTTOM BAR */}
  <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-gray-400">
          © 2026 Quizu. All rights reserved.
      </p>
      <div className="flex gap-4">
          {/* Social Icons kecil di bawah kalo mau */}
      </div>
  </div>
</footer>
  );
}