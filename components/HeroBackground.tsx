"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-black"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' stroke='%23999999'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none
        bg-black/5 dark:bg-white/5"
        style={{
          transform: `translate(${pos.x - 350}px, ${pos.y - 350}px)`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-black" />
    </div>
  );
}
