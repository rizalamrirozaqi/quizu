import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
// 🔥 DINAMIS
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(request: Request) {
  try {
    // 0. Cek API Key
    if (!API_KEY) {
       console.error("⚠️ GEMINI_API_KEY belum disetting di .env.local");
       throw new Error("Missing API Key");
    }

    // 1. Terima data
    const body = await request.json();
    const { challenges, userAnswers, timeSpent } = body;

    if (!challenges || !userAnswers) {
        return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Rakit Prompt (SAMA PERSIS - NO CHANGE)
    let prompt = `You are a Senior Technical Interviewer at a FAANG company. 
    Assess the following candidate's code submissions for a timed interview (${Math.floor(timeSpent/60)} minutes taken).

    Here are the problems and the candidate's answers:\n`;

    challenges.forEach((c: any, i: number) => {
      prompt += `\n--- Problem ${i+1}: ${c.title} (${c.difficulty}) ---\nDESCRIPTION:\n${c.description}\n\nCANDIDATE'S CODE (${c.language}):\n${userAnswers[c.id] || "// No answer"}\n`;
    });

    prompt += `\n\n⚠️ CRITICAL INSTRUCTION: You MUST return ONLY a raw JSON object (no markdown formatting, no extra text, no \`\`\`json wrappers) with the following structure:
    {
      "overallScore": "string (e.g., A+, B, C-)",
      "summary": "string (max 2 sentences overall feedback)",
      "estimatedSalary": "string (e.g., $120k/yr - realistic based on performance)",
      "timeComplexityFeedback": "string (brief assessment of Big O)",
      "codeQualityFeedback": "string (brief assessment of readability/cleanliness)",
      "keyStrengths": ["bullet point string", "bullet point string"],
      "keyWeaknesses": ["bullet point string", "bullet point string"]
    }`;

    // 3. Panggil API GEMINI (DINAMIS)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ text: prompt }] 
            }],
            generationConfig: {
                temperature: 0.3, 
                responseMimeType: "application/json" // Fitur JSON Mode
            }
        })
    });

    if (!geminiResponse.ok) {
        const errData = await geminiResponse.text();
        throw new Error(`Gemini API Error: ${geminiResponse.status} - ${errData}`);
    }

    const aiData = await geminiResponse.json();
    
    // Ambil teks hasil
    let rawContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) throw new Error("No response text from Gemini");

    // Bersihin Markdown
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse ke JSON Object
    const analysisResult = JSON.parse(rawContent);

    // 4. Kirim balik
    return NextResponse.json({ success: true, data: analysisResult });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    
    // Fallback Data
    const fallbackData = {
        overallScore: "N/A",
        summary: "AI service unavailable. Please check server logs.",
        estimatedSalary: "-",
        timeComplexityFeedback: "Error analyzing.",
        codeQualityFeedback: "Error analyzing.",
        keyStrengths: [],
        keyWeaknesses: []
    };
    return NextResponse.json({ success: false, data: fallbackData, error: error.message });
  }
}