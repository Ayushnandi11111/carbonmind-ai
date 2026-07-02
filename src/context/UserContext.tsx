"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase, DbUser } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device";
import { calcTotalEmission, calcCarbonScore } from "@/lib/emissions";
import { awardEligibleBadges } from "@/lib/useBadges";
import { BadgeDef } from "@/lib/badges";

export type UserData = {
  id: string;
  profileName: string;
  name: string;
  transport: string;
  distance: number;
  electricity: number;
  food: string;
  water: number;
  shopping: number;
  flights: number;
  streakCount: number;
  lastCheckinDate: string | null;
};

type ContextType = {
  userData: UserData | null;
  loading: boolean;
  isNewUser: boolean;
  profiles: UserData[];
  setUserData: (data: Omit<UserData, "id" | "streakCount" | "lastCheckinDate">) => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  createProfile: (profileName: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  setNewBadgeCallback: (cb: (badge: BadgeDef) => void) => void;
};

const UserContext = createContext<ContextType | null>(null);

const ACTIVE_PROFILE_KEY = "carbon-active-profile-id";

function toUserData(row: DbUser): UserData {
  return {
    id: row.id,
    profileName: row.profile_name || "My Profile",
    name: row.name,
    transport: row.transport,
    distance: Number(row.distance),
    electricity: Number(row.electricity),
    food: row.food,
    water: Number(row.water || 0),
    shopping: Number(row.shopping || 0),
    flights: Number(row.flights || 0),
    streakCount: row.streak_count || 0,
    lastCheckinDate: row.last_checkin_date || null,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [profiles, setProfiles] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const newBadgeCallbackRef = useRef<((badge: BadgeDef) => void) | null>(null);
  const setNewBadgeCallback = (cb: (badge: BadgeDef) => void) => {
    newBadgeCallbackRef.current = cb;
  };

  async function loadUser() {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    const { data: rows, error } = await supabase
      .from("users")
      .select("*")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load user:", error.message);
      setLoading(false);
      return;
    }

    if (!rows || rows.length === 0) {
      setIsNewUser(true);
      setProfiles([]);
      setLoading(false);
      return;
    }

    const allProfiles = (rows as DbUser[]).map(toUserData);
    setProfiles(allProfiles);

    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const active =
      allProfiles.find((p) => p.id === activeId) || allProfiles[0];

    localStorage.setItem(ACTIVE_PROFILE_KEY, active.id);
    setUserDataState(active);
    setIsNewUser(false);
    await runStreakCheck(active);
    setLoading(false);
  }

  // Increments streak if last check-in was yesterday, resets if older,
  // does nothing if already checked in today.
  async function runStreakCheck(profile: UserData) {
    const today = new Date().toISOString().slice(0, 10);
    if (profile.lastCheckinDate === today) return;

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    const newStreak =
      profile.lastCheckinDate === yesterday ? profile.streakCount + 1 : 1;

    const { data: updated, error } = await supabase
      .from("users")
      .update({ streak_count: newStreak, last_checkin_date: today })
      .eq("id", profile.id)
      .select()
      .single();

    if (!error && updated) {
      const updatedData = toUserData(updated as DbUser);
      setUserDataState((prev) =>
        prev && prev.id === profile.id ? updatedData : prev
      );
      await checkAndAwardBadges(updatedData);
    }
  }

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserData = async (
    data: Omit<UserData, "id" | "streakCount" | "lastCheckinDate">
  ) => {
    const deviceId = getDeviceId();

    if (userData?.id) {
      const { data: updated, error } = await supabase
        .from("users")
        .update({
          profile_name: data.profileName,
          name: data.name,
          transport: data.transport,
          distance: data.distance,
          electricity: data.electricity,
          food: data.food,
          water: data.water,
          shopping: data.shopping,
          flights: data.flights,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userData.id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update user:", error.message);
        return;
      }

      const updatedData = toUserData(updated as DbUser);
      setUserDataState(updatedData);
      setProfiles((prev) =>
        prev.map((p) => (p.id === updatedData.id ? updatedData : p))
      );
      await checkAndAwardBadges(updatedData);
    } else {
      const { data: inserted, error } = await supabase
        .from("users")
        .insert({
          device_id: deviceId,
          profile_name: data.profileName || "My Profile",
          name: data.name,
          transport: data.transport,
          distance: data.distance,
          electricity: data.electricity,
          food: data.food,
          water: data.water,
          shopping: data.shopping,
          flights: data.flights,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to create user:", error.message);
        return;
      }

      const newUser = toUserData(inserted as DbUser);
      setUserDataState(newUser);
      setProfiles((prev) => [...prev, newUser]);
      setIsNewUser(false);
      localStorage.setItem(ACTIVE_PROFILE_KEY, newUser.id);
      await checkAndAwardBadges(newUser, true);
    }

    await logEmissionSnapshot(data);
  };

  async function logEmissionSnapshot(data: {
    transport: string;
    distance: number;
    electricity: number;
    food: string;
  }) {
    const userId = userData?.id;
    if (!userId) return;

    const transportEmission =
      data.transport === "car"
        ? data.distance * 0.21
        : data.transport === "bus"
        ? data.distance * 0.1
        : data.distance * 0.02;

    const electricityEmission = data.electricity * 0.5;

    const foodEmission =
      data.food === "veg" ? 10 : data.food === "mixed" ? 25 : 45;

    const totalEmission = transportEmission + electricityEmission + foodEmission;
    const today = new Date().toISOString().slice(0, 10);

    const { data: existingLog } = await supabase
      .from("emission_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("log_date", today)
      .maybeSingle();

    if (existingLog) {
      await supabase
        .from("emission_logs")
        .update({
          transport_emission: transportEmission,
          electricity_emission: electricityEmission,
          food_emission: foodEmission,
          total_emission: totalEmission,
        })
        .eq("id", existingLog.id);
    } else {
      await supabase.from("emission_logs").insert({
        user_id: userId,
        log_date: today,
        transport_emission: transportEmission,
        electricity_emission: electricityEmission,
        food_emission: foodEmission,
        total_emission: totalEmission,
      });
    }
  }

  // Checks current state against badge rules and awards anything newly earned.
  // If a newBadgeCallback was registered (via setNewBadgeCallback), each newly
  // earned badge is passed to it — used by the UI to show a toast.
  async function checkAndAwardBadges(profile: UserData, isFirstSave = false) {
    const totalEmission = calcTotalEmission({
      transport: profile.transport,
      distance: profile.distance,
      electricity: profile.electricity,
      food: profile.food,
      water: profile.water,
      shopping: profile.shopping,
      flights: profile.flights,
    }).total;

    const carbonScore = calcCarbonScore(totalEmission);

    const { data: activeGoal } = await supabase
      .from("goals")
      .select("target_emission")
      .eq("user_id", profile.id)
      .eq("active", true)
      .maybeSingle();

    const newBadges = await awardEligibleBadges({
      userId: profile.id,
      streakCount: profile.streakCount,
      carbonScore,
      food: profile.food,
      hasGoal: !!activeGoal,
      goalMetThisWeek: !!activeGoal && totalEmission <= activeGoal.target_emission,
      profileCount: profiles.length || 1,
      isFirstSave,
      flights: profile.flights,
      totalEmission,
      nationalAvgEmission: 70,
    });

    if (newBadges.length > 0 && newBadgeCallbackRef.current) {
      newBadges.forEach((b) => newBadgeCallbackRef.current?.(b));
    }
  }

  const switchProfile = async (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    setUserDataState(target);
    await runStreakCheck(target);
  };

  const createProfile = async (profileName: string) => {
    const deviceId = getDeviceId();

    const { data: inserted, error } = await supabase
      .from("users")
      .insert({
        device_id: deviceId,
        profile_name: profileName,
        name: profileName,
        transport: "car",
        distance: 0,
        electricity: 0,
        food: "mixed",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create profile:", error.message);
      return;
    }

    const newProfile = toUserData(inserted as DbUser);
    setProfiles((prev) => [...prev, newProfile]);
    localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id);
    setUserDataState(newProfile);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        isNewUser,
        profiles,
        setUserData,
        switchProfile,
        createProfile,
        refreshUserData: loadUser,
        setNewBadgeCallback,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}
