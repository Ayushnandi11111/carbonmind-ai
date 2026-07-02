"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useUser } from "@/context/UserContext";
import { calcTotalEmission } from "@/lib/emissions";

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
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
        <p style={{ color: "#22c55e", fontWeight: "700", fontSize: "13px" }}>
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
}

export default function EmissionsDonut() {
  const { userData } = useUser();

  if (!userData) return null;

  const breakdown = calcTotalEmission({
    transport: userData.transport,
    distance: userData.distance,
    electricity: userData.electricity,
    food: userData.food,
    water: userData.water,
    shopping: userData.shopping,
    flights: userData.flights,
  });

  const total = breakdown.total || 1;

  const data = [
    { name: "Transport", value: Math.round((breakdown.transport / total) * 100), color: "#22c55e" },
    { name: "Electricity", value: Math.round((breakdown.electricity / total) * 100), color: "#34d399" },
    { name: "Food", value: Math.round((breakdown.food / total) * 100), color: "#6ee7b7" },
    { name: "Water", value: Math.round((breakdown.water / total) * 100), color: "#22d3ee" },
    { name: "Shopping", value: Math.round((breakdown.shopping / total) * 100), color: "#f472b6" },
    { name: "Flights", value: Math.round((breakdown.flights / total) * 100), color: "#a78bfa" },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white/4 backdrop-blur-xl border border-white/8 rounded-2xl p-5">
      <p className="text-sm font-semibold mb-1">Emission Sources</p>
      <p className="text-xs text-zinc-500 mb-4">By category</p>

      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1.5 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-zinc-400">{d.name}</span>
            </div>
            <span className="text-zinc-300 font-medium">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
