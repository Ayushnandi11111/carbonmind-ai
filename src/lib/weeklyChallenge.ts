// Auto-generated weekly mini-challenge, picked deterministically based on the
// week number so it doesn't change on every reload but rotates weekly.
const CHALLENGES = [
  { text: "Cycle or walk for at least 1 trip this week", emoji: "🚲" },
  { text: "Try 2 vegetarian meals this week", emoji: "🥗" },
  { text: "Cut electricity usage by 10% this week", emoji: "💡" },
  { text: "Skip one car trip under 3km", emoji: "🚗" },
  { text: "Air-dry clothes instead of using a dryer", emoji: "👕" },
  { text: "Unplug unused electronics overnight", emoji: "🔌" },
  { text: "Carpool or use public transport once this week", emoji: "🚌" },
];

function getWeekNumber(): number {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return Math.ceil((days + start.getDay() + 1) / 7);
}

export function getWeeklyChallenge() {
  const week = getWeekNumber();
  return CHALLENGES[week % CHALLENGES.length];
}
