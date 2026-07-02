"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function WeeklyInsight() {
  const { userData } = useUser();
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchInsight() {
    if (!userData?.id) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id, userData }),
      });
      const data = await res.json();
      setInsight(data.insight);
    } catch {
      setInsight("Couldn't load your weekly insight right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-green-400" />
        <h3 className="font-semibold text-sm">This Week's AI Insight</h3>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">Generating your insight...</p>
      ) : (
        <p className="text-sm text-zinc-300 leading-relaxed">{insight}</p>
      )}
    </div>
  );
}
