"use client";

import { Leaf, Bike, Lightbulb, Droplets, Plane } from "lucide-react";
import { useUser } from "@/context/UserContext";
import UserSetupModal from "@/components/UserSetupModal";

export default function RecommendationsPage() {
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

  const recommendations: { title: string; impact: string; icon: typeof Leaf }[] = [];

  if (userData.transport === "car") {
    recommendations.push({
      title: "Use Public Transport",
      impact: "-18kg CO₂/month",
      icon: Bike,
    });
  }

  if (userData.electricity > 100) {
    recommendations.push({
      title: "Reduce Electricity Usage",
      impact: "-12kg CO₂/month",
      icon: Lightbulb,
    });
  }

  if (userData.food === "nonveg") {
    recommendations.push({
      title: "Add Plant-Based Meals",
      impact: "-15kg CO₂/month",
      icon: Leaf,
    });
  }

  if (userData.water > 500) {
    recommendations.push({
      title: "Cut Down Water Usage",
      impact: "-5kg CO₂/month",
      icon: Droplets,
    });
  }

  if (userData.flights > 4) {
    recommendations.push({
      title: "Reduce Air Travel",
      impact: "-40kg CO₂/month",
      icon: Plane,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Excellent Sustainability",
      impact: "Keep maintaining your habits",
      icon: Leaf,
    });
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-2">AI Recommendations</h1>
      <p className="text-zinc-400 mb-8">Personalized sustainability actions</p>

      <div className="grid md:grid-cols-3 gap-6">
        {recommendations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <Icon className="text-green-400 mb-4" size={32} />
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-green-400 font-bold">{item.impact}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
