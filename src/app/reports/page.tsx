"use client";

import { useUser } from "@/context/UserContext";
import { Download, FileText, Leaf } from "lucide-react";
import UserSetupModal from "@/components/UserSetupModal";
import { calcTotalEmission, calcCarbonScore } from "@/lib/emissions";

export default function ReportsPage() {
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

  const totalEmission = Math.round(breakdown.total);
  const carbonScore = calcCarbonScore(breakdown.total);
  const monthlyReduction = Math.max(0, Math.round(250 - totalEmission));

  const downloadTextReport = () => {
    const report = `
CARBONMIND AI REPORT

Profile: ${userData.profileName}
Name: ${userData.name}

Transport: ${userData.transport} (${breakdown.transport.toFixed(1)} kg CO₂)
Distance: ${userData.distance} km

Electricity Usage: ${userData.electricity} kWh (${breakdown.electricity.toFixed(1)} kg CO₂)

Food Preference: ${userData.food} (${breakdown.food.toFixed(1)} kg CO₂)

Water Usage: ${userData.water} L (${breakdown.water.toFixed(1)} kg CO₂)
Shopping: ₹${userData.shopping} (${breakdown.shopping.toFixed(1)} kg CO₂)
Flights/year: ${userData.flights} (${breakdown.flights.toFixed(1)} kg CO₂)

Total Emission: ${totalEmission} kg CO₂
Carbon Score: ${carbonScore}/100
Estimated Monthly Reduction Potential: ${monthlyReduction} kg CO₂
Current Streak: ${userData.streakCount} days
`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CarbonMind-Report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdfReport = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("CarbonMind AI Report", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    const lines = [
      `Profile: ${userData.profileName}`,
      `Name: ${userData.name}`,
      "",
      `Transport: ${userData.transport} — ${breakdown.transport.toFixed(1)} kg CO2`,
      `Distance: ${userData.distance} km`,
      `Electricity: ${userData.electricity} kWh — ${breakdown.electricity.toFixed(1)} kg CO2`,
      `Food preference: ${userData.food} — ${breakdown.food.toFixed(1)} kg CO2`,
      `Water usage: ${userData.water} L — ${breakdown.water.toFixed(1)} kg CO2`,
      `Shopping spend: Rs ${userData.shopping} — ${breakdown.shopping.toFixed(1)} kg CO2`,
      `Flights/year: ${userData.flights} — ${breakdown.flights.toFixed(1)} kg CO2`,
      "",
      `Total Emission: ${totalEmission} kg CO2`,
      `Carbon Score: ${carbonScore} / 100`,
      `Estimated Monthly Reduction Potential: ${monthlyReduction} kg CO2`,
      `Current Streak: ${userData.streakCount} days`,
    ];

    let y = 35;
    lines.forEach((line) => {
      doc.text(line, 20, y);
      y += 8;
    });

    doc.save("CarbonMind-Report.pdf");
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-2">Sustainability Reports</h1>
      <p className="text-zinc-400 mb-8">
        Your environmental impact summary.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <FileText className="text-green-400 mb-4" size={32} />
          <h2 className="text-lg font-semibold">Total Emissions</h2>
          <p className="text-4xl font-bold mt-3">{totalEmission}</p>
          <p className="text-zinc-500">kg CO₂</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <Leaf className="text-green-400 mb-4" size={32} />
          <h2 className="text-lg font-semibold">Carbon Score</h2>
          <p className="text-4xl font-bold mt-3">{carbonScore}</p>
          <p className="text-zinc-500">/100</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <Download className="text-green-400 mb-4" size={32} />
          <h2 className="text-lg font-semibold">Monthly Reduction</h2>
          <p className="text-4xl font-bold mt-3 text-green-400">
            {monthlyReduction}
          </p>
          <p className="text-zinc-500">kg CO₂</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Report Summary</h2>

        <div className="space-y-3 text-zinc-300">
          <p>👤 Profile: <span className="ml-2 font-semibold">{userData.profileName}</span></p>
          <p>🚗 Transport: <span className="ml-2 capitalize">{userData.transport}</span></p>
          <p>📍 Distance: <span className="ml-2">{userData.distance} km</span></p>
          <p>⚡ Electricity: <span className="ml-2">{userData.electricity} kWh</span></p>
          <p>🍽 Food: <span className="ml-2 capitalize">{userData.food}</span></p>
          <p>💧 Water: <span className="ml-2">{userData.water} L</span></p>
          <p>🛍 Shopping: <span className="ml-2">₹{userData.shopping}</span></p>
          <p>✈️ Flights/year: <span className="ml-2">{userData.flights}</span></p>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={downloadPdfReport}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition"
          >
            Download PDF
          </button>
          <button
            onClick={downloadTextReport}
            className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl transition border border-white/10"
          >
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
}
