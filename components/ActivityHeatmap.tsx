"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
// import { Tooltip } from "react-tooltip"; 

export default function ActivityHeatmap({ userId }: { userId: string }) {
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchActivity = async () => {
      // Ambil data submission sukses user
      const { data } = await supabase
        .from("submissions")
        .select("created_at")
        .eq("user_id", userId)
        .eq("status", "success");

      // Grouping by Date (YYYY-MM-DD)
      const counts: Record<string, number> = {};
      data?.forEach((item) => {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      setActivityMap(counts);
      setLoading(false);
    };

    fetchActivity();
  }, [userId]);

  // Generate Array Tanggal (12 Minggu Terakhir / ~3 Bulan)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    // Mundur 84 hari (12 minggu x 7 hari)
    for (let i = 84; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const dates = generateDates();

  // Helper nentuin warna berdasarkan jumlah submit
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-zinc-900"; // Kosong
    if (count <= 1) return "bg-green-200 dark:bg-green-900"; // 1 submit
    if (count <= 3) return "bg-green-400 dark:bg-green-700"; // Sedang
    return "bg-green-600 dark:bg-green-500"; // Rame (4+)
  };

  if (loading) return <div className="h-32 w-full bg-gray-50 dark:bg-zinc-900/50 animate-pulse rounded-xl"></div>;

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-[#0a0a0a] shadow-sm">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-sm font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
            Contribution Activity (Last 3 Months)
         </h2>
         <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>Less</span>
            <div className="w-2 h-2 bg-gray-100 dark:bg-zinc-900 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-200 dark:bg-green-900 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-400 dark:bg-green-700 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-sm"></div>
            <span>More</span>
         </div>
      </div>
      
      {/* GRID HEATMAP */}
      <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit overflow-x-auto pb-2">
         {dates.map((date) => {
            const count = activityMap[date] || 0;
            return (
               <div 
                  key={date}
                  className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors hover:ring-1 ring-gray-400 cursor-pointer relative group`}
                  title={`${count} submissions on ${date}`} // Native Tooltip
               >
               </div>
            );
         })}
      </div>
    </div>
  );
}