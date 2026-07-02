<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=34&duration=3000&pause=1000&color=00FF99&center=true&vCenter=true&width=900&lines=🌍+CarbonMind+AI;⚡+AI-Powered+Carbon+Footprint+Tracker;🌱+Track+•+Analyze+•+Reduce+Your+CO₂+Impact;🤖+Gemini+AI+Climate+Coach" alt="Typing SVG" />

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)

<br/>

**Track • Analyze • Reduce — Your personal AI-powered sustainability companion**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00ff88,50:00d9ff,100:0f172a&height=120&section=header&text=CarbonMind+AI&fontSize=40&fontColor=fff&animation=fadeIn" />

</div>

---

## 🌟 Overview

**CarbonMind AI** is a full-stack, AI-powered sustainability dashboard that helps individuals track their daily lifestyle habits — from transportation and electricity to food, water, shopping, and flights — calculate their carbon footprint, receive intelligent AI-driven recommendations, set emission targets, earn achievement badges, and compare their impact against national and global benchmarks.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and powered by **Google Gemini AI** for intelligent insights and a conversational climate coach, with **Supabase** for real-time data persistence.

---

## ✨ Features

<table>
<tr>
<td width="33%" align="center">

### 🤖 AI & Intelligence
• 🧠 AI Weekly Insights (Gemini 2.0)<br/>
• 💬 Climate Coach Chat Assistant<br/>
• 📈 Carbon Score Prediction<br/>
• 💡 Smart Eco Recommendations<br/>
• 📊 Behaviour Analysis Engine<br/>
• 🎯 Personalized Sustainability Tips

</td>
<td width="33%" align="center">

### 📊 Dashboard & Analytics
• 🎯 Carbon Score Gauge (0–100)<br/>
• 📉 7-Day Emission Trends (Area Chart)<br/>
• 🍩 Donut Breakdown by Category<br/>
• 📊 Category Comparison (Bar Chart)<br/>
• 🏆 Weekly Sustainability Challenges<br/>
• ⚡ Real-Time Stats & Live Data

</td>
<td width="33%" align="center">

### 🎮 Gamification & Goals
• 🏅 9 Achievable Badges & Trophies<br/>
• 🔥 Daily Streak Tracking<br/>
• 🎯 Weekly/Monthly Emission Goals<br/>
• 📈 Progress Bars & Visual Feedback<br/>
• 🥇 Anonymous Leaderboard (200 users)<br/>
• 🌍 Benchmark vs India & Global Averages

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" align="center">

### 📁 Data & Export
• 📄 Downloadable PDF Reports<br/>
• 📝 TXT Report Export<br/>
• 📊 CSV Emission History Export<br/>
• 📅 Monthly Auto-Generated Recap<br/>
• 📋 Last 30 Days Trend Analysis<br/>
• 🔄 Supabase Realtime Sync

</td>
<td width="50%" align="center">

### 🛠️ User Experience
• 👨‍👩‍👧‍👦 Multi-Profile Support (Family)<br/>
• 🌙 Dark/Light Theme Toggle<br/>
• 📱 Responsive Sidebar Navigation<br/>
• 🚫 Offline Detection Banner<br/>
• 🆕 First-Time User Setup Modal<br/>
• ⚡ Loading Skeletons & Error Boundaries

</td>
</tr>
</table>

---

## 🖥️ Dashboard Preview

<p align="center">
  <i>Dashboard — Carbon Score Gauge, AI Insight, Charts & Stats</i>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:00ff88,100:0f172a&height=4&width=600" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Dashboard-Analytics-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/AI_Powered-Insights-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Real_Time-Live_Data-00D9FF?style=flat-square" />
</p>

<p align="center">
  <img src="/screenshots/dashboard-preview.png" alt="Dashboard Preview" width="800" />
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:00ff88,100:0f172a&height=4&width=600" />
</p>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CarbonMind AI                            │
│              Next.js 16 Full-Stack App                      │
├──────────────┬──────────────────────────────┬───────────────┤
│   Frontend   │      API Routes              │   Database    │
│  (React 19)  │   (Next.js Serverless)       │  (Supabase)   │
├──────────────┼──────────────────────────────┼───────────────┤
│  • Dashboard  │  POST /api/ai              │  • users       │
│  • Analysis   │  POST /api/ai-insights     │  • emission_   │
│  • Goals      │                              │    logs       │
│  • Recommend  │     ┌──────────────┐        │  • chat_       │
│  • Achieve.   │     │   Google     │        │    messages   │
│  • Leaderboard│     │   Gemini     │        │  • goals       │
│  • Reports    │     │   2.0 Flash  │        │  • badges      │
│  • Settings   │     └──────────────┘        │  • ai_insights │
│  • Recap      │                              │               │
├──────────────┴──────────────────────────────┴───────────────┤
│                    Core Engine (src/lib/)                    │
│  emissions.ts │ badges.ts │ benchmarks.ts │ device.ts      │
│  supabase.ts  │ csvExport.ts │ weeklyChallenge.ts           │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Data Flow

```
  User Input ──► Emission Calculator ──► Carbon Score
       │                                      │
       ▼                                      ▼
  Daily Log (Supabase) ──────────► AI Engine (Gemini)
       │                                      │
       ▼                                      ▼
  Dashboard Charts ◄──── Real Time ◄── Insights + Recommendations
       │
       ▼
  Goals • Badges • Leaderboard • Reports
```

---

## 🧮 Carbon Calculation Engine

| Category | Factor | Unit |
|----------|--------|------|
| 🚗 Car | 0.21 kg CO₂ | per km |
| 🚌 Bus | 0.10 kg CO₂ | per km |
| 🚲 Bike | 0.02 kg CO₂ | per km |
| ⚡ Electricity | 0.50 kg CO₂ | per kWh |
| 🥗 Vegetarian | 10 kg CO₂ | per week |
| 🥘 Mixed Diet | 25 kg CO₂ | per week |
| 🥩 Non-Veg | 45 kg CO₂ | per week |
| 💧 Water | 0.0003 kg CO₂ | per litre |
| 🛍️ Shopping | 0.01 kg CO₂ | per ₹ spent |
| ✈️ Flights | 250 kg CO₂ | per flight/yr |

**Carbon Score:** `max(0, min(100, round(100 - totalEmission / 2)))`

---

## 🏅 Achievements & Badges

| Badge | Title | How to Unlock |
|-------|-------|--------------|
| 🌟 | **First Step** | Save your first profile |
| 🔥 | **Building Momentum** | 3-day check-in streak |
| ⚡ | **Week Warrior** | 7-day check-in streak |
| 💪 | **Habit Master** | 30-day check-in streak |
| 🌿 | **Eco Champion** | Carbon score ≥ 80 |
| 🎯 | **Goal Setter** | Set an active emission goal |
| 🏆 | **Target Hit** | Stay under your weekly goal |
| 🥗 | **Plant Powered** | Vegetarian diet preference |
| 👨‍👩‍👧‍👦 | **Family Footprint** | 2+ profiles on one device |

---

## ⚙️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,ts,nodejs,supabase,vercel,git,github,vscode" alt="Tech Stack Icons" />
</p>

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) — App Router, API Routes |
| **UI Library** | [React 19](https://react.dev) — `use client` components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com), `tw-animate-css`, `tailwind-merge` |
| **Components** | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Charts** | [Recharts 3](https://recharts.org) — Area, Pie, Bar charts |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion) |
| **PDF Export** | [jsPDF 4](https://github.com/parallax/jsPDF) |
| **Database** | [Supabase](https://supabase.com) — PostgreSQL + Realtime |
| **AI / ML** | [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/) |
| **Linting** | ESLint v9 + `eslint-config-next` |
| **Package Mgr** | npm |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Supabase Account** — for database & realtime
- **Google Gemini API Key** — for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/carbonmind-ai.git

# Navigate to project
cd carbonmind-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local   # Then edit with your keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI (required for AI Chat & Insights)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (required for data persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Lint the codebase |

---

## 📁 Project Structure

```
carbonmind-ai/
├── public/                       # Static assets (logo, svg icons)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Dashboard (homepage)
│   │   ├── layout.tsx           # Root layout (Sidebar + Header)
│   │   ├── analysis/            # Carbon analysis page
│   │   ├── goals/               # Emission goal setting
│   │   ├── recommendations/     # AI recommendations
│   │   ├── achievements/        # Badges & trophies
│   │   ├── leaderboard/         # Anonymous rankings
│   │   ├── reports/             # Downloadable reports
│   │   ├── recap/               # Monthly recap
│   │   ├── settings/            # Profile & data editor
│   │   └── api/
│   │       ├── ai/              # Climate Coach (Gemini)
│   │       └── ai-insights/     # Weekly AI Insights (cached)
│   ├── components/              # React components
│   │   ├── CarbonGauge.tsx      # SVG score gauge
│   │   ├── EmissionChart.tsx    # Area chart (7-day)
│   │   ├── EmissionsDonut.tsx   # Pie chart breakdown
│   │   ├── CategoryComparison.tsx # Bar chart comparison
│   │   ├── WeeklyInsight.tsx    # AI insight display
│   │   ├── AIAssistant.tsx      # Chat widget
│   │   ├── BenchmarkComparison.tsx # India/Global benchmarks
│   │   ├── ... (21 components)
│   ├── context/                 # React context
│   │   ├── UserContext.tsx      # User state + profiles
│   │   └── ThemeContext.tsx     # Dark/light theme
│   ├── data/                    # Mock data (placeholder)
│   └── lib/                     # Utilities
│       ├── emissions.ts         # Core calculation engine
│       ├── supabase.ts          # DB client + types
│       ├── badges.ts            # Badge definitions
│       ├── useBadges.ts         # Badge evaluation hook
│       ├── benchmarks.ts        # Reference emission data
│       ├── csvExport.ts         # CSV download
│       ├── device.ts            # Device ID generation
│       ├── ToastContext.tsx     # Toast notification system
│       ├── weeklyChallenge.ts   # Weekly challenge logic
│       └── useRealtimeUser.ts   # Supabase Realtime hook
├── components/ui/               # shadcn/ui primitives
├── docs/                        # Documentation assets
├── frontend/                    # Future standalone frontend
├── backend/                     # Future FastAPI backend
├── .env.local                   # Environment variables
├── AGENTS.md                    # Next.js version info
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
└── package.json                 # Dependencies & scripts
```

---

## 🗺️ Roadmap

| Status | Feature |
|--------|---------|
| ✅ | Dashboard with live analytics & charts |
| ✅ | Carbon footprint calculator |
| ✅ | AI-powered weekly insights (Gemini) |
| ✅ | AI Climate Coach chat assistant |
| ✅ | Personalized recommendations |
| ✅ | Weekly sustainability challenges |
| ✅ | Goal setting & progress tracking |
| ✅ | Badge/achievement gamification |
| ✅ | Anonymous leaderboard |
| ✅ | Dark/light theme |
| ✅ | Multi-profile support (family) |
| ✅ | Offline detection |
| ✅ | Report exports (PDF, TXT, CSV) |
| ✅ | Monthly recap |
| ✅ | Streak tracking |
| ✅ | Benchmark comparison (India/Global) |
| 🔄 | Authentication system |
| 🔄 | Advanced Supabase integration |
| 🔄 | Google Maps route emission tracking |
| 🔄 | Carbon offset marketplace |
| 🔄 | Mobile app (React Native) |
| 🔄 | FastAPI Python backend |
| 🔄 | Social sharing & community challenges |
| 🔄 | Gamification leaderboards & seasons |

---

## 📈 GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub Stats" />
  &nbsp;
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=YOUR_USERNAME&theme=tokyonight&hide_border=true" alt="GitHub Streak" />
</p>

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-idea`)
3. Make changes and run `npm run build` to verify
4. Commit and push
5. Open a Pull Request

---

## 📄 License

Open source under the MIT License — feel free to use, modify, and contribute.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org) — The React framework
- [shadcn/ui](https://ui.shadcn.com) — Beautifully designed components
- [Supabase](https://supabase.com) — Open source Firebase alternative
- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI capabilities
- [Recharts](https://recharts.org) — Composable charting library
- [Lucide Icons](https://lucide.dev) — Beautiful icon set
- [Framer Motion](https://www.framer.com/motion) — Animation library

---

<div align="center">

## 🌍 Build Today. Save Tomorrow.

### Made with 💚 by **Ayush Nandi**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Ayush_Nandi-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME)
[![Project](https://img.shields.io/badge/CarbonMind-AI-00FF88?style=for-the-badge)](https://github.com/YOUR_USERNAME/carbonmind-ai)

<br/>

_Every ton of CO₂ reduced brings us closer to a sustainable future._

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00ff88,50:00d9ff,100:0f172a&height=120&section=footer" />
        
</div>

<!-- auto: tiny readme bump -->