# Required APIs & Tokens

## Overview

This project requires the following external APIs and tokens to function. All values are stored in `.env.local` at the project root.

---

## 1. Gemini API Key

| Variable | `GEMINI_API_KEY` |
|----------|------------------|
| Used by | `@google/generative-ai` |
| Required for | AI chat / generation features |

### How to get one
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **Get API Key**
3. Create or select a Google Cloud project
4. Copy the generated API key

### How to add
```bash
# In .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 2. Supabase (URL & Anon Key)

| Variable | `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
|----------|-------------------------------------------------------------|
| Used by | `@supabase/supabase-js` |
| Required for | Database, auth, storage |

### How to get them

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to **Project Settings > API**
4. Copy the **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
5. Copy the **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### How to add

```bash
# In .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Setup Process

1. Copy `.env.local.example` (if it exists) to `.env.local`, or create `.env.local` manually.
2. Fill in each variable with the values obtained from the steps above.
3. Restart the dev server:

   ```bash
   npm run dev
   ```
   
4. Verify the keys are loaded (the app will log or indicate if a key is missing).

---
