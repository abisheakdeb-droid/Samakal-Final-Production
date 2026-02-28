# Samakal Redesign - Developer Guide

This repository contains the completely new, modern, and high-performance frontend and backend architecture for **Samakal**, one of Bangladesh's leading news portals.

The project transitions away from the legacy PHP/Laravel system to a modern, scalable, and SEO-friendly architecture. This guide provides an A-to-Z overview to help new developers get started.

---

## 🛠 Tech Stack

Built with modern web development tools:

- **Framework:** Next.js 16.1 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (CSS Modules) + TailwindCSS (for utility-only usage)
- **Widgets & Animations:** Framer Motion (Glassmorphism, Stagger effects)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (v5) - Google OAuth & Credentials
- **Editor:** TipTap (Rich Text Editor for Admin)
- **Image Processing:** `wsrv.nl` (Image Proxy Server for CDN caching) + Next.js `<Image>`

---

## 🔄 Old vs New Architecture

| Feature | Old Site (Laravel) | New Site (Next.js) |
| --- | --- | --- |
| **Rendering** | Server-Side Rendering (PHP) | React Server Components (RSC) + Static Generation |
| **Database** | MySQL (Monolithic) | PostgreSQL (Neon - Serverless & Scalable) |
| **Design Language** | Flat, legacy design | Glassmorphism, Dynamic Gradients, Micro-animations |
| **Performance** | Slow page loads | Instant navigation thanks to Turbopack |
| **User Experience** | Refresh-heavy | SPA-like smooth transitions |

---

## 🏗 System Architecture

The project is divided into three main layers:

1. **Frontend (React Components):** All UI components reside in the `src/frontend/` folder. This is a mix of Server Components and Client Components.
2. **Backend & API (API Routes):** API routes are in the `src/app/api/` folder, and data fetching logic (Custom Server Actions) is in `src/backend/lib/`.
3. **Database & Sync (Prisma & Sync Pipeline):** Since Samakal's production database is separate (Laravel), we have created a **Sync Webhook (`/api/sync`)** that fetches data from the old site and saves it to our PostgreSQL.

---

## ⚡ Sync Script (Cron / Webhook)

Since direct connection to the production DB is restricted (or not recommended), we use a Sync Service.

**To Do:**

1. Create a small API Endpoint on Samakal's Laravel site that will return the latest articles in JSON format.
2. Run our `Sync Script` every minute using GitHub Actions or Vercel Cron.
3. The script will fetch new articles and insert them into our PostgreSQL (Neon).

---

## ✨ Special Features

### 1. Floating Video Player (Featured Video & Floating Player)

A premium video player has been integrated into articles to boost reader engagement.

- **Dynamic Floating:** When a reader scrolls down, the inline player automatically transitions into a small, floating mini-player at the corner of the screen.
- **Multi-Platform Support:** Seamlessly supports both YouTube and Facebook video embeds.
- **Technical Implementation:** Utilizes the `Intersection Observer` API for optimal performance with zero overhead. See: `ArticleVideoPlayer.tsx`

### 2. Unified News Metadata

A consistent metadata format is now enforced across all news cards (Homepage, Category Page, Sidebar).

- **Format:** `[Author Name] • [Publication Date & Time]`
- This ensures transparency and visual harmony across all sections of the site.

---

## 🎨 Design System

In terms of design, this project prioritizes **"Readability and Visual Excellence"**.

- **Glassmorphism:** Glassmorphism (semi-transparent, blurred background) is used in mega menus, sticky headers, and some cards.
- **CSS Variables:** Color themes (e.g., `--color-brand-red`, `--color-surface`) are controlled via `:root` variables in the `src/app/globals.css` file.
- **Responsive Layouts:** The site is completely mobile-first. `MobileMenu.tsx`, `Sidebar.tsx`, etc., render according to screen size.

---

## 📦 Core Modules

Folder Structure:

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── (main)/           # Public site (Home, Category, Article pages)
│   ├── admin/            # Admin Dashboard
│   └── api/              # API Endpoints (Sync, Auth)
├── backend/              # Database & Business Logic
│   ├── lib/              # Prisma client, Fetching Logic (actions)
│   ├── prisma/           # Schema.prisma & Migrations
│   └── scripts/          # Scrapers & Cron jobs (Data sync etc.)
├── frontend/             # UI Components
│   └── components/       # Core UI components (Header, Footer, NewsCard, etc.)
└── middleware.ts         # Edge Routing & SEO Redirects
```

---

## ⚙️ Local Setup

Follow these steps to run the project locally:

### 1. Clone & Install

```bash
git clone <repository-url>
cd samakal-redesign
npm install
```

### 2. Environment Variables (.env)

Create a `.env.local` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint/?sslmode=require"

# NextAuth (Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Sync Webhook Secret (For data ingestion)
SYNC_SECRET="your-sync-secret"
```

### 3. Database Initialization (Prisma)

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 🧪 Custom Scripts & Testing

Since fetching data from the old site is a large task, there are important tools in `src/backend/scripts/`:

- **Data Scraper:** `npm run scrape` (To fetch dummy data from Samakal's current site)
- **Sync Tester:** `node src/backend/scripts/debug/test-sync-redirect.js` (To check if Webhook and 301 Redirect are working correctly)

---

## ⚠️ Developer Rules

1. **Readability > Cleverness:** Write code so that other developers can easily understand. Avoid unnecessary complexity.
2. **Vanilla CSS First:** Prefer CSS Modules; use Tailwind only as a helper.
3. **Console Errors:** Ensure no Hydration Errors or Image warnings persist in the browser console.

---

## 🌐 Deployment Guidelines

Compatible with **Vercel** and **Cloudflare**.

### Vercel Deployment

Vercel is the easiest, as it is the native host for Next.js.

- **Important:** Due to Vercel's Image Optimization limits and hotlink blocking from Samakal's server, a **`wsrv.nl`** proxy is used in `src/backend/utils/image.ts`.

### Cloudflare Pages / Workers

If using Cloudflare to reduce traffic costs:

- Ensure `next-auth` and `Prisma` work correctly in the Edge runtime (Prisma Accelerate may be required).

---

## 💾 Database Migration & Seeding

Update the Prisma database when joining as a new developer or adding new fields:

- **Migration Development:** `npx prisma migrate dev --name your_change_name`
- **Seeding Data:** `npx prisma db seed` (Seed file is in `src/backend/prisma/`)

---

## 📰 Admin Panel Access

The site has its own admin dashboard for publishing and editing news.

- **Access URL:** `http://localhost:3000/admin`
- **Tiptap Editor:** A custom rich-text editor (Tiptap) in `src/frontend/components/Editor/` supports image uploads and formatting.

---

## ⚡ Caching & Revalidation

- **Static Cache (ISR):** Home and Category pages are cached via Incremental Static Regeneration.
- **On-demand Revalidation:** `revalidateTag` or `revalidatePath` is triggered when an article is published or updated.

---

## 📞 License & Support

- **Maintenance:** Monitor Vercel Logs or Neon Database Query Logs for system crashes.
- **Sync API:** Check `SYNC_SECRET` in `.env` if the Sync API fails.

---

*Developed & Designed by Abisheak AI Assistant.* 🚀
