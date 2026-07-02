"use client";

import { Leaf, Droplets, Wind } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ImpactCards() {
  const { userData } = useUser();

  if (!userData) return null;

  const transportEmission =
    userData.transport === "car"
      ? userData.distance * 0.21
      : userData.transport === "bus"
      ? userData.distance * 0.1
      : userData.distance * 0.02;

  const electricityEmission = userData.electricity * 0.5;

  const foodEmission =
    userData.food === "veg" ? 10 : userData.food === "mixed" ? 25 : 45;

  const totalEmission = transportEmission + electricityEmission + foodEmission;

  // Rough, illustrative conversions — not scientifically precise, but derived
  // from the user's real numbers instead of being hardcoded.
  const treesEquivalent = Math.max(0, Math.round((300 - totalEmission) / 10));
  const waterSaved = Math.max(0, Math.round((300 - totalEmission) * 4));
  const monthlyReduction = Math.max(0, Math.round((250 - totalEmission) * 4));

  const stats = [
    {
      icon: Leaf,
      value: `${treesEquivalent}`,
      label: "Trees equivalent saved",
      bgColor: "bg-green-500/15",
      borderColor: "border-green-500/20",
      textColor: "text-green-400",
    },
    {
      icon: Droplets,
      value: `${waterSaved}L`,
      label: "Water footprint saved",
      bgColor: "bg-blue-500/15",
      borderColor: "border-blue-500/20",
      textColor: "text-blue-400",
    },
    {
      icon: Wind,
      value: `${monthlyReduction}kg`,
      label: "CO₂ reduced this month",
      bgColor: "bg-teal-500/15",
      borderColor: "border-teal-500/20",
      textColor: "text-teal-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ icon: Icon, value, label, bgColor, borderColor, textColor }) => (
        <div
          key={label}
          className="bg-white/4 backdrop-blur-xl border border-white/8 rounded-2xl p-5 flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-center shrink-0`}
          >
            <Icon size={22} className={textColor} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
