"use client";

import { useEffect, useState } from "react";
import { Target, TrendingDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase, Goal } from "@/lib/supabase";
import { calcTotalEmission } from "@/lib/emissions";
import UserSetupModal from "@/components/UserSetupModal";

export default function GoalsPage() {
  const { userData, loading, isNewUser } = useUser();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [targetInput, setTargetInput] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadGoal() {
      if (!userData?.id) return;
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userData.id)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setGoal(data as Goal);
        setTargetInput(String(data.target_emission));
        setPeriod(data.period);
      }
    }
    loadGoal();
  }, [userData?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isNewUser || !userData) {
    return <UserSetupModal />;
  }

  const { total: currentEmission } = calcTotalEmission({
    transport: userData.transport,
    distance: userData.distance,
    electricity: userData.electricity,
    food: userData.food,
    water: userData.water,
    shopping: userData.shopping,
    flights: userData.flights,
  });

  const periodMultiplier = period === "weekly" ? 1 : 4.3;
  const projectedEmission = Math.round(currentEmission * periodMultiplier);

  const progress = goal
    ? Math.min(100, Math.round((projectedEmission / goal.target_emission) * 100))
    : 0;

  const isOverTarget = goal && projectedEmission > goal.target_emission;

  const saveGoal = async () => {
    if (!targetInput || Number(targetInput) <= 0) return;
    setSaving(true);

    // Deactivate old goals, create a new active one
    await supabase
      .from("goals")
      .update({ active: false })
      .eq("user_id", userData.id);

    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: userData.id,
        target_emission: Number(targetInput),
        period,
        active: true,
      })
      .select()
      .single();

    if (!error && data) setGoal(data as Goal);
    setSaving(false);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-2">Goals</h1>
      <p className="text-zinc-400 mb-8">
        Set a carbon emission target and track your progress toward it.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-green-400" size={20} />
            <h2 className="text-xl font-semibold">Set Your Target</h2>
          </div>

          <div className="space-y-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "weekly" | "monthly")}
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
            >
              <option value="weekly">Weekly Target</option>
              <option value="monthly">Monthly Target</option>
            </select>

            <input
              type="number"
              placeholder={`Target emission (kg CO₂ / ${period})`}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
            />

            <button
              onClick={saveGoal}
              disabled={saving}
              className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Goal"}
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold">Your Progress</h2>
          </div>

          {!goal ? (
            <p className="text-zinc-400 text-sm">
              No active goal yet. Set a target to start tracking progress.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">
                    Projected ({goal.period})
                  </span>
                  <span
                    className={isOverTarget ? "text-red-400" : "text-green-400"}
                  >
                    {projectedEmission} / {goal.target_emission} kg
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverTarget ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-zinc-300">
                {isOverTarget
                  ? `You're projected to exceed your ${goal.period} target by ${
                      projectedEmission - goal.target_emission
                    } kg CO₂. Consider reducing transport or electricity usage.`
                  : `You're on track! ${
                      goal.target_emission - projectedEmission
                    } kg CO₂ of headroom left for this ${goal.period}.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
