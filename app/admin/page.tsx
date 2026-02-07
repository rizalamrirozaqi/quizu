"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const supabase = createClient();
  const [form, setForm] = useState({
    title: "", slug: "", difficulty: "easy", points: 10, language: "javascript", description: "", starter_code: "", test_cases: "[]"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi JSON Test Cases
    try { JSON.parse(form.test_cases); } catch { alert("Invalid JSON Format in Test Cases"); return; }

    const { error } = await supabase.from('challenges').insert({
       ...form, 
       test_cases: JSON.parse(form.test_cases), // Convert string to JSONB
       function_name: 'solution'
    });

    if (error) alert("Error: " + error.message);
    else { alert("Challenge Created!"); setForm({...form, title: "", slug: ""}); } // Reset
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin: Create Challenge</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title" className="w-full p-2 bg-[#111] border border-gray-700 rounded" 
          onChange={e => setForm({...form, title: e.target.value})} />
        
        <div className="grid grid-cols-2 gap-4">
           <input placeholder="Slug (e.g. two-sum)" className="p-2 bg-[#111] border border-gray-700 rounded"
             onChange={e => setForm({...form, slug: e.target.value})} />
           <input type="number" placeholder="Points" className="p-2 bg-[#111] border border-gray-700 rounded"
             onChange={e => setForm({...form, points: parseInt(e.target.value)})} />
        </div>

        <select className="w-full p-2 bg-[#111] border border-gray-700 rounded"
           onChange={e => setForm({...form, difficulty: e.target.value})}>
           <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>

        <textarea placeholder="Description (Markdown)" rows={4} className="w-full p-2 bg-[#111] border border-gray-700 rounded"
           onChange={e => setForm({...form, description: e.target.value})} />

        <textarea placeholder="Starter Code" rows={4} className="w-full p-2 bg-[#111] border border-gray-700 rounded font-mono text-sm"
           onChange={e => setForm({...form, starter_code: e.target.value})} />

        <textarea placeholder='Test Cases JSON: [{"input": [1], "output": 2}]' rows={4} className="w-full p-2 bg-[#111] border border-gray-700 rounded font-mono text-sm"
           onChange={e => setForm({...form, test_cases: e.target.value})} />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
           Create Challenge
        </button>
      </form>
    </div>
  );
}