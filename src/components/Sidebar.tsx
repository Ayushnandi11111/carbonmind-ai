"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  BarChart2,
  Sparkles,
  FileText,
  Settings,
  Target,
  Trophy,
  Award,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import ProfileSwitcher from "@/components/ProfileSwitcher";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BarChart2, label: "Analysis", href: "/analysis" },
  { icon: Sparkles, label: "Recommendations", href: "/recommendations" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Award, label: "Achievements", href: "/achievements" },
  { icon: Calendar, label: "Monthly Recap", href: "/recap" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur-2xl">
        <Link
          href="/"
          className="relative h-11 w-44 overflow-hidden rounded-xl border border-green-500/25 bg-white/5 shadow-lg shadow-green-500/10"
          aria-label="CarbonMind AI dashboard"
        >
          <Image
            src="/logo.png"
            alt="CarbonMind AI"
            fill
            sizes="176px"
            className="object-cover object-center scale-125"
            priority
          />
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/*
        Mobile-open backdrop: dims + captures clicks outside the drawer.
        Only rendered when the mobile drawer is open, and only below `sm`.
      */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="sm:hidden fixed inset-0 z-10 bg-black/60 backdrop-blur-sm"
        />
      )}

      <aside
        className={`w-64 shrink-0 flex-col border-r border-white/10 bg-black/30 backdrop-blur-2xl px-5 py-8
        sm:static sm:z-auto sm:flex
        ${open ? "fixed inset-y-0 left-0 z-20 flex h-screen" : "hidden"}`}
      >
        {/* Logo (desktop only, mobile shows it in top bar) */}
        <Link
          href="/"
          className="group hidden h-18 w-full items-center overflow-hidden rounded-2xl border border-green-500/25 bg-white/5 shadow-xl shadow-green-500/10 transition hover:border-green-400/40 hover:bg-white/8 sm:flex"
          aria-label="CarbonMind AI dashboard"
        >
          <div className="relative h-full w-full">
            <Image
              src="/logo.png"
              alt="CarbonMind AI"
              fill
              sizes="216px"
              className="object-cover object-center scale-125 transition duration-300 group-hover:scale-[1.32]"
              priority
            />
          </div>
        </Link>

        {/* Profile Switcher */}
        <div className="mb-6">
          <ProfileSwitcher />
        </div>

        {/* AI Status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-300">Gemini Agent Active</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-green-500/15 border border-green-500/25 text-white shadow-lg shadow-green-500/5"
                    : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={17} />
                <span className="flex-1">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
