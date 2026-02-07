"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Home" },
    { href: "/challenges", label: "Problems" },
    { href: "/interview", label: "Interview" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/clan", label: "Clans" },
    { href: "/ranking", label: "Ranking" },
    { href: "/multiplayer", label: "Multiplayer", badge: "BETA" },
  ];

  // 🔥 CLOSE JIKA KLIK DI LUAR MENU
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 rounded-xl hover:bg-zinc-800 transition"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* DESKTOP */}
      <div className="hidden md:flex items-center gap-1 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2
              ${
                isActive(link.href)
                  ? "bg-gray-100 text-black font-bold dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-black hover:bg-gray-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* MENU */}
          <div
            ref={menuRef}
            className="absolute top-16 right-4 w-[85%] max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-800 shadow-xl p-2 flex flex-col gap-1 z-50"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl flex justify-between items-center transition
                  ${
                    isActive(link.href)
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
              >
                {link.label}
                {link.badge && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
