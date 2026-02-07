"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/challenges", label: "Problems" },
    { href: "/interview", label: "Interview" }, // 🔥 MENU BARU
    { href: "/roadmap", label: "Roadmap" },
    { href: "/clan", label: "Clans" },
    { href: "/ranking", label: "Ranking" },
    { href: "/multiplayer", label: "Multiplayer", badge: "BETA" },
  ];

  return (
    <div className="hidden md:flex items-center gap-1 text-sm font-medium">
      {links.map((link) => {
        // Logic Active: Home harus match persis, sisanya cek awalan
        const isActive = link.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2
              ${isActive 
                ? "bg-gray-100 text-black font-bold dark:bg-zinc-800 dark:text-white" 
                : "text-gray-500 hover:text-black hover:bg-gray-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50"
              }`}
          >
            {link.label}
            
            {/* Badge Beta Khusus Multiplayer */}
            {link.badge && (
               <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wide transition-colors
                 ${isActive 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                 {link.badge}
               </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}