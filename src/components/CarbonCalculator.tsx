"use client";

import { useState } from "react";
import { calcTotalEmission, calcCarbonScore } from "@/lib/emissions";

export default function CarbonCalculator() {
  const [transport, setTransport] = useState("car");
  const [distance, setDistance] = useState("");
  const [electricity, setElectricity] = useState("");
  const [food, setFood] = useState("mixed");
  const [water, setWater] = useState("");
  const [shopping, setShopping] = useState("");
  const [flights, setFlights] = useState("");

  const [result, setResult] = useState<{
    emission: number;
    score: number;
    recommendation: string;
  } | null>(null);

  const calculateEmission = () => {
    const { total } = calcTotalEmission({
      transport,
      distance: Number(distance),
      electricity: Number(electricity),
      food,
      water: Number(water || 0),
      shopping: Number(shopping || 0),
      flights: Number(flights || 0),
    });

    const score = calcCarbonScore(total);

    let recommendation = "";
    if (total > 150) {
      recommendation =
        "High carbon footprint detected. Use public transport, reduce electricity consumption, and adopt more sustainable habits.";
    } else if (total > 80) {
      recommendation =
        "Good progress. Consider cycling for short trips and reducing unnecessary energy usage.";
    } else {
      recommendation =
        "Excellent! Your carbon footprint is relatively low. Keep maintaining these sustainable habits.";
    }

    setResult({ emission: Number(total.toFixed(2)), score, recommendation });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-2">Carbon Footprint Calculator</h2>
      <p className="text-zinc-500 text-sm mb-6">
        A quick what-if tool — separate from your saved profile.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
        >
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="bike">Bike</option>
        </select>

        <select
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
        >
          <option value="veg">Vegetarian</option>
          <option value="mixed">Mixed Diet</option>
          <option value="nonveg">Non-Vegetarian</option>
        </select>

        <input
          type="number"
          placeholder="Distance Travelled (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Electricity Usage (kWh)"
          value={electricity}
          onChange={(e) => setElectricity(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Water Usage (litres)"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Shopping Spend (₹)"
          value={shopping}
          onChange={(e) => setShopping(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Flights per year"
          value={flights}
          onChange={(e) => setFlights(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:col-span-2"
        />
      </div>

      <button
        onClick={calculateEmission}
        className="w-full mt-4 bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400 transition"
      >
        Calculate Carbon Footprint
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-zinc-400 text-sm">Estimated CO₂ Emission</p>
            <h3 className="text-3xl font-bold text-green-400">
              {result.emission} kg CO₂
            </h3>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-zinc-400 text-sm">Carbon Score</p>
            <h3 className="text-3xl font-bold text-blue-400">
              {result.score}/100
            </h3>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-zinc-400 text-sm mb-2">
              Personalized Recommendation
            </p>
            <p className="text-white">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
