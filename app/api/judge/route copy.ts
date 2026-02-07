import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code, language, testCases, functionName } = await request.json();

    // Normalisasi Nama Bahasa
    let lang = language.toLowerCase();
    if (lang.includes("node")) lang = "javascript";
    if (lang.includes("ts") || lang.includes("type")) lang = "typescript";
    if (lang.includes("py")) lang = "python";
    if (lang.includes("go")) lang = "go";

    let fullCode = "";
    // Gunakan versi yang pasti ada di Piston
    let version = "18.15.0"; 

    // 1. JS & TS
    if (lang === "javascript" || lang === "typescript") {
        version = lang === "typescript" ? "5.0.3" : "18.15.0";
        fullCode = `${code}\n\n`;
        fullCode += `
          const testCases = ${JSON.stringify(testCases)};
          try {
              let allPassed = true;
              let failedMsg = "";
              testCases.forEach((tc, i) => {
                const inputArgs = JSON.parse(JSON.stringify(tc.input));
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
    // 2. PYTHON
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
        expected = tc['output']
        try:
            result = solution(*inputs)
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
    // 3. GO (GOLANG)
    else if (lang === "go") {
        version = "1.16.2";
        // Escape double quote untuk string literal Go
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
    err := json.Unmarshal([]byte(jsonStr), &cases)
    if err != nil {
        fmt.Println("System Error: Bad JSON", err)
        return
    }

    allPassed := true
    
    for i, tc := range cases {
        // Casting input ke int (karena JSON number -> float64 di Go)
        // Pastikan soalnya tipe datanya INT
        a := int(tc.Input[0].(float64))
        b := int(tc.Input[1].(float64))
        
        expected := int(tc.Output.(float64))
        
        result := solution(a, b)
        
        if result != expected {
            allPassed = false
            fmt.Printf("Case %d Failed. Expected %v, Got %v\\n", i+1, expected, result)
        }
    }

    if allPassed {
        fmt.Println("PASSED_ALL")
    }
}
        `;
    } else {
        return NextResponse.json({ success: false, message: `Language '${lang}' not supported yet.` });
    }

    // --- EXECUTE PISTON ---
    console.log(`🚀 Sending ${lang} code to Piston...`);
    
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
    
    // Debug: Lihat respon asli Piston di Terminal
    console.log("🔍 Piston Response:", JSON.stringify(result).slice(0, 200)); 

    // 1. Cek Error API (Misal: Runtime not found / Rate limit)
    if (result.message && !result.run) {
        return NextResponse.json({ success: false, message: "Compiler API Error: " + result.message });
    }

    // 2. Cek Compile/Runtime Error (Stderr)
    if (result.run && result.run.stderr) {
       return NextResponse.json({ success: false, message: "Compilation/Runtime Error:\n" + result.run.stderr });
    }

    // 3. Cek Output
    const output = result.run ? result.run.stdout.trim() : "";
    if (output.includes("PASSED_ALL")) {
       return NextResponse.json({ success: true, message: "Validation Passed!" });
    } else {
       return NextResponse.json({ success: false, message: output || "No output returned (Code ran but printed nothing)." });
    }

  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json({ success: false, message: "Server Error: " + error.message });
  }
}