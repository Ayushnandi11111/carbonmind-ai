"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function UserSetupModal() {
  const { setUserData } = useUser();

  const [name, setName] = useState("");
  const [transport, setTransport] = useState("car");
  const [distance, setDistance] = useState("");
  const [electricity, setElectricity] = useState("");
  const [food, setFood] = useState("mixed");
  const [water, setWater] = useState("");
  const [shopping, setShopping] = useState("");
  const [flights, setFlights] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async () => {
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!distance || !electricity) {
      setErrorMsg("Please fill in distance and electricity usage.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    await setUserData({
      profileName: name.trim(),
      name: name.trim(),
      transport,
      distance: Number(distance),
      electricity: Number(electricity),
      food,
      water: Number(water || 0),
      shopping: Number(shopping || 0),
      flights: Number(flights || 0),
    });

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#07111C] border border-green-500/20 rounded-3xl p-8 my-8">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to CarbonMind AI 🌱
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Tell us a bit about your lifestyle so we can personalize your
          dashboard.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          />

          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          >
            <option value="car">Car</option>
            <option value="bus">Bus</option>
            <option value="bike">Bike</option>
          </select>

          <input
            type="number"
            placeholder="Distance Travelled (km / week)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          />

          <input
            type="number"
            placeholder="Electricity Usage (kWh / week)"
            value={electricity}
            onChange={(e) => setElectricity(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          />

          <select
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          >
            <option value="veg">Vegetarian</option>
            <option value="mixed">Mixed</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-zinc-500 mb-3">
              Optional — for a more complete footprint
            </p>
          </div>

          <input
            type="number"
            placeholder="Water Usage (litres / week)"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          />

          <input
            type="number"
            placeholder="Shopping Spend (₹ / week)"
            value={shopping}
            onChange={(e) => setShopping(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          />

          <input
            type="number"
            placeholder="Flights per year"
            value={flights}
            onChange={(e) => setFlights(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-green-500/40"
          />

          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-green-500 text-black font-bold hover:bg-green-400 transition disabled:opacity-50"
          >
            {submitting ? "Setting up..." : "Generate Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
