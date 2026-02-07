import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 🔥 BARIS SAKTI: MATIKAN CACHE
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "standard";
  
  const supabase = await createClient();

  try {
    // Helper: Ambil random row dengan Fallback
    const fetchRandom = async (difficulty: string, count: number) => {
      // 1. Coba ambil ID (Case Insensitive)
      const { data: ids, error } = await supabase
        .from("challenges")
        .select("id")
        .ilike("difficulty", difficulty); 
      
      if (error || !ids || ids.length === 0) {
          console.log(`⚠️ DB Check: No questions found for ${difficulty}`);
          return [];
      }

      // 2. Shuffle & Pick
      const shuffled = ids.sort(() => 0.5 - Math.random());
      const selectedIds = shuffled.slice(0, count).map(x => x.id);

      // 3. Ambil detail
      const { data } = await supabase
        .from("challenges")
        .select("*")
        .in("id", selectedIds);
        
      return data || [];
    };

    let challenges: any[] = [];

    // --- LOGIC PEMILIHAN SOAL ---
    if (mode === "quick") {
       const easy = await fetchRandom("easy", 1);
       const medium = await fetchRandom("medium", 1);
       challenges = [...easy, ...medium].slice(0, 1);
    } 
    else if (mode === "hardcore") {
       const medium = await fetchRandom("medium", 1);
       const hard = await fetchRandom("hard", 1);
       challenges = [...medium, ...hard];
    } 
    else {
       // Standard
       const easy = await fetchRandom("easy", 1);
       const medium = await fetchRandom("medium", 1);
       challenges = [...easy, ...medium];
    }

    // 🔥 EMERGENCY DATA (Kalau DB masih error/kosong, pake ini biar ga loading terus)
    if (challenges.length === 0) {
        return NextResponse.json({ 
            success: true, 
            challenges: [{
                id: "emergency-1",
                title: "Emergency Dummy Question",
                description: "### Database Empty\nSepertinya database belum terhubung atau kosong. Cek Supabase Anda.",
                starter_code: "// Fix your database first :)",
                language: "javascript",
                difficulty: "easy"
            }]
        });
    }

    return NextResponse.json({ success: true, challenges });

  } catch (error: any) {
    console.error("API Critical Error:", error);
    // Kalau error, balikin JSON error biar frontend stop loading
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}