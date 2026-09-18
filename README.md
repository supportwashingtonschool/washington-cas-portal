# Washington School — IB CAS Digital Portfolio Portal

A modern, accessible digital portfolio portal designed for Washington School (a candidate school in the Philippines) to manage the International Baccalaureate (IB) Creativity, Activity, Service (CAS) program.

## Features
- **Role-Based Authentication**: Secure server-side sessions for students and CAS coordinators powered by Supabase Auth and Next.js App Router.
- **Experience Proposal Pipeline**: Students can propose CAS experiences across Creativity, Activity, and Service strands with adult supervisor details.
- **Coordinator Approval Queue**: Dedicated review queue for coordinators to inspect candidate proposals and record approvals or revisions.
- **Digital Reflection Journal**: Students can document ongoing learning outcomes and reflections in a chronological feed.
- **Supervisor Verification (Magic Link)**: Public, passwordless verification links for external adult supervisors to verify completed activities without requiring an account.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)
- **Icons**: Lucide React

## Environment Variables
Configure the following in your deployment environment (e.g. Netlify / Vercel):
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Getting Started
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Setup
Run the SQL script located at `supabase/schema.sql` in your Supabase SQL Editor to set up tables, ENUMs, triggers, and Row Level Security (RLS) policies.