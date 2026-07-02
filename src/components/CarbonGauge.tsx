"use client";

interface CarbonGaugeProps {
  score: number;
}

export default function CarbonGauge({ score }: CarbonGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 70 ? "#22c55e" : clamped >= 40 ? "#fbbf24" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-full h-[170px]">
      <svg width="170" height="170" className="-rotate-90">
        <circle
          cx="85"
          cy="85"
          r={radius}
          stroke="#1f2937"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="85"
          cy="85"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>

      <div className="absolute text-center">
        <div className="text-4xl font-bold" style={{ color }}>
          {clamped}
        </div>
        <div className="text-zinc-500 text-xs mt-1">/ 100</div>
      </div>
    </div>
  );
}
