# Artemis Education Platform

## Overview

A complete, production-ready, mobile-first EdTech platform for Bangladesh named "Artemis Education". Built with Bangla-first UI, covering recorded classes, live classes, quizzes, payments, and gamification.

## Brand

- **Name**: Artemis Education / আর্টেমিস এডুকেশন
- **Tagline**: "Learn Smart, Achieve More" / "স্মার্টভাবে শিখুন, সফলতা অর্জন করুন"
- **Primary Color**: Deep blue/indigo gradient with amber accent
- **Font**: Hind Siliguri (Bangla), Inter (English)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Routing**: Wouter

## Key Features

1. **Home Page** - Hero banner, featured courses, categories (SSC/HSC/Admission/Skills), continue learning, streak
2. **Course System** - Course catalog with search/filter, module/lesson structure
3. **Video Lessons** - YouTube embed player, progress tracking, mark complete
4. **Live Classes** - Upcoming live classes with LIVE badge, Join button
5. **Quiz System** - MCQ with countdown timer, instant results, explanations
6. **Leaderboard** - Gamified ranking by points with medals
7. **Dashboard** - Stats cards, enrolled courses, recent activity
8. **Profile** - Editable profile, badges, points
9. **Payment** - bKash, Nagad, Manual payment methods
10. **Mobile-first** - Bottom navigation on mobile, sidebar on desktop

## Artifacts

- **Frontend**: `artifacts/artemis-education` - React + Vite, preview at `/`
- **API Server**: `artifacts/api-server` - Express API, serves at `/api`

## Database Tables

- `users` - Student profiles
- `categories` - SSC, HSC, Admission, Skills
- `courses` - Course catalog
- `modules` - Course modules/chapters
- `lessons` - Individual lessons (video, pdf, quiz)
- `quizzes` / `quiz_questions` - Quiz content
- `quiz_results` - Student quiz submissions
- `leaderboard` - Student rankings
- `enrollments` - Course enrollments
- `lesson_progress` - Lesson completion tracking
- `live_classes` - Scheduled live sessions
- `payments` - Payment records

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/artemis-education run dev` — run frontend locally

## Routes

### Frontend Pages
- `/` — হোম (Home)
- `/dashboard` — আমার ড্যাশবোর্ড
- `/courses` — কোর্সসমূহ
- `/courses/:id` — Course Detail
- `/lessons/:id` — Lesson Player
- `/live` — লাইভ ক্লাস
- `/quiz/:id` — Quiz
- `/quiz/:id/results` — Quiz Results
- `/leaderboard` — লিডারবোর্ড
- `/profile` — প্রোফাইল
- `/payment/:courseId` — Payment

### API Endpoints (prefix: /api)
- `GET /categories` - List categories
- `GET /courses` - List/search/filter courses
- `GET /courses/:id` - Course detail with modules
- `GET /courses/:id/lessons` - Lessons for a course
- `GET /lessons/:id` - Single lesson
- `GET /quizzes` - List quizzes
- `GET /quizzes/:id` - Quiz with questions
- `POST /quizzes/:id/submit` - Submit quiz answers
- `GET /leaderboard` - Student leaderboard
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/enrollments` - Enrolled courses
- `POST /users/enrollments` - Enroll in course
- `GET /users/progress` - Lesson progress
- `POST /users/progress` - Update progress
- `GET /live-classes` - Live class schedule
- `GET /live-classes/:id` - Live class detail
- `GET /payments` - Payment history
- `POST /payments` - Create payment
- `GET /dashboard/summary` - Dashboard stats
- `GET /dashboard/streak` - Study streak data
