import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Trophy, PlusSquare, LogIn } from "lucide-react";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";

/* =========================
   MINIMAL PROFESSIONAL LOGO
   RESPONSIVE
========================= */
function QuizuLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Solid base */}
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
      {/* Cut-out Q */}
      <circle cx="12" cy="11" r="4" fill="black" />
      <rect x="14.5" y="14.5" width="3" height="1.6" rx="0.8" fill="black" />
    </svg>
  );
}

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: any = null;
  let avatarUrl: string | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;

    // avatar dari profile
    avatarUrl = profile?.avatar_url ?? null;

    // fallback provider (GOOGLE > GITHUB)
    if (!avatarUrl) {
      const identities = user.identities ?? [];
      const google = identities.find((i) => i.provider === "google");
      const github = identities.find((i) => i.provider === "github");

      avatarUrl =
        google?.identity_data?.avatar_url ??
        github?.identity_data?.avatar_url ??
        null;
    }
  }

  return (
    <nav
      className="
        sticky top-0 z-50
        backdrop-blur-md
        border-b
        bg-white/80 border-gray-200
        dark:bg-black/80 dark:border-zinc-800
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition text-gray-900 dark:text-white"
          >
            <QuizuLogo className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="font-medium tracking-tight text-sm sm:text-base">
              quizu
            </span>
          </Link>

          {/* NAV LINKS (HIDDEN ON MOBILE) */}
          <div className="flex">
            <NavLinks />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          {user && profile ? (
            <>
              {/* CREATE (DESKTOP ONLY) */}
              <Link
                href="/create"
                className="
                  hidden lg:flex items-center gap-2
                  px-3 py-1.5 rounded-md
                  text-xs font-medium
                  border
                  bg-white border-gray-200 text-gray-700
                  hover:bg-gray-50
                  dark:bg-transparent dark:border-zinc-800 dark:text-zinc-300
                  dark:hover:bg-zinc-900
                  transition
                "
              >
                <PlusSquare size={14} />
                Create
              </Link>

              {/* ELO */}
              <div
                className="
                  flex items-center gap-1.5
                  px-2.5 py-1 rounded-full
                  text-xs font-mono font-semibold
                  bg-zinc-100 border border-zinc-200 text-zinc-700
                  dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300
                "
              >
                <Trophy size={12} />
                {profile.elo ?? 0}
              </div>

              {/* USER MENU */}
              <UserMenu
                user={user}
                profile={{
                  ...profile,
                  avatar_url: avatarUrl,
                }}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="
                flex items-center gap-2
                px-3 sm:px-4 py-2
                rounded-md
                text-xs font-semibold
                bg-black text-white hover:bg-zinc-800
                dark:bg-white dark:text-black dark:hover:bg-zinc-200
                transition
              "
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
