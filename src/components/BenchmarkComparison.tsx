"use client";

import { compareToAverage, treesNeededToOffset } from "@/lib/benchmarks";
import { TreeDeciduous, Globe2, Flag as FlagIcon } from "lucide-react";

export default function BenchmarkComparison({
  weeklyEmissionKg,
}: {
  weeklyEmissionKg: number;
}) {
  const { vsNational, vsGlobal } = compareToAverage(weeklyEmissionKg);
  const trees = treesNeededToOffset(weeklyEmissionKg);

  const fmt = (pct: number) =>
    pct < 0 ? `${Math.abs(pct)}% lower` : `${pct}% higher`;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 className="font-semibold">How You Compare</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-3">
          <FlagIcon size={18} className="text-orange-400 shrink-0" />
          <div>
            <p className="text-zinc-500 text-xs">vs India avg</p>
            <p className={vsNational <= 0 ? "text-green-400" : "text-red-400"}>
              {fmt(vsNational)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Globe2 size={18} className="text-blue-400 shrink-0" />
          <div>
            <p className="text-zinc-500 text-xs">vs Global avg</p>
            <p className={vsGlobal <= 0 ? "text-green-400" : "text-red-400"}>
              {fmt(vsGlobal)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TreeDeciduous size={18} className="text-green-400 shrink-0" />
          <div>
            <p className="text-zinc-500 text-xs">Trees to offset/year</p>
            <p className="text-green-400">{trees} trees</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-600">
        Illustrative estimates based on public climate data — not scientifically precise.
      </p>
    </div>
  );
}
