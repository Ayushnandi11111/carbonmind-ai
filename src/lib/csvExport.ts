import { supabase } from "./supabase";

export async function exportEmissionHistoryCsv(userId: string, name: string) {
  const { data: logs, error } = await supabase
    .from("emission_logs")
    .select("log_date, transport_emission, electricity_emission, food_emission, total_emission")
    .eq("user_id", userId)
    .order("log_date", { ascending: true });

  if (error || !logs) {
    console.error("CSV export failed:", error?.message);
    return;
  }

  const header = "Date,Transport (kg),Electricity (kg),Food (kg),Total (kg)\n";
  const rows = logs
    .map(
      (l) =>
        `${l.log_date},${Number(l.transport_emission).toFixed(2)},${Number(
          l.electricity_emission
        ).toFixed(2)},${Number(l.food_emission).toFixed(2)},${Number(
          l.total_emission
        ).toFixed(2)}`
    )
    .join("\n");

  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `CarbonMind-History-${name.replace(/\s+/g, "_")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
