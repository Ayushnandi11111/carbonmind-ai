"use client";

import { useUser } from "@/context/UserContext";
import { calcTotalEmission, calcCarbonScore } from "@/lib/emissions";
import StreakBadge from "@/components/StreakBadge";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const { userData } = useUser();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    year: "numeric",
  });

  if (!userData) return null;

  const { total } = calcTotalEmission({
    transport: userData.transport,
    distance: userData.distance,
    electricity: userData.electricity,
    food: userData.food,
    water: userData.water,
    shopping: userData.shopping,
    flights: userData.flights,
  });

  const carbonScore = calcCarbonScore(total);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/8 bg-black/10 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="text-2xl font-bold">Hello, {userData.name}! 🌱</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {today} · Your weekly summary is ready
        </p>
      </div>
      <div className="flex items-center gap-3">
        <StreakBadge />
        <ThemeToggle />
        <div className="px-3 py-1.5 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-medium">
          Score: {carbonScore} / 100
        </div>
      </div>
    </header>
  );
}