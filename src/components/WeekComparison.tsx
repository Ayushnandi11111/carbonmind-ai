"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function WeekComparison({ userId }: { userId: string }) {
  const [change, setChange] = useState<number | null>(null);
  const [thisWeekAvg, setThisWeekAvg] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!userId) return;

      const { data: logs } = await supabase
        .from("emission_logs")
        .select("log_date, total_emission")
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .limit(14);

      if (!logs || logs.length === 0) return;

      const sorted = [...logs].sort(
        (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
      );

      const thisWeek = sorted.slice(0, 7);
      const lastWeek = sorted.slice(7, 14);

      const avg = (arr: typeof sorted) =>
        arr.length
          ? arr.reduce((sum, l) => sum + Number(l.total_emission), 0) / arr.length
          : null;

      const thisAvg = avg(thisWeek);
      const lastAvg = avg(lastWeek);

      setThisWeekAvg(thisAvg !== null ? Math.round(thisAvg) : null);

      if (thisAvg !== null && lastAvg !== null && lastAvg > 0) {
        setChange(Math.round(((thisAvg - lastAvg) / lastAvg) * 100));
      }
    }

    load();
  }, [userId]);

  if (thisWeekAvg === null) return null;

  const improving = change !== null && change < 0;
  const worsening = change !== null && change > 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="text-zinc-400 text-sm">This Week's Avg</h3>
      <p className="text-4xl font-bold mt-3">{thisWeekAvg}</p>
      <p className="text-zinc-500 text-sm mb-2">kg CO₂/day</p>

      {change !== null && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            improving
              ? "text-green-400"
              : worsening
              ? "text-red-400"
              : "text-zinc-400"
          }`}
        >
          {improving ? (
            <TrendingDown size={14} />
          ) : worsening ? (
            <TrendingUp size={14} />
          ) : (
            <Minus size={14} />
          )}
          <span>
            {Math.abs(change)}% vs last week{" "}
            {improving ? "(better!)" : worsening ? "(higher)" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
