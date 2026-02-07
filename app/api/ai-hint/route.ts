import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
// 🔥 DINAMIS
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(request: Request) {
  try {
    if (!API_KEY) throw new Error("API Key Missing");

    const { code, description, language } = await request.json();

    // 🔥 URL DINAMIS
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    // PROMPT TETAP SAMA (NO CHANGE)
    const prompt = `
      You are a helpful Computer Science Tutor. 
      The student is stuck on this problem:
      "${description.slice(0, 300)}..."
      
      Here is their current code (${language}):
      "${code.slice(0, 1000)}"

      INSTRUCTION:
      1. Find the logical error or syntax error.
      2. DO NOT give the full solution code.
      3. Give a short, subtle HINT (max 2 sentences) to guide them.
      4. Be encouraging.
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const hint = data.candidates?.[0]?.content?.parts?.[0]?.text || "Keep trying! Check your logic.";

    return NextResponse.json({ success: true, hint });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}