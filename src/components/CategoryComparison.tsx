"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface CategoryComparisonProps {
  userId: string;
}

export default function CategoryComparison({ userId }: CategoryComparisonProps) {
  const [data, setData] = useState<
    { category: string; thisWeek: number; lastWeek: number }[]
  >([]);

  useEffect(() => {
    async function load() {
      if (!userId) return;

      const { data: logs, error } = await supabase
        .from("emission_logs")
        .select("log_date, transport_emission, electricity_emission, food_emission")
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .limit(14);

      if (error || !logs) return;

      const thisWeek = logs.slice(0, 7);
      const lastWeek = logs.slice(7, 14);

      const sum = (arr: typeof logs, key: keyof (typeof logs)[number]) =>
        arr.reduce((acc, r) => acc + Number(r[key] || 0), 0);

      setData([
        {
          category: "Transport",
          thisWeek: Math.round(sum(thisWeek, "transport_emission")),
          lastWeek: Math.round(sum(lastWeek, "transport_emission")),
        },
        {
          category: "Electricity",
          thisWeek: Math.round(sum(thisWeek, "electricity_emission")),
          lastWeek: Math.round(sum(lastWeek, "electricity_emission")),
        },
        {
          category: "Food",
          thisWeek: Math.round(sum(thisWeek, "food_emission")),
          lastWeek: Math.round(sum(lastWeek, "food_emission")),
        },
      ]);
    }

    load();
  }, [userId]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-semibold mb-4">Category Comparison</h3>
      <p className="text-xs text-zinc-500 mb-4">This week vs last week</p>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20 }}>
            <XAxis
              dataKey="category"
              stroke="#374151"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#374151"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0B1A12",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "10px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="lastWeek" name="Last Week" fill="#374151" radius={[6, 6, 0, 0]} />
            <Bar dataKey="thisWeek" name="This Week" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
