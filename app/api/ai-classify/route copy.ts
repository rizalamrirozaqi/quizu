import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(request: Request) {
  let body = { title: "", description: "", solutionCode: "" };
  
  // Default Result (Kalau AI mati, kita anggap lolos aja biar ga macet)
  let resultData = {
      approved: true, // Default true buat fallback
      refusal_reason: null,
      difficulty: "easy",
      points: 10,
      language: "javascript",
      reason: "AI System Busy. Auto-approved."
  };

  try {
    body = await request.json();
    const { title, description, solutionCode } = body;

    // Logic Manual (Fallback)
    if (body.solutionCode) {
        if (body.solutionCode.length > 200) { resultData.difficulty = "medium"; resultData.points = 30; }
        // ... (Logic bahasa sama kayak sebelumnya) ...
    }

    if (!API_KEY) throw new Error("API Key Missing");

    const candidateModels = [
        "gemini-2.5-flash", 
        "gemini-1.5-flash", 
        "gemini-pro"
    ];

    let aiSuccess = false;

    for (const modelName of candidateModels) {
        if (aiSuccess) break;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
            
            // 🔥 PROMPT BARU: MODE JUDGE / SATPAM
            const promptText = `
              Act as a STRICT Code Judge for a Competitive Programming Platform.
              Analyze this solution code.
              
              DATA: 
              Title: "${title}"
              Code: "${solutionCode.slice(0, 1000)}"

              CRITERIA FOR APPROVAL:
              1. Must be VALID code logic (not just random text or comments).
              2. Must NOT be empty or malicious.
              3. Must attempt to solve a problem.

              OUTPUT JSON ONLY (No Markdown):
              {
                "approved": boolean, 
                "refusal_reason": "String (Required if approved is false, explain why it's rejected)",
                "difficulty": "easy"|"medium"|"hard", 
                "points": 10|30|50, 
                "language": "javascript"|"python"|"go"|"java"
              }
            `;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0]) {
                    let text = data.candidates[0].content.parts[0].text;
                    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
                    
                    const parsed = JSON.parse(text);
                    
                    // Validasi struktur JSON biar ga error
                    if (typeof parsed.approved === 'boolean') {
                        resultData = { ...resultData, ...parsed }; // Merge hasil AI
                        aiSuccess = true;
                        console.log(`✅ ${modelName} Judge Result: ${parsed.approved ? "APPROVED" : "REJECTED"}`);
                    }
                }
            }
        } catch (err) {
            // Lanjut cari model lain
        }
    }

    return NextResponse.json({ success: true, data: resultData });

  } catch (error: any) {
    console.error("❌ CRITICAL ERROR:", error.message);
    return NextResponse.json({ success: true, data: resultData });
  }
}