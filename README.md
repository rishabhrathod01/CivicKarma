# CivicKarma

**Gamified civic reporting platform for Bangalore — report issues, earn points, build accountability.**

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## Overview

CivicKarma is a mobile-first civic engagement platform designed for Bangalore residents. It empowers citizens to report infrastructure issues — potholes, garbage dumps, illegal parking, broken street lights — directly from their phones with photo evidence and GPS coordinates.

What makes CivicKarma different is its **gamification layer**. Every valid report earns points, climbing you up a public leaderboard. Self-cleaning an issue you reported earns bonus points. False reports cost you. This creates a self-regulating ecosystem where accountability runs both ways — citizens stay honest, and government responsiveness becomes publicly measurable.

The platform supports **English and Kannada** (ಕನ್ನಡ), ensuring accessibility for all Bangalore residents. Complaints are categorized by department (BBMP, Traffic, Road & Infrastructure) and tracked through a transparent status pipeline from submission to resolution.

### Key Features

- **Photo-verified reporting** — attach up to 5 geotagged photos per complaint
- **GPS-powered location tagging** — automatic address detection with duplicate proximity checks
- **Gamification system** — earn points for valid reports, lose points for false ones
- **Public leaderboard** — ranked by civic karma points across the city
- **Bilingual support** — full English and Kannada (ಕನ್ನಡ) localization
- **Department routing** — complaints auto-categorized to BBMP, Traffic, or Road & Infra

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native (Expo SDK 54), TypeScript, Expo Router, NativeWind (TailwindCSS) |
| **State Management** | Zustand (client state) + TanStack React Query (server state) |
| **Backend** | Supabase — Postgres, Auth (phone OTP), Storage, Row Level Security |
| **Internationalization** | react-i18next (English + Kannada) |
| **Forms & Validation** | React Hook Form + Zod |
| **Admin Dashboard** | React + Vite + TypeScript |

---

## Project Structure

```
CivicKarma/
├── admin/                      # Admin dashboard (React + Vite)
│   ├── src/
│   │   ├── pages/              # Dashboard, Complaints, Export pages
│   │   ├── App.tsx             # Router & layout
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── src/
│   ├── components/
│   │   └── ui/                 # Reusable UI components (Button, Card, Input, Badge)
│   ├── constants/
│   │   ├── categories.ts       # BBMP, Traffic, Road & Infra category definitions
│   │   ├── config.ts           # App-wide configuration (limits, map center, languages)
│   │   ├── index.ts            # Barrel exports
│   │   └── points.ts           # Gamification points configuration
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useCamera.ts        # Camera & image picker
│   │   ├── useComplaints.ts    # Complaint CRUD with React Query
│   │   ├── useImageCompressor.ts # Image compression utilities
│   │   ├── useLeaderboard.ts   # Leaderboard data hook
│   │   └── useLocation.ts      # GPS location hook
│   ├── i18n/
│   │   ├── index.ts            # i18next configuration
│   │   ├── en.json             # English translations
│   │   └── kn.json             # Kannada translations
│   ├── services/
│   │   ├── auth.ts             # Supabase auth service
│   │   ├── complaints.ts       # Complaint API service
│   │   ├── leaderboard.ts      # Leaderboard service
│   │   ├── photos.ts           # Photo upload service
│   │   ├── points.ts           # Points award service
│   │   └── supabase.ts         # Supabase client initialization
│   ├── stores/
│   │   ├── auth.store.ts       # Auth state (Zustand)
│   │   ├── report.store.ts     # Report form state (Zustand)
│   │   └── settings.store.ts   # App settings state (Zustand)
│   ├── types/
│   │   ├── complaints.ts       # Complaint type definitions
│   │   ├── database.ts         # Supabase database types
│   │   ├── index.ts            # Barrel exports
│   │   ├── navigation.ts       # Navigation types
│   │   └── points.ts           # Points & gamification types
│   └── utils/
│       ├── format.ts           # Formatting utilities
│       ├── geo.ts              # Geolocation helpers
│       ├── image.ts            # Image processing utilities
│       ├── points.ts           # Points calculation helpers
│       └── validation.ts       # Zod validation schemas
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql    # Tables, indexes, triggers
│   │   ├── 002_rls_policies.sql      # Row Level Security policies
│   │   └── 003_functions.sql         # PostgreSQL functions
│   └── seed.sql                      # Initial categories & subcategories
├── .env.example                # Environment variable template
├── app.json                    # Expo configuration
├── babel.config.js             # Babel configuration
├── global.css                  # NativeWind global styles
├── metro.config.js             # Metro bundler configuration
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # TailwindCSS / NativeWind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI** — `npm install -g expo-cli`
- **Supabase account** — [supabase.com](https://supabase.com)
- iOS Simulator (macOS) or Android Emulator, or Expo Go on a physical device

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CivicKarma.git
cd CivicKarma
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

See the detailed [Supabase Setup](#supabase-setup) section below.

### 4. Configure Environment

```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Development Server

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to run on your device.

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Note your **Project URL** and **anon (public) key** from Settings > API

### 2. Run Database Migrations

Run each migration file **in order** via the Supabase SQL Editor (Dashboard > SQL Editor > New query):

1. **`supabase/migrations/001_initial_schema.sql`** — Creates all tables (profiles, categories, subcategories, complaints, photos, points_log, status_history), indexes, and triggers
2. **`supabase/migrations/002_rls_policies.sql`** — Enables Row Level Security on all tables with appropriate read/write policies
3. **`supabase/migrations/003_functions.sql`** — Creates PostgreSQL functions for duplicate detection, point awards, leaderboard, daily limits, and report counting

### 3. Seed Initial Data

Run **`supabase/seed.sql`** to populate the default categories (BBMP, Traffic, Road & Infrastructure) and their subcategories.

### 4. Enable Phone Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable **Phone** provider
3. Configure your SMS provider (Twilio, etc.) for production, or use the built-in test mode for development

### 5. Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named **`complaint-photos`**
3. Set the bucket to **public** access (photos need to be viewable in the app)
4. Add a storage policy to allow authenticated users to upload:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'complaint-photos');
```

### 6. RLS Policies Note

The migration `002_rls_policies.sql` sets up comprehensive Row Level Security:

- **Public read access** on complaints, categories, and status history (transparency)
- **Owner-only write access** on profiles and complaints
- **Service-role only** access for admin operations (categories management, status changes, points)

---

## Admin Dashboard

The admin dashboard is a standalone React + Vite application for managing complaints, viewing analytics, and exporting data.

```bash
cd admin
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173` by default. It is currently a stub with placeholder data — connect it to your Supabase instance to see live data.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) API key | `eyJhbGciOiJIUzI1NiIs...` |
| `EXPO_PUBLIC_DEFAULT_LANG` | Default UI language (`en` or `kn`) | `en` |
| `EXPO_PUBLIC_MAX_REPORTS_PER_DAY` | Maximum reports a user can file per day | `5` |
| `EXPO_PUBLIC_DUPLICATE_RADIUS_METERS` | Radius (m) for duplicate complaint detection | `50` |
| `EXPO_PUBLIC_DUPLICATE_HOURS` | Time window (hours) for duplicate detection | `2` |

---

## Architecture

### Feature-Based Organization

The codebase follows a feature-based directory structure under `src/`. Each domain concern (auth, complaints, leaderboard) has corresponding **hooks**, **services**, **stores**, and **types** — making it easy to locate and modify any feature.

### Service Layer Pattern

All Supabase interactions are encapsulated in the `src/services/` directory. Components never call Supabase directly — they go through custom hooks (e.g., `useComplaints`) which use TanStack React Query for caching, background refetching, and optimistic updates, backed by service functions.

### State Management

- **Zustand** handles client-only state: auth session, report form drafts, app settings (language, theme)
- **TanStack React Query** manages all server state: complaints list, leaderboard data, user profile — with automatic caching, refetching, and pagination

### Gamification Engine

Points are awarded server-side via a PostgreSQL `SECURITY DEFINER` function (`award_points`) to prevent client-side manipulation. The point configuration is mirrored in `src/constants/points.ts` for UI display purposes. See the [Gamification](#gamification) section for the full points table.

---

## Gamification

CivicKarma uses a points-based system to incentivize accurate reporting and civic responsibility:

| Action | Points | Description |
|--------|--------|-------------|
| **Valid Report** | +10 | Submitting a verified civic report |
| **Self Cleaned** | +30 | Cleaning up the reported issue yourself |
| **Parking Violation** | +15 | Reporting a parking violation |
| **Government Resolved** | +5 | Your report was resolved by the government |
| **False Report** | -20 | Penalty for submitting a false or duplicate report |

Points contribute to a **public leaderboard** ranked across the city. The system is designed to reward genuine civic engagement while discouraging misuse.

---

## Roadmap

### Phase 1 — Foundation (Current)

- [x] Supabase schema, RLS policies, and database functions
- [x] Authentication with phone OTP
- [x] Complaint submission with photo uploads and GPS
- [x] Category and subcategory system (BBMP, Traffic, Road & Infra)
- [x] Points system and leaderboard
- [x] English + Kannada localization
- [x] Admin dashboard stub

### Phase 2 — Enhancement

- [ ] Push notifications for status updates
- [ ] Complaint map view with clustering
- [ ] User profile page with activity history
- [ ] Complaint search and advanced filtering
- [ ] Image moderation (AI-based or manual review)
- [ ] Offline support with complaint queue

### Phase 3 — Scale

- [ ] RTI (Right to Information) auto-draft integration
- [ ] Ward-level analytics and heatmaps
- [ ] Government department API integrations
- [ ] Multi-city expansion beyond Bangalore
- [ ] Community upvoting on complaints
- [ ] Monthly civic reports and transparency dashboards

---

## Contributing

Contributions are welcome! CivicKarma is an open-source project and we appreciate any help.

### How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and ensure they follow the existing code style
4. **Test** your changes thoroughly
5. **Commit** with a clear, descriptive message:
   ```bash
   git commit -m "Add: brief description of your change"
   ```
6. **Push** to your fork and open a **Pull Request**

### Guidelines

- Follow the existing TypeScript and project structure conventions
- Write clear commit messages
- Keep PRs focused — one feature or fix per PR
- Add types for any new data structures
- Update translations (`en.json` and `kn.json`) if adding user-facing strings

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
