// Central registry of every badge in the app. Adding a new badge later just
// means adding one entry here + a condition function — nothing else changes.

export type BadgeDef = {
  key: string;
  title: string;
  description: string;
  emoji: string;
};

export const BADGES: BadgeDef[] = [
  {
    key: "first_step",
    title: "First Step",
    description: "Created your CarbonMind profile",
    emoji: "🌱",
  },
  {
    key: "streak_3",
    title: "Building Momentum",
    description: "3-day check-in streak",
    emoji: "🔥",
  },
  {
    key: "streak_7",
    title: "Week Warrior",
    description: "7-day check-in streak",
    emoji: "⚡",
  },
  {
    key: "streak_30",
    title: "Habit Master",
    description: "30-day check-in streak",
    emoji: "🏆",
  },
  {
    key: "low_footprint",
    title: "Eco Champion",
    description: "Carbon score of 80+",
    emoji: "🌿",
  },
  {
    key: "goal_setter",
    title: "Goal Setter",
    description: "Set your first emission target",
    emoji: "🎯",
  },
  {
    key: "goal_achiever",
    title: "Target Hit",
    description: "Stayed under your goal for a full week",
    emoji: "✅",
  },
  {
    key: "veg_week",
    title: "Plant Powered",
    description: "Logged a vegetarian diet",
    emoji: "🥦",
  },
  {
    key: "multi_profile",
    title: "Family Footprint",
    description: "Created a second profile on this device",
    emoji: "👥",
  },
];

export function getBadgeDef(key: string): BadgeDef | undefined {
  return BADGES.find((b) => b.key === key);
}

// Pure functions — given the current state, which badge keys should be awarded?
// Called after any relevant data change; already-earned badges are skipped
// by the unique constraint in the DB, so it's safe to call repeatedly.
export function evaluateBadges(input: {
  streakCount: number;
  carbonScore: number;
  food: string;
  hasGoal: boolean;
  goalMetThisWeek: boolean;
  profileCount: number;
  isFirstSave: boolean;
}): string[] {
  const earned: string[] = [];

  if (input.isFirstSave) earned.push("first_step");
  if (input.streakCount >= 3) earned.push("streak_3");
  if (input.streakCount >= 7) earned.push("streak_7");
  if (input.streakCount >= 30) earned.push("streak_30");
  if (input.carbonScore >= 80) earned.push("low_footprint");
  if (input.food === "veg") earned.push("veg_week");
  if (input.hasGoal) earned.push("goal_setter");
  if (input.goalMetThisWeek) earned.push("goal_achiever");
  if (input.profileCount >= 2) earned.push("multi_profile");

  return earned;
}
