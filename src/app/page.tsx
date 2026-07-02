"use client";

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import CarbonGauge from "@/components/CarbonGauge";
import EmissionChart from "@/components/EmissionChart";
import EmissionsDonut from "@/components/EmissionsDonut";
import CategoryComparison from "@/components/CategoryComparison";
import WeeklyInsight from "@/components/WeeklyInsight";
import WeeklyChallenge from "@/components/WeeklyChallenge";
import BenchmarkComparison from "@/components/BenchmarkComparison";
import CarbonCalculator from "@/components/CarbonCalculator";
import AIAssistant from "@/components/AIAssistant";
import UserSetupModal from "@/components/UserSetupModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import Skeleton from "@/components/Skeleton";
import { calcTotalEmission, calcCarbonScore } from "@/lib/emissions";
import { exportEmissionHistoryCsv } from "@/lib/csvExport";
import { useRealtimeUser } from "@/lib/useRealtimeUser";
import { useToast } from "@/lib/ToastContext";
import { Download } from "lucide-react";

export default function Home() {
  const { userData, loading, isNewUser, refreshUserData, setNewBadgeCallback } =
    useUser();
  const { showToast } = useToast();

  useRealtimeUser(userData?.id, refreshUserData);

  useEffect(() => {
    setNewBadgeCallback((badge) => {
      showToast(`New badge: ${badge.title}`, badge.emoji);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isNewUser || !userData) {
    return <UserSetupModal />;
  }

  const { total } = calcTotalEmission({
    transport: userData.transport,
    distance: userData.distance,
    electricity: userData.electricity,
    food: userData.food,
    water: userData.water,
    shopping: userData.shopping,
    flights: userData.flights,
  });

  const totalEmission = Math.round(total);
  const carbonScore = calcCarbonScore(totalEmission);

  let recommendation = "";
  if (totalEmission > 150) {
    recommendation = "Use public transport and reduce electricity consumption.";
  } else if (totalEmission > 80) {
    recommendation = "Good progress. Try cycling for short trips.";
  } else {
    recommendation = "Excellent! Your carbon footprint is low.";
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/*
        NOTE: The page-level "Hello, {name}!" welcome block used to live
        here, but Header.tsx (rendered once in layout.tsx, above every
        page) already shows that same greeting. Having both caused the
        greeting to render twice, stacked on top of each other. This page
        now only owns the dashboard subtitle + the Export CSV action.
      */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-zinc-400 text-sm sm:text-base">
            AI-powered sustainability dashboard
          </p>
        </div>

        <button
          onClick={() => exportEmissionHistoryCsv(userData.id, userData.name)}
          className="flex items-center gap-2 text-xs sm:text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:bg-white/10 transition shrink-0"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* AI Insight */}
      <ErrorBoundary fallbackLabel="Couldn't load AI insight.">
        <WeeklyInsight />
      </ErrorBoundary>

      <WeeklyChallenge />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-zinc-400 text-sm mb-4">Carbon Score</h3>
          <CarbonGauge score={carbonScore} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-zinc-400 text-sm">Total Emission</h3>
          <p className="text-4xl font-bold mt-3">{totalEmission}</p>
          <p className="text-zinc-500 text-sm">kg CO₂</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-zinc-400 text-sm">Distance Travelled</h3>
          <p className="text-4xl font-bold mt-3">{userData.distance}</p>
          <p className="text-zinc-500 text-sm">km</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-zinc-400 text-sm">Electricity Usage</h3>
          <p className="text-4xl font-bold mt-3">{userData.electricity}</p>
          <p className="text-zinc-500 text-sm">kWh</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-zinc-500">Transport</p>
            <p className="font-semibold capitalize">{userData.transport}</p>
          </div>
          <div>
            <p className="text-zinc-500">Food Preference</p>
            <p className="font-semibold capitalize">{userData.food}</p>
          </div>
          <div>
            <p className="text-zinc-500">Flights / year</p>
            <p className="font-semibold">{userData.flights}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Emission Trends</h2>
          <div className="h-[300px]">
            <ErrorBoundary fallbackLabel="Couldn't load emission chart.">
              <EmissionChart userId={userData.id} total={totalEmission} />
            </ErrorBoundary>
          </div>
        </div>

        <ErrorBoundary fallbackLabel="Couldn't load breakdown.">
          <EmissionsDonut />
        </ErrorBoundary>
      </div>

      <ErrorBoundary fallbackLabel="Couldn't load comparison chart.">
        <CategoryComparison userId={userData.id} />
      </ErrorBoundary>

      <BenchmarkComparison weeklyEmissionKg={totalEmission} />

      {/* Calculator */}
      <CarbonCalculator />

      {/* Recommendation */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-green-400 mb-3">
          AI Recommendation
        </h2>
        <p className="text-zinc-300">{recommendation}</p>
      </div>
 
      {/* AI Assistant */}
      <div className="h-[500px]">
        <ErrorBoundary fallbackLabel="AI Assistant couldn't load.">
          <AIAssistant />
        </ErrorBoundary>
      </div>
    </div>
  );
}