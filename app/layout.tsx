// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Font default Next.js yang mirip Vercel
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- 1. Import Navbar
import OnboardingModal from "@/components/OnboardingModal"; // Import
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizu - Master Coding Challenges",
  description: "Platform kompetisi koding multiplayer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let currentElo = 0;
  
  if (user) {
    const { data } = await supabase.from('profiles').select('elo').eq('id', user.id).single();
    currentElo = data?.elo || 0;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* <-- 2. Pasang di sini, di atas {children} */}
        <OnboardingModal user={user} currentElo={currentElo} />
        <div className="min-h-screen bg-[var(--background)]">
          {children}
        </div>
        <Footer /> {/* Pasang Footer di sini, di bawah {children} */}
      </body>
    </html>
  );
}