// Single source of truth for all emission math, so every page/component
// computes numbers the same way instead of duplicating formulas everywhere.

export type EmissionInputs = {
  transport: string;
  distance: number;
  electricity: number;
  food: string;
  water?: number; // litres/week
  shopping?: number; // ₹ spent/week
  flights?: number; // flights/year
};

export function calcTransportEmission(transport: string, distance: number) {
  if (transport === "car") return distance * 0.21;
  if (transport === "bus") return distance * 0.1;
  return distance * 0.02; // bike
}

export function calcFoodEmission(food: string) {
  if (food === "veg") return 10;
  if (food === "mixed") return 25;
  return 45; // nonveg
}

export function calcElectricityEmission(electricity: number) {
  return electricity * 0.5;
}

export function calcWaterEmission(water: number) {
  return water * 0.0003; // kg CO2 per litre (rough)
}

export function calcShoppingEmission(shopping: number) {
  return shopping * 0.01; // kg CO2 per ₹ spent (rough)
}

export function calcFlightsEmission(flightsPerYear: number) {
  return (flightsPerYear * 250) / 52; // ~250kg/flight, spread across the year
}

export function calcTotalEmission(inputs: EmissionInputs) {
  const transport = calcTransportEmission(inputs.transport, inputs.distance);
  const electricity = calcElectricityEmission(inputs.electricity);
  const food = calcFoodEmission(inputs.food);
  const water = calcWaterEmission(inputs.water || 0);
  const shopping = calcShoppingEmission(inputs.shopping || 0);
  const flights = calcFlightsEmission(inputs.flights || 0);

  const total = transport + electricity + food + water + shopping + flights;

  return { transport, electricity, food, water, shopping, flights, total };
}

export function calcCarbonScore(totalEmission: number) {
  return Math.max(0, Math.min(100, Math.round(100 - totalEmission / 2)));
}
