"use client";

import { useEffect, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

type Message = { role: "user" | "ai"; text: string };

export default function AIAssistant() {
  const { userData } = useUser();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! Ask me anything about reducing your carbon footprint based on your own data.",
    },
  ]);

  useEffect(() => {
    async function loadHistory() {
      if (!userData?.id) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: true })
        .limit(50);

      if (!error && data && data.length > 0) {
        setMessages(
          data.map((m) => ({ role: m.role as "user" | "ai", text: m.content }))
        );
      }
    }

    loadHistory();
  }, [userData?.id]);

  async function handleSend() {
    if (!input.trim() || loading || !userData) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    // Persist user message
    await supabase.from("chat_messages").insert({
      user_id: userData.id,
      role: "user",
      content: userMessage,
    });

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          userData,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);

      await supabase.from("chat_messages").insert({
        user_id: userData.id,
        role: "ai",
        content: reply,
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/4 backdrop-blur-xl border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-green-400" />
        <h2 className="text-sm font-semibold">AI Climate Coach</h2>
        <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
              m.role === "ai"
                ? "bg-green-500/10 border border-green-500/20 text-green-200"
                : "bg-white/5 border border-white/8 text-zinc-300 text-right"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-xs text-zinc-400 px-2">
            AI is analyzing your carbon impact...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask your AI coach..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-green-500/40"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-8 h-8 rounded-xl bg-green-500 hover:bg-green-400 transition flex items-center justify-center shrink-0 disabled:opacity-50"
        >
          <Send size={13} className="text-black" />
        </button>
      </div>
    </div>
  );
}
