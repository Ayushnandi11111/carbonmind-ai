"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface EmissionChartProps {
  userId: string;
  total: number;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#0B1A12",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "10px",
          padding: "8px 14px",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "2px" }}>
          {label}
        </p>
        <p style={{ color: "#22c55e", fontWeight: "700", fontSize: "15px" }}>
          {payload[0].value} kg
        </p>
      </div>
    );
  }
  return null;
}

export default function EmissionChart({ userId, total }: EmissionChartProps) {
  const [data, setData] = useState<{ day: string; emission: number }[]>([]);

  useEffect(() => {
    async function loadHistory() {
      if (!userId) return;

      const { data: logs, error } = await supabase
        .from("emission_logs")
        .select("log_date, total_emission")
        .eq("user_id", userId)
        .order("log_date", { ascending: true })
        .limit(7);

      if (error) {
        console.error("Failed to load emission history:", error.message);
        return;
      }

      if (logs && logs.length > 0) {
        setData(
          logs.map((log) => ({
            day: new Date(log.log_date).toLocaleDateString("en-IN", {
              weekday: "short",
            }),
            emission: Math.round(Number(log.total_emission)),
          }))
        );
      } else {
        // No history yet — show today's value as a single point
        setData([
          {
            day: new Date().toLocaleDateString("en-IN", { weekday: "short" }),
            emission: total,
          },
        ]);
      }
    }

    loadHistory();
  }, [userId, total]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="day"
          stroke="#374151"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          stroke="#374151"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="emission"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#emissionGradient)"
          dot={false}
          activeDot={{ r: 5, fill: "#22c55e", stroke: "#040D0A", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
