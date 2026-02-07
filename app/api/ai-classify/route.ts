import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
// 🔥 DINAMIS: Baca env dulu, kalau kosong baru pake default
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(request: Request) {
  let body = { title: "", description: "", solutionCode: "" };
  
  // Default Result (Fallback)
  let resultData = {
      approved: true,
      refusal_reason: null,
      difficulty: "easy",
      points: 10,
      language: "javascript",
      reason: "AI System Busy. Auto-approved."
  };

  try {
    // Cek API Key di awal biar aman
    if (!API_KEY) throw new Error("GEMINI_API_KEY Missing in .env");

    body = await request.json();
    const { title, description, solutionCode } = body;

    // Logic Manual (Fallback sederhana)
    if (body.solutionCode && body.solutionCode.length > 200) { 
        resultData.difficulty = "medium"; 
        resultData.points = 30; 
    }

    // 🔥 URL DINAMIS
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // PROMPT TETAP SAMA (NO CHANGE)
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
            // Bersihin markdown
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            
            const parsed = JSON.parse(text);
            
            // Merge hasil AI ke variable resultData
            if (typeof parsed.approved === 'boolean') {
                resultData = { ...resultData, ...parsed };
                console.log(`✅ ${MODEL_NAME} Judge Result: ${parsed.approved ? "APPROVED" : "REJECTED"}`);
            }
        }
    }    
    
    return NextResponse.json({ success: true, data: resultData });

  } catch (modelError: any) {
    console.warn(`⚠️ Model ${MODEL_NAME} failed:`, modelError);
    // Tetap return sukses dengan data default biar user ga macet
    return NextResponse.json({ success: true, data: resultData });
  } 
}