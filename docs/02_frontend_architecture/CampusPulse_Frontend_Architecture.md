# 🎨 CampusPulse — Frontend Architecture & UI Engineering Manual

**Version:** 1.0.0 (Production)  
**Classification:** Frontend Engineering Specification  
**Framework:** Next.js 16.3.3 (App Router) + React 19.2.8 + Tailwind CSS v4  
**Last Updated:** September 2026  

---

## 1. Frontend Architecture Overview

CampusPulse is engineered around the **Next.js 16 App Router paradigm**, leveraging React 19 Server Components for data-heavy views and Client Components (`"use client"`) for interactive elements. This architecture minimizes the JavaScript bundle shipped to the client, guaranteeing near-instant first contentful paint (FCP) and optimal SEO scores.

### Key Architectural Pillars:
1. **Server-Driven Data Fetching:** Initial event catalogs, admin dashboards, and legal documents are streamed directly from server components without client-side `useEffect` waterwalls.
2. **Zero-Flicker Authentication:** NextAuth `SessionProvider` wrapped in `src/components/providers/AuthProvider.tsx` maintains persistent client session states.
3. **Glassmorphic Design System:** Custom Tailwind CSS v4 design tokens built for low-glare dark mode (`#08090D` background, `#12151E` surface cards, `#6366F1` indigo highlights).
4. **Fluid Motion & Accessibility:** Page transitions and interactive drawer modals powered by Framer Motion, compliant with WCAG 2.1 AA standards.

---

## 2. Complete Routing Directory Map (All 32 Routes)

Below is the exhaustive index of all 32 compiled routes in CampusPulse:

| Route Path | Type | Access Level | Description |
| :--- | :---: | :---: | :--- |
| `/` | Static | Public | CampusPulse landing page, hero section, live stats counter, upcoming events showcase |
| `/events` | Static | Public | Searchable, category-filtered campus event directory |
| `/events/[slug]` | Dynamic | Public / Auth | Full event details, live seat progress bar, schedule, RSVP trigger modal |
| `/events/verify/[token]` | Dynamic | Public | Official Gate Pass Scanner page for security guards & event coordinators |
| `/portal/qna` | Dynamic | Auth (Student/Admin) | Live event Q&A board, question upvoting, official replies |
| `/portal/feedback` | Dynamic | Auth (Student/Admin) | Active student feedback surveys catalog |
| `/portal/feedback/[formId]`| Dynamic | Auth (Student/Admin) | Dynamic survey form renderer with star ratings and comments |
| `/portal/billing` | Dynamic | Auth (Student/Admin) | Transaction summary and digital event pass receipt overview |
| `/portal/billing/success` | Dynamic | Auth (Student/Admin) | Successful ticket confirmation with downloadable PDF receipt |
| `/portal/billing/pending` | Dynamic | Auth (Student/Admin) | Real-time payment verification waiting screen |
| `/portal/billing/failed` | Dynamic | Auth (Student/Admin) | Error diagnosis and retry transaction launcher |
| `/admin` | Dynamic | Admin Only | Primary institutional administration KPI dashboard |
| `/admin/events` | Dynamic | Admin Only | Event management table with status toggles (Draft/Upcoming/Completed) |
| `/admin/events/new` | Dynamic | Admin Only | Comprehensive event creation wizard (Dates, venue, capacity, tags) |
| `/admin/events/[id]/edit` | Dynamic | Admin Only | Event modification and live attendance editor |
| `/admin/feedback` | Dynamic | Admin Only | Google-Forms-style survey builder with dynamic fields |
| `/admin/feedback/[eventId]` | Dynamic | Admin Only | Feedback configuration for specific campus events |
| `/admin/feedback/[eventId]/responses` | Dynamic | Admin Only | Visual sentiment charts and student response data tables |
| `/admin/media` | Dynamic | Admin Only | High-resolution photo vault & MP4/WebM video gallery manager |
| `/admin/analytics` | Dynamic | Admin Only | Recharts-powered graphs: RSVP trends, category popularity, sentiment |
| `/admin/reports` | Dynamic | Admin Only | Executive report generator with printable letterhead and PDF download |
| `/admin/settings` | Dynamic | Admin Only | Campus brand settings, hero banner updates, social broadcast links |
| `/login` | Static | Public | Secure credential sign-in page with role routing |
| `/register` | Static | Public | Student onboarding registration with department selector |
| `/forgot-password` | Static | Public | Self-service password recovery email dispatcher |
| `/reset-password` | Static | Public | Encrypted token-based credential reset interface |
| `/onboarding` | Static | Public | Interactive campus tour explaining platform features |
| `/about` | Static | Public | Mission statement, university committee leadership, and contacts |
| `/help` | Static | Public | Searchable student FAQ, troubleshooting, and support desk |
| `/legal` | Static | Public | University compliance, privacy, terms, and WCAG accessibility index |
| `/legal/[slug]` | Dynamic | Public | Specific policy view (Privacy Policy, Terms of Service, Cookie Policy) |
| `/sitemap.xml` | Dynamic | SEO | Auto-generated XML sitemap covering all static & live event URLs |
| `/robots.txt` | Static | SEO | Search engine crawler rules (protects `/admin` & `/portal/billing`) |

---

## 3. UI Component Hierarchy & Design Tokens

CampusPulse avoids generic component libraries in favor of tailored, highly performant React components:

```text
src/components/
├── layout/
│   ├── Navbar.tsx            # Sticky frosted-glass navbar with role-aware navigation
│   └── Footer.tsx            # Multi-column university footer with quick links & badges
├── providers/
│   ├── AuthProvider.tsx      # NextAuth SessionProvider wrapper
│   └── ThemeProvider.tsx     # Dark glassmorphic theme state controller
├── ui/
│   ├── CookieConsentBanner.tsx # GDPR/ePrivacy compliant banner with storage preferences
│   ├── Button.tsx            # High-contrast interactive button with loading spinner
│   ├── Modal.tsx             # Accessible backdrop-blurred modal dialog
│   └── Badge.tsx             # Category color tags (Technical, Cultural, Sports, Workshop)
└── media/
    ├── VideoPlayer.tsx       # Custom HTML5 video player with buffer indicators
    └── ImageLightbox.tsx     # Full-screen photo inspector with zoom & share
```

### Color Palette Tokens:
- **Canvas Base:** `#08090D` (Deep obsidian black for zero eye fatigue)
- **Surface Elevation 1:** `#111420` (Cards, modals, navigation drawers)
- **Surface Elevation 2:** `#1A1F30` (Hover states, table headers, input fields)
- **Primary Accent:** `#6366F1` (Indigo electric highlight for primary CTAs)
- **Secondary Accent:** `#8B5CF6` (Purple gradient complement)
- **Success Emerald:** `#10B981` (Confirmed RSVPs, verified pass status)
- **Warning Amber:** `#F59E0B` (Seats running low, pending payments)
- **Danger Crimson:** `#EF4444` (Event cancellations, rejected transactions)

---

## 4. Client State & Form Validation

- **Form Handling:** Forms leverage controlled inputs or native `FormData` dispatched via asynchronous Server Actions.
- **Validation:** Client-side feedback is powered by **Zod schemas**, preventing invalid emails, weak passwords, and mismatched date ranges before network dispatch.
- **Visual Feedback:** All asynchronous operations show micro-spinners, disabled state locks, and animated alert banners upon resolution.
