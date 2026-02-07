import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code, language, testCases, functionName } = await request.json();

    // Normalisasi Bahasa
    let lang = language.toLowerCase();
    if (lang.includes("node")) lang = "javascript";
    if (lang.includes("ts") || lang.includes("type")) lang = "typescript";
    if (lang.includes("py")) lang = "python";
    if (lang.includes("go")) lang = "go";
    if (lang.includes("html")) lang = "html"; // Tambahan

    // --- KHUSUS HTML (Validasi String Manual) ---
    if (lang === "html") {
        // Logika: Cek apakah tag yang diminta ada di dalam string code user
        // Format TestCase HTML kita di DB: { input: "check_tags", output: "header,nav,main,footer" }
        
        const requiredTags = testCases[0]?.output?.split(",") || []; // ["header", "nav", ...]
        const codeLower = code.toLowerCase();
        let missingTags: string[] = [];

        requiredTags.forEach((tag: string) => {
            const cleanTag = tag.trim();
            // Cek keberadaan tag, misal <header atau <header>
            if (!codeLower.includes(`<${cleanTag}`)) {
                missingTags.push(`<${cleanTag}>`);
            }
        });

        if (missingTags.length === 0) {
            return NextResponse.json({ success: true, message: "PASSED_ALL" });
        } else {
            return NextResponse.json({ 
                success: false, 
                message: `❌ Missing Semantic Tags:\nUser code does not contain: ${missingTags.join(", ")}` 
            });
        }
    }

    // --- BAHASA PEMROGRAMAN (JS, PY, GO) KIRIM KE PISTON ---
    let fullCode = "";
    let version = "18.15.0"; 

    if (lang === "javascript" || lang === "typescript") {
        version = lang === "typescript" ? "5.0.3" : "18.15.0";
        fullCode = `${code}\n\n`;
        fullCode += `
          const testCases = ${JSON.stringify(testCases)};
          try {
              let allPassed = true;
              let failedMsg = "";
              testCases.forEach((tc, i) => {
                const inputArgs = Array.isArray(tc.input) ? tc.input : [tc.input]; // Jaga-jaga input string biasa
                const result = ${functionName}(...inputArgs);
                if (JSON.stringify(result) !== JSON.stringify(tc.output)) {
                  allPassed = false;
                  failedMsg += \`Case \${i+1} Failed. Expected \${JSON.stringify(tc.output)}, Got \${JSON.stringify(result)}\\n\`;
                }
              });
              if(allPassed) console.log("PASSED_ALL");
              else console.log(failedMsg);
          } catch(e) { console.error(e.message); } 
        `;
    } 
    else if (lang === "python") {
        version = "3.10.0";
        const pyCases = JSON.stringify(testCases);
        fullCode = `
import json
import sys

# User Code
${code}

# Test Runner
try:
    test_cases = json.loads('${pyCases}')
    all_passed = True
    failed_msg = ""

    for i, tc in enumerate(test_cases):
        inputs = tc['input']
        if not isinstance(inputs, list): inputs = [inputs] # Handle single input
        expected = tc['output']
        try:
            result = ${functionName}(*inputs) # Panggil fungsi dinamis
        except Exception as e:
            print(f"Runtime Error at Case {i+1}: {str(e)}")
            sys.exit(0)

        if result != expected:
            all_passed = False
            failed_msg += f"Case {i+1} Failed. Expected {expected}, Got {result}\\n"

    if all_passed:
        print("PASSED_ALL")
    else:
        print(failed_msg)

except Exception as e:
    print(f"System Error: {str(e)}")
        `;
    } 
    else if (lang === "go") {
        version = "1.16.2";
        const goCases = JSON.stringify(testCases).replace(/"/g, '\\"');
        fullCode = `
package main
import (
    "encoding/json"
    "fmt"
)

// USER CODE START
${code}
// USER CODE END

func main() {
    jsonStr := "${goCases}"
    
    type TestCase struct {
        Input  []interface{} \`json:"input"\`
        Output interface{}   \`json:"output"\`
    }
    
    var cases []TestCase
    if err := json.Unmarshal([]byte(jsonStr), &cases); err != nil {
        fmt.Println("System Error: Bad JSON", err)
        return
    }

    allPassed := true
    for i, tc := range cases {
        // Casting logic (Simplified for integer challenges)
        // Note: For production, need generic reflection or type switch
        a := int(tc.Input[0].(float64))
        var b int
        if len(tc.Input) > 1 { b = int(tc.Input[1].(float64)) }
        
        expected := int(tc.Output.(float64))
        
        // Asumsi soal Go selalu 1 atau 2 param int untuk saat ini
        var result int
        if len(tc.Input) > 1 { result = ${functionName}(a, b) } else { result = ${functionName}(a) }
        
        if result != expected {
            allPassed = false
            fmt.Printf("Case %d Failed. Expected %v, Got %v\\n", i+1, expected, result)
        }
    }

    if allPassed { fmt.Println("PASSED_ALL") }
}
        `;
    } else {
        return NextResponse.json({ success: false, message: `Language '${lang}' not supported yet.` });
    }

    // --- KIRIM KE PISTON (Hanya Non-HTML) ---
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        version: version,
        files: [{ content: fullCode }],
      }),
    });

    const result = await response.json();

    if (result.message && !result.run) {
        return NextResponse.json({ success: false, message: "Compiler Error: " + result.message });
    }
    if (result.run && result.run.stderr) {
       return NextResponse.json({ success: false, message: "Error:\n" + result.run.stderr });
    }

    const output = result.run ? result.run.stdout.trim() : "";
    if (output.includes("PASSED_ALL")) {
       return NextResponse.json({ success: true, message: "Validation Passed!" });
    } else {
       return NextResponse.json({ success: false, message: output || "No output returned." });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Server Error: " + error.message });
  }
}