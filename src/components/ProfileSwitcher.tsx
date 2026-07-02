"use client";

import { useState } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ProfileSwitcher() {
  const { profiles, userData, switchProfile, createProfile } = useUser();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  if (!userData) return null;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await createProfile(newName.trim());
    setNewName("");
    setAdding(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm w-full"
      >
        <Users size={15} className="text-green-400 shrink-0" />
        <span className="flex-1 text-left truncate">
          {userData.profileName}
        </span>
        <ChevronDown size={14} className="text-zinc-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-[#0B1A12] border border-white/10 rounded-xl p-2 z-50 shadow-xl">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={async () => {
                await switchProfile(p.id);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                p.id === userData.id
                  ? "bg-green-500/15 text-green-400"
                  : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              {p.profileName}
            </button>
          ))}

          <div className="border-t border-white/10 mt-2 pt-2">
            {adding ? (
              <div className="flex gap-1.5 px-1">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Profile name"
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-green-500/40"
                />
                <button
                  onClick={handleAdd}
                  className="px-2 py-1.5 rounded-lg bg-green-500 text-black text-xs font-bold"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 transition"
              >
                <Plus size={14} />
                Add Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
