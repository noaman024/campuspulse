# Human-Crafted UI/UX Redesign & AI-Footprint Removal Plan

This document outlines the complete design system overhaul and content humanization for **CampusPulse** so the entire platform looks 100% human-made, professional, and authentic to a high-end university event portal.

## User Review Required

> [!IMPORTANT]
> - **Theme Transformation:** Replacing artificial neon/purple AI gradient meshes with a clean, authentic collegiate palette (Deep Royal Indigo, Slate Blue, Crisp Emerald, Warm Amber).
> - **AI Copy & Data Purge:** Rewriting all hero titles, features, stats, footer notes, and seed events to mirror real university councils (Hackathons, Cultural Fests, Sports Meets, Faculty Coordinators, T&P Workshops).
> - **Repo Cleanliness:** Removing AI-generated meta-files (`CLAUDE.md`, `AGENTS.md`, AI comments) so the repository contains only standard, human-crafted production code.

---

## Proposed Changes

### 1. Design System & CSS Token Overhaul
#### [MODIFY] [`src/app/globals.css`](file:///c:/Users/sabir/antigravity/campuspules/src/app/globals.css)
- Replace neon purple/cyan with authentic Royal Indigo (`hsl(221, 83%, 53%)`), Slate Blue, and clean neutral tokens.
- Replace glowing blurred gradient blobs with crisp, subtle card shadows (`box-shadow: 0 1px 3px rgba(0,0,0,0.06)`).
- Upgrade button, badge, input, and card classes with human-crafted micro-interactions, subtle borders, and natural hover states.
- Refine Dark Mode to Midnight Slate (`#0f172a` / `#1e293b`).

---

### 2. Header & Footer Humanization
#### [MODIFY] [`src/components/layout/Navbar.tsx`](file:///c:/Users/sabir/antigravity/campuspules/src/components/layout/Navbar.tsx)
- Add university branding badge (*"Official Campus Portal"*).
- Clean typography and polished navigation links.

#### [MODIFY] [`src/components/layout/Footer.tsx`](file:///c:/Users/sabir/antigravity/campuspules/src/components/layout/Footer.tsx)
- Rebuild footer with authentic collegiate sections:
  - *Student Council & Event Committees*
  - *Departments & Academic Wings*
  - *Campus Safety & Emergency Helpline*
  - *Dean of Student Affairs Office & Physical Address*
- Remove any AI-styled placeholder text or cliché links.

---

### 3. Landing Page Transformation
#### [MODIFY] [`src/app/page.tsx`](file:///c:/Users/sabir/antigravity/campuspules/src/app/page.tsx)
- Rewrite hero section with real student & organizer copy:
  - *"One Unified Hub for Campus Events, Registrations & Student Activities"*
  - Subtitle: *"Official university platform for discovering departmental symposiums, inter-college fests, sports leagues, and verified QR attendance passes."*
- Replace generic "AI features" with authentic campus modules:
  - Department Event Bulletin & Calendar
  - Verified Digital QR Hall Passes & Live Check-in
  - Student Council Feedback & Analytics
  - Interactive Live Q&A with Faculty Coordinators
  - Media Gallery & Post-Event Executive Reports
- Add authentic campus stats and upcoming fest highlights.

---

### 4. Realistic Real-World Database Seed
#### [MODIFY] [`scripts/seed.js`](file:///c:/Users/sabir/antigravity/campuspules/scripts/seed.js)
- Populate 6 realistic, detailed campus events with real agendas, Chief Guests, Faculty Coordinators, Venues, and Departments:
  1. **HackPulse 2026: 24-Hour National Hackathon** (Dept of CSE, Main Tech Hub)
  2. **Tarang 2026: Inter-University Cultural Fest** (Open Air Amphitheatre, Cultural Council)
  3. **Hands-on Cloud Architecture & DevOps Masterclass** (Lab 402, IT Dept)
  4. **Inter-Department Annual Cricket Championship** (University Sports Pavilion)
  5. **Campus Placement & Resume Mastery Bootcamp** (Training & Placement Cell, Auditorium 1)
  6. **RoboWars & Autonomous Drone Showcase** (Robotics Club, Mechanical Block)
- Run `node scripts/seed.js` to sync realistic events into MongoDB Atlas.

---

### 5. Repository Cleanup (Purging AI Markers)
#### [DELETE] [`CLAUDE.md`](file:///c:/Users/sabir/antigravity/campuspules/CLAUDE.md)
#### [DELETE] [`AGENTS.md`](file:///c:/Users/sabir/antigravity/campuspules/AGENTS.md)
- Ensure all comments and documentation follow standard developer conventions without AI markers.

---

## Verification Plan

### Automated Verification
- Run `npx tsc --noEmit` to ensure 0 TypeScript errors.
- Run `npm run build` to confirm production static & dynamic page builds succeed.
- Run `node scripts/seed.js` to verify MongoDB database sync.

### Manual Verification
- Open `http://localhost:3000` to inspect the new human-crafted UI, typography, colors, and realistic content.
- Test Dark/Light mode toggle to verify natural contrasts and subtle borders.
- Re-generate Android APK to verify all changes are packed into [`CampusPulse.apk`](file:///c:/Users/sabir/antigravity/campuspules/CampusPulse.apk).
