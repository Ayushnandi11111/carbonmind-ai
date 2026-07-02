import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";

export async function POST(req: NextRequest) {
  try {
    const { message, userData } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: "AI is not configured yet. Add GEMINI_API_KEY to .env.local." },
        { status: 200 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing 'message' in request body." },
        { status: 400 }
      );
    }

    const transportEmission =
      userData?.transport === "car"
        ? userData.distance * 0.21
        : userData?.transport === "bus"
        ? userData.distance * 0.1
        : (userData?.distance || 0) * 0.02;

    const electricityEmission = (userData?.electricity || 0) * 0.5;

    const foodEmission =
      userData?.food === "veg" ? 10 : userData?.food === "mixed" ? 25 : 45;

    const totalEmission = Math.round(
      transportEmission + electricityEmission + foodEmission
    );

    const systemContext = `You are an AI Climate Coach inside the CarbonMind AI app.
Speak briefly, warmly, and practically — 2-4 short sentences max, no long essays.
Here is the user's real current data, use it to personalize your answer:
- Name: ${userData?.name || "User"}
- Transport mode: ${userData?.transport || "unknown"}
- Distance travelled: ${userData?.distance ?? "unknown"} km
- Electricity usage: ${userData?.electricity ?? "unknown"} kWh
- Food preference: ${userData?.food || "unknown"}
- Estimated total emission: ${totalEmission} kg CO2

User's question: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemContext }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { reply: "I'm having trouble reaching the AI service right now." },
        { status: 200 }
      );
    }

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { reply: "Something went wrong on the server. Please try again." },
      { status: 200 }
    );
  }
}
