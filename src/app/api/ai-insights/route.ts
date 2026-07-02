import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, userData } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const weekStart = getWeekStart();

    // Check cache first — avoids burning Gemini quota on every page visit
    const { data: cached } = await supabase
      .from("ai_insights")
      .select("insight_text")
      .eq("user_id", userId)
      .eq("week_start", weekStart)
      .maybeSingle();

    if (cached) {
      return NextResponse.json({ insight: cached.insight_text, cached: true });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        insight:
          "AI insights aren't configured yet. Add GEMINI_API_KEY to .env.local to enable this.",
        cached: false,
      });
    }

    const { data: logs } = await supabase
      .from("emission_logs")
      .select("log_date, total_emission")
      .eq("user_id", userId)
      .order("log_date", { ascending: true })
      .limit(14);

    const history = (logs || [])
      .map((l) => `${l.log_date}: ${Number(l.total_emission).toFixed(1)}kg`)
      .join(", ");

    const prompt = `You are an AI climate coach. Based on this user's real data,
write a short, encouraging weekly insight (3-4 sentences max). Be specific,
mention real numbers, and give one concrete actionable tip.

Name: ${userData?.name || "User"}
Transport: ${userData?.transport}, Distance: ${userData?.distance}km/week
Electricity: ${userData?.electricity}kWh/week
Food: ${userData?.food}
Recent daily emission history (date: kg CO2): ${history || "no history yet"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      return NextResponse.json({
        insight: "Couldn't generate an insight right now. Try again later.",
        cached: false,
      });
    }

    const data = await response.json();
    const insightText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Couldn't generate an insight right now.";

    await supabase.from("ai_insights").insert({
      user_id: userId,
      insight_text: insightText,
      week_start: weekStart,
    });

    return NextResponse.json({ insight: insightText, cached: false });
  } catch (err) {
    console.error("AI insights route error:", err);
    return NextResponse.json(
      { insight: "Something went wrong generating your insight." },
      { status: 200 }
    );
  }
}
