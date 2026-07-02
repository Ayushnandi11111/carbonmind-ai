"use client";

import EmissionChart from "@/components/EmissionChart";
import EmissionsDonut from "@/components/EmissionsDonut";
import { useUser } from "@/context/UserContext";
import UserSetupModal from "@/components/UserSetupModal";
import { calcTotalEmission } from "@/lib/emissions";

export default function AnalysisPage() {
  const { userData, loading, isNewUser } = useUser();

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

  const breakdown = calcTotalEmission({
    transport: userData.transport,
    distance: userData.distance,
    electricity: userData.electricity,
    food: userData.food,
    water: userData.water,
    shopping: userData.shopping,
    flights: userData.flights,
  });

  const pct = (val: number) => Math.round((val / breakdown.total) * 100);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-2">Carbon Analysis</h1>
      <p className="text-zinc-400 mb-8">
        Detailed breakdown of your environmental impact.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-zinc-400">Transport</h3>
          <p className="text-5xl font-bold text-green-400 mt-3">
            {pct(breakdown.transport)}%
          </p>
          <p className="text-zinc-500 mt-2">
            {breakdown.transport.toFixed(1)} kg CO₂
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-zinc-400">Electricity</h3>
          <p className="text-5xl font-bold text-yellow-400 mt-3">
            {pct(breakdown.electricity)}%
          </p>
          <p className="text-zinc-500 mt-2">
            {breakdown.electricity.toFixed(1)} kg CO₂
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-zinc-400">Food</h3>
          <p className="text-5xl font-bold text-blue-400 mt-3">
            {pct(breakdown.food)}%
          </p>
          <p className="text-zinc-500 mt-2">
            {breakdown.food.toFixed(1)} kg CO₂
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-zinc-400">Water</h3>
          <p className="text-5xl font-bold text-cyan-400 mt-3">
            {pct(breakdown.water)}%
          </p>
          <p className="text-zinc-500 mt-2">
            {breakdown.water.toFixed(1)} kg CO₂
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-zinc-400">Shopping</h3>
          <p className="text-5xl font-bold text-pink-400 mt-3">
            {pct(breakdown.shopping)}%
          </p>
          <p className="text-zinc-500 mt-2">
            {breakdown.shopping.toFixed(1)} kg CO₂
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-zinc-400">Flights</h3>
          <p className="text-5xl font-bold text-purple-400 mt-3">
            {pct(breakdown.flights)}%
          </p>
          <p className="text-zinc-500 mt-2">
            {breakdown.flights.toFixed(1)} kg CO₂
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Weekly Emissions Trend
          </h2>
          <div className="h-[350px]">
            <EmissionChart
              userId={userData.id}
              total={Math.round(breakdown.total)}
            />
          </div>
        </div>

        <EmissionsDonut />
      </div>
    </div>
  );
}
