# ⚡ CampusPulse — Campus Event Discovery, Dynamic Feedback & Media Hub

A centralized, enterprise-grade Next.js & MongoDB platform designed for university communities. Enables seamless event discovery, instant RSVP with scannable digital QR tickets, live Q&A forums, dynamic Google-Forms-like feedback collection, high-resolution media showcases, and institutional executive report generation.

---

## 🚀 Key Features

### 📅 1. Event Discovery & RSVP Management
- **Category Filtering & Search:** Technical, Cultural, Sports, and Workshops with responsive search.
- **RSVP & Scannable QR Codes:** Instant digital boarding pass generation. Any smartphone camera or QR reader can scan the QR code to open the **Official Ticket Verification Page** (`/events/verify/[token]`).
- **Capacity & Waitlist Tracking:** Automatic headcount progress bar and capacity locking.
- **Multi-Platform Event Sharing:** 1-Click interactive sharing popup for **WhatsApp, Telegram, LinkedIn, Twitter/X, Email**, and Direct Links.

### 📝 2. Dynamic Feedback & Survey Engine
- **Google-Forms-Like Builder:** Drag-and-drop questions, rating scales, multiple-choice, and long text inputs.
- **Real-Time Analytics & Sentiment:** Star rating breakdowns, NPS metrics, and response exports.
- **Anonymous Submissions:** Option for students to submit anonymous or verified feedback.

### 💬 3. Interactive Live Q&A Forum
- **Real-Time Questions & Upvoting:** Students can upvote trending questions during live sessions.
- **Organizer Pinning & Official Answers:** Event coordinators can answer and pin critical queries.

### 📸 4. High-Resolution Media Vault
- **Photo & Video Gallery:** Supports MP4/WebM uploads as well as responsive **YouTube/Vimeo Embeds**.
- **Full-Screen Lightbox:** High-resolution preview with quick link copying.

### 📊 5. Executive Event Reports & Attendance
- **Automated Report Generation:** Generates official institutional reports complete with Chief Guest, Objectives, Attendance Stats, and Feedback analysis.
- **1-Click Print & PDF Export:** Formatted letterhead layout ready for administrative review.
- **Live Attendance Toggle:** Fast check-in verification for campus event coordinators.

### 🐳 6. Docker & Cross-Device PWA
- **Multi-Stage Dockerization:** Complete with `Dockerfile` and `docker-compose.yml` for instant deployment on any PC, laptop, Mac, or server.
- **Progressive Web App (PWA):** Installable on Android & iOS (`manifest.json`) for full-screen native mobile experience.

### 🛡️ 7. Trust & Legal Center
- Comprehensive policy suite tailored for campus compliance: Privacy Policy, Terms of Service, Cookie Policy, Cancellation Policy, Security Policy, Accessibility Statement (WCAG 2.1), and DPA.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **UI & Styling:** React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** NextAuth.js (Credentials Provider with bcrypt password encryption & RBAC)
- **Containerization:** Docker & Docker Compose
- **QR Code Engine:** `qrcode` high-contrast canvas & data URLs

---

## 📦 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- MongoDB URI (Atlas or Local)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/campuspulse.git
cd campuspulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Running with Docker

Run the entire application in a container with one command:
```bash
docker compose up -d --build
```
Access the application at `http://localhost:3000`.

---

## 📜 License
Distributed under the MIT License. Built for university & campus communities.
