// Static reference data — sourced loosely from public climate reports.
// Not scientifically precise, but good enough for an illustrative comparison.

export const NATIONAL_AVG_WEEKLY_EMISSION_KG = 70; // rough India household average/week
export const GLOBAL_AVG_WEEKLY_EMISSION_KG = 95; // rough global average/week

export function compareToAverage(userEmission: number) {
  const vsNational = Math.round(
    ((userEmission - NATIONAL_AVG_WEEKLY_EMISSION_KG) / NATIONAL_AVG_WEEKLY_EMISSION_KG) * 100
  );
  const vsGlobal = Math.round(
    ((userEmission - GLOBAL_AVG_WEEKLY_EMISSION_KG) / GLOBAL_AVG_WEEKLY_EMISSION_KG) * 100
  );
  return { vsNational, vsGlobal };
}

// Educational only — not a real marketplace integration.
const KG_CO2_PER_TREE_PER_YEAR = 21; // one mature tree absorbs ~21kg CO2/year

export function treesNeededToOffset(weeklyEmissionKg: number) {
  const yearlyEmission = weeklyEmissionKg * 52;
  return Math.ceil(yearlyEmission / KG_CO2_PER_TREE_PER_YEAR);
}
