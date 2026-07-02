"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import UserSetupModal from "@/components/UserSetupModal";

export default function SettingsPage() {
  const { userData, setUserData, loading, isNewUser } = useUser();

  const [profileName, setProfileName] = useState("");
  const [name, setName] = useState("");
  const [transport, setTransport] = useState("car");
  const [distance, setDistance] = useState("");
  const [electricity, setElectricity] = useState("");
  const [food, setFood] = useState("mixed");
  const [water, setWater] = useState("");
  const [shopping, setShopping] = useState("");
  const [flights, setFlights] = useState("");
  const [saving, setSaving] = useState(false);

  const fieldClass =
    "w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white shadow-inner shadow-black/10 outline-none transition placeholder:text-zinc-600 focus:border-green-400/50 focus:bg-black/35 focus:ring-4 focus:ring-green-500/10";
  const labelClass =
    "mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500";

  useEffect(() => {
    if (userData) {
      setProfileName(userData.profileName);
      setName(userData.name);
      setTransport(userData.transport);
      setDistance(String(userData.distance));
      setElectricity(String(userData.electricity));
      setFood(userData.food);
      setWater(String(userData.water));
      setShopping(String(userData.shopping));
      setFlights(String(userData.flights));
    }
  }, [userData]);

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

  const saveChanges = async () => {
    setSaving(true);
    await setUserData({
      profileName,
      name,
      transport,
      distance: Number(distance),
      electricity: Number(electricity),
      food,
      water: Number(water || 0),
      shopping: Number(shopping || 0),
      flights: Number(flights || 0),
    });
    setSaving(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-green-400/80">
            Account Controls
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Manage your CarbonMind AI profile, lifestyle inputs, and weekly
            sustainability baseline.
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          Profile:{" "}
          <span className="font-semibold text-green-200">
            {userData.profileName}
          </span>
        </div>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">Personal Details</h2>
          <p className="mt-1 text-sm text-zinc-500">
            These names help personalize your dashboard and reports.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label className={labelClass}>Profile Name</label>
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="border-y border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">Weekly Footprint Inputs</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Keep these updated so CarbonMind can calculate better insights.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Transport Mode</label>
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className={fieldClass}
            >
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="bike">Bike</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Distance (km / week)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Electricity Usage (kWh / week)</label>
            <input
              type="number"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Food Preference</label>
            <select
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className={fieldClass}
            >
              <option value="veg">Vegetarian</option>
              <option value="mixed">Mixed Diet</option>
              <option value="nonveg">Non-Vegetarian</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Water Usage (litres / week)</label>
            <input
              type="number"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Shopping Spend (INR / week)</label>
            <input
              type="number"
              value={shopping}
              onChange={(e) => setShopping(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Flights per year</label>
            <input
              type="number"
              value={flights}
              onChange={(e) => setFlights(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-black/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-zinc-500">
            Changes update your active profile immediately after saving.
          </p>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-green-500 px-6 text-sm font-bold text-black shadow-lg shadow-green-500/20 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
