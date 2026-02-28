# সমকাল রিডিজাইন (Samakal Redesign) - বিকাশকারী নির্দেশিকা (Developer Guide)

এই রিপোজিটরিটি বাংলাদেশের অন্যতম শীর্ষস্থানীয় নিউজ পোর্টাল **সমকাল (Samakal)**-এর সম্পূর্ণ নতুন, আধুনিক এবং দ্রুতগতির ফ্রন্টএন্ড ও ব্যাকএন্ড আর্কিটেকচার।

পুরনো লিগ্যাসি (PHP/Laravel) সিস্টেম থেকে বের হয়ে এসে সম্পূর্ণ একটি আধুনিক, স্কেলেবল এবং SEO-বান্ধব আর্কিটেকচার দাঁড় করানো হয়েছে। একজন নতুন ডেভেলপার হিসেবে প্রজেক্টটি বুঝে নিতে এই ডকুমেন্টটি আপনাকে A-to-Z সাহায্য করবে।

---

## 🛠 প্রযুক্তি স্ট্যাক (Tech Stack)

এই প্রজেক্টটি আধুনিক ওয়েব ডেভেলপমেন্টের সেরা টুলস দিয়ে তৈরি:

- **ফ্রেমওয়ার্ক:** Next.js 16.1 (App Router, Turbopack)
- **ভাষা:** TypeScript
- **স্টাইলিং:** Vanilla CSS (CSS Modules) + TailwindCSS (শুধুমাত্র ইউটিলিটির জন্য)
- **উইজেট ও অ্যানিমেশন:** Framer Motion (Glassmorphism, Stagger effects)
- **ডেটাবেইজ:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **অথেনটিকেশন:** NextAuth.js (v5) - Google OAuth & Credentials
- **এডিটর:** TipTap (Rich Text Editor for Admin)
- **ইমেজ প্রসেসিং:** `wsrv.nl` (Image Proxy Server for CDN caching) + Next.js `<Image>`

---

## 🔄 পুরনো সাইট বনাম নতুন সাইট (Old vs New Architecture)

| ফিচার | পুরনো সাইট (Laravel) | নতুন সাইট (Next.js) |
| --- | --- | --- |
| **রেন্ডারিং** | Server-Side Rendering (PHP) | React Server Components (RSC) + Static Generation |
| **ডেটাবেইজ** | MySQL (Monolithic) | PostgreSQL (Neon - Serverless & Scalable) |
| **ডিজাইন ল্যাঙ্গুয়েজ** | Flat, legacy design | Glassmorphism, Dynamic Gradients, Micro-animations |
| **পারফরম্যান্স** | ধীরগতির পেজ লোড | Turbopack-এর কারণে ইনস্ট্যান্ট নেভিগেশন |
| **ইউজার এক্সপেরিয়েন্স** | রিফ্রেশ-নির্ভর | SPA-like smooth transitions |

---

## 🏗 কিভাবে কাজ করে? (System Architecture)

প্রজেক্টটি মূলত তিনটি প্রধান স্তরে (Layers) বিভক্ত:

1. **ফ্রন্টএন্ড (Frontend React Components):** `src/frontend/` ফোল্ডারে সমস্ত UI কম্পোনেন্ট থাকে। এটি Server Components এবং Client Components-এর মিশ্রণ।
2. **ব্যাকএন্ড ও এপিআই (Backend & API Routes):** `src/app/api/` ফোল্ডারে API রুটস এবং `src/backend/lib/` এ ডেটা ফেচিং লজিক (Custom Server Actions) থাকে।
3. **ডেটাবেজ ও সিঙ্ক (Prisma & Sync Pipeline):** যেহেতু সমকালের প্রোডাকশন ডেটাবেইজ আলাদা (Laravel), আমরা একটি **Sync Webhook (`/api/sync`)** তৈরি করেছি যা পুরনো সাইট থেকে ডেটা এনে আমাদের PostgreSQL-এ সেভ করে।

## ৩. Sync Script (Cron / Webhook)

যেহেতু সমকালের প্রোডাকশন DB-তে সরাসরি কানেক্ট করা যাবে না (বা রিকমেন্ডেড নয়), আমরা একটি Sync Service বানাবো।

**করণীয়:**

1. সমকালের Laravel সাইটে একটি ছোট API Endpoint তৈরি করা যা latest articles JSON ফরম্যাটে রিটার্ন করবে।
2. গিটহাব একশন বা Vercel Cron ব্যবহার করে প্রতি মিনিটে আমাদের `Sync Script` রান করা।
3. স্ক্রিপ্টটি নতুন আর্টিকেলগুলো নিয়ে আমাদের PostgreSQL (Neon)-এ ইনসার্ট করবে।

## ৪. ধাপে ধাপে বাস্তবায়ন (Implementation Steps)

---

## 🎨 ডিজাইন সিস্টেম (Design System)

ডিজাইনের ক্ষেত্রে এই প্রজেক্টে **"Readability and Visual Excellence"**-কে সর্বোচ্চ গুরুত্ব দেওয়া হয়েছে।

- **Glassmorphism:** মেগা মেনু, স্টিকি হেডার এবং কিছু কার্ডে গ্লাসমরফিজম (অর্ধ-স্বচ্ছ, ব্লার ব্যাকগ্রাউন্ড) ব্যবহার করা হয়েছে।
- **CSS Variables:** `src/app/globals.css` ফোল্ডারে `:root` ভ্যারিয়েবলের মাধ্যমে কালার থিম (যেমন: `--color-brand-red`, `--color-surface`) কন্ট্রোল করা হয়।
- **Responsive Layouts:** সাইটটি সম্পূর্ণ মোবাইল-ফার্স্ট। `MobileMenu.tsx`, `Sidebar.tsx` ইত্যাদি স্ক্রিন সাইজ অনুযায়ী রেন্ডার হয়।

---

## 📦 প্রধান মডিউলসমূহ (Core Modules)

প্রজেক্টের ফোল্ডার স্ট্রাকচার:

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── (main)/           # পাবলিক সাইট (Home, Category, Article pages)
│   ├── admin/            # এডমিন ড্যাশবোর্ড
│   └── api/              # API Endpoints (Sync, Auth)
├── backend/              # ডাটাবেইজ ও বিজনেস লজিক
│   ├── lib/              # Prisma client, Fetching Logic (actions)
│   ├── prisma/           # Schema.prisma ও Migrations
│   └── scripts/          # Scrapers & Cron jobs (Data sync etc.)
├── frontend/             # UI Components
│   └── components/       # Header, Footer, NewsCard, Sidebar ইত্যাদি
└── middleware.ts / proxy.ts # Edge Routing ও SEO Redirects
```

---

## SEO এবং লিগ্যাসি রিডাইরেক্ট (Crucial for Migration)

সমকালের লক্ষাধিক পুরনো আর্টিকেল গুগলে ইনডেক্স করা আছে। সাইট মাইগ্রেশনের সময় **SEO Ranking** ধরে রাখতে একটি শক্তিশালী

### Step 1: Middleware & Category Route Mapping

- `src/proxy.ts` তৈরি করা (middleware.ts থেকে মাইগ্রেট করা)।
- `categoryMap` ডিকশনারি দিয়ে `/international` -> `/world`, `/whole-country` -> `/saradesh` রিডাইরেক্ট কনফিগার করা।

### Step 2: Article ID Lookup Logic

**আর্টিকেল আইডি লুকআপ:** পুরনো আর্টিকেলের URL-এ থাকা আইডি (যেমন: `.../article/1255`) ধরে আমাদের `proxy.ts` এজ-এপিআই কলের মাধ্যমে নতুন UUID বের করে এবং ইউজারকে নতুন পেজে রিডাইরেক্ট করে।
3.  **Sync Pipeline (`/api/sync`):** পুরনো CMS থেকে ডেটা আসার সময় পুরনো `id`-কে আমাদের `News` টেবিলের `public_id` হিসেবে সেভ করা হয় ইউনিক আইডেন্টিফায়ার হিসেবে।

---

## ⚙️ লোকাল সেটআপ (How to Setup & Run)

নতুন ডেভেলপার হিসেবে প্রজেক্ট রান করতে নিচের ধাপগুলো অনুসরণ করুন:

### ১. রিপোজিটরি ক্লোন ও প্যাকেজ ইনস্টল

```bash
git clone <repository-url>
cd samakal-redesign
npm install
```

### ২. এনভায়রনমেন্ট ভেরিয়েবল (.env)

প্রজেক্টের রুটে একটি `.env.local` ফাইল তৈরি করুন এবং নিচের ক্রেডেনশিয়ালগুলো বসান:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint/?sslmode=require"

# NextAuth (Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-generate-random-string"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Sync Webhook Secret (For data ingestion)
SYNC_SECRET="samakal-sync-secret-2026-xYz"
```

### ৩. ডেটাবেইজ ইনিশিয়ালাইজ (Prisma)

যেহেতু প্রজেক্টটি Prisma ব্যবহার করে, ডেটাবেস স্কিমা সিঙ্ক করতে হবে:

```bash
npx prisma generate
npx prisma db push
```

### ৪. ডেভেলপমেন্ট সার্ভার চালু করা

```bash
npm run dev
```

সার্ভার চালু হলে ব্রাউজারে `http://localhost:3000` এ যান।
*নোট: Next.js 16.1 Turbopack ব্যবহার করায় প্রথমবার পেজ লোড হতে একটু সময় লাগতে পারে, এরপর রকেটের মতো স্পিড পাবেন।*

---

## 🧪 কাস্টম স্ক্রিপ্টস এবং টেস্টিং

যেহেতু পুরনো সাইট থেকে ডেটা আনা একটা বড় চ্যালেঞ্জ, `src/backend/scripts/` এর ভেতর কিছু গুরুত্বপূর্ণ টুলস আছে:

- **ডেটা স্ক্র্যাপার:** `npm run scrape` (সমকালের বর্তমান সাইট থেকে ডামি ডেটা আনার জন্য)
- **সিঙ্ক টেস্টার:** `node src/backend/scripts/debug/test-sync-redirect.js` (Webhook এবং 301 Redirect ঠিকমতো কাজ করছে কিনা চেক করতে)

---

## ⚠️ মেনে চলার মতো কিছু নিয়ম (Developer Rules)

1. **Readability > Cleverness:** কোড এমনভাবে লিখুন যেন অন্য ডেভেলপার সহজেই বুঝতে পারে। অপ্রয়োজনীয় জটিলতা (magic one-liners) এড়িয়ে চলুন।
2. **Vanilla CSS First:** প্রজেক্টে CSS Modules কে প্রাধান্য দেওয়া হয়েছে, Tailwind শুধুমাত্র হেল্পার হিসেবে ব্যবহৃত।
3. **Console Errors:** ব্রাউজার কনসোলে যেন কোনো React Hydration Error বা Image Missing Warning না থাকে সেদিকে খেয়াল রাখবেন।
4. **Vercel vs Cloudflare:** Vercel-এর কিছু স্পেসিফিক মডিউল (`@vercel/blob` বা `next/image` optimizer) ব্যবহার করা হয়েছে। ভবিষ্যতে Cloudflare-এ ডিপ্লয় করলে কনফিগারেশন চেঞ্জ করতে হতে পারে।

---

## 🌐 ডিপ্লয়মেন্ট গাইডলাইন (Deployment Guidelines)

এই প্রজেক্টটি Vercel এবং Cloudflare, উভয় প্ল্যাটফর্মেই ডিপ্লয় করা সম্ভব, তবে কিছু স্পেসিফিক কনফিগারেশন মাথায় রাখতে হবে:

### Vercel Deployment

Vercel-এ ডিপ্লয় করা সবচেয়ে সহজ, কারণ এটি Next.js-এর নেটিভ হোস্ট।

- `Settings > Environment Variables`-এ গিয়ে `.env.local` এর সব ভ্যারিয়েবল বসাতে হবে।
- **Important:** Vercel-এর Image Optimization লিমিট ও সমকালের সার্ভারের হটলিংক ব্লকের কারণে `src/backend/utils/image.ts` এ **`wsrv.nl`** প্রক্সি ব্যবহার করা হয়েছে। এটি `next.config.mjs` এ bypass করা আছে।

### Cloudflare Pages / Workers

যদি ট্রাফিক কস্ট কমাতে Cloudflare ব্যবহার করা হয়:

- `next-auth` এবং `Prisma` Edge runtime-এ ঠিকমতো কাজ করে কিনা নিশ্চিত করতে হবে (Prisma Accelerate লাগতে পারে)।
- `@vercel/blob` (যদি ইমেজ আপলোডে ব্যবহৃত হয়) রিপ্লেস করে Cloudflare R2 স্টোরেজ অ্যাড করতে হবে।

---

## 💾 ডাটাবেজ মাইগ্রেশন এবং সিডিং (Database Operations)

নতুন কোনো ডেভেলপার জয়েন করলে বা ডাটাবেজে নতুন ফিল্ড অ্যাড করলে Prisma ডাটাবেজ আপডেট করতে হবে:

- **Migration Development:** যদি স্কিমা চেঞ্জ করেন, ডাটাবেজ আপডেট করতে:

  ```bash
  npx prisma migrate dev --name your_change_name
  ```

- **Seeding Data:** ডাটাবেজে ডামি ক্যাটেগরি বা ডিফল্ট অ্যাডমিন ইউজার তৈরি করতে:

  ```bash
  npx prisma db seed
  ```

  *(নোট: `seed.ts` ফাইলটি `src/backend/prisma/` ফোল্ডারে কনফিগার করা আছে)*

---

## 📰 এডিটরিয়াল প্যানেল (Admin Panel Access)

নিউজ পাবলিশ করা এবং এডিট করার জন্য এই সাইটের নিজস্ব একটি অ্যাডমিন ড্যাশবোর্ড রয়েছে।

- **অ্যাক্সেস URL:** `http://localhost:3000/admin`
- **লগইন:** `next-auth` দিয়ে সুরক্ষিত। Google OAuth বা Credentials দিয়ে লগইন করা যায়।
- **Tiptap Editor:** খবর লেখার জন্য `src/frontend/components/Editor/` এ একটি কাস্টম রিচ-টেক্সট এডিটর (Tiptap) বানানো হয়েছে, যা ইমেজ আপলোড ও ফরম্যাটিং সাপোর্ট করে।
- **পাবলিশিং ফ্লো:** ড্রাফট সেভ করা, শিডিউল পাবলিশিং এবং লাইভ প্রিভিউ ফিচার এখানে ইন্টিগ্রেট করা আছে।

---

## ⚡ ক্যাশিং মেকানিজম (Caching & Revalidation)

Next.js-এর শক্তিশালী ক্যাশিং সিস্টেম সাইটকে রকেটের মতো স্পিড দেয়, তবে ডাইনামিক নিউজ সাইট হওয়ায় ক্যাশ ভাঙার মেকানিজম বুঝতে হবে:

- **Static Cache (ISR):** হোমপেজ এবং ক্যাটেগরি পেজগুলো Incremental Static Regeneration-এর সাহায্যে ক্যাশ করা হয়।
- **On-demand Revalidation:** কোনো নতুন আর্টিকেল পাবলিশ হলে বা अपडेट হলে, অ্যাডমিন প্যানেল থেকে `revalidateTag` বা `revalidatePath` ট্রিগার হয়, যাতে ভিজিটররা তাৎক্ষণিকভাবে আপডেট দেখতে পান।
- `fetch` রিকোয়েস্টের সাথে `{ next: { revalidate: 60 } }` বা ট্যাগ ব্যবহার করা হয়েছে।

---

## 📞 লাইসেন্স এবং মেইনটেন্যান্স (Contact & Support)

- কোনো মেজর সিস্টেম ক্র্যাশ হলে, লগ চেক করার জন্য Vercel Dashboard-এর Logs ট্যাব অথবা Neon Database-এর Query Logs মনিটর করতে হবে।
- কোনো এপিআই (যেমন: Sync API) কাজ না করলে প্রথমে `.env`-এ `SYNC_SECRET` ঠিক আছে কিনা চেক করতে হবে।

---
*Developed & Designed by Abisheak AI Assistant.* 🚀
