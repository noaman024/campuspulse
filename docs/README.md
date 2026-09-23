# 📚 CampusPulse — Master Documentation & PDF Manuals Index

Welcome to the official, comprehensive documentation suite for **CampusPulse**. This directory organizes the platform's complete architectural, engineering, deployment, and mobile specifications into modular folders, each accompanied by an executive printable **PDF manual**.

---

## 🗂️ Documentation Directory Structure

```text
docs/
├── 01_project_overview/
│   ├── CampusPulse_Project_Overview.md
│   └── CampusPulse_Project_Overview.pdf
├── 02_frontend_architecture/
│   ├── CampusPulse_Frontend_Architecture.md
│   └── CampusPulse_Frontend_Architecture.pdf
├── 03_backend_and_database/
│   ├── CampusPulse_Backend_and_Database.md
│   └── CampusPulse_Backend_and_Database.pdf
├── 04_features_and_modules/
│   ├── CampusPulse_Features_and_Modules.md
│   └── CampusPulse_Features_and_Modules.pdf
├── 05_deployment_and_devops/
│   ├── CampusPulse_Deployment_and_DevOps.md
│   └── CampusPulse_Deployment_and_DevOps.pdf
├── 06_mobile_android_capacitor/
│   ├── CampusPulse_Mobile_Android_Capacitor.md
│   └── CampusPulse_Mobile_Android_Capacitor.pdf
└── README.md
```

---

## 📖 Module Summary & Direct Links

### [01. Project Overview & Master Architecture](file:///c:/Users/sabir/antigravity/campuspules/docs/01_project_overview/CampusPulse_Project_Overview.md)
* **Topics Covered:** Executive mission, university ecosystem goals, complete tech stack (Next.js 16, React 19, MongoDB Atlas, Mongoose 9, NextAuth v4, Tailwind CSS v4, Capacitor 8.5), full repository file map, RBAC permission matrix.
* **Download Manual:** [CampusPulse_Project_Overview.pdf](file:///c:/Users/sabir/antigravity/campuspules/docs/01_project_overview/CampusPulse_Project_Overview.pdf) *(~350 KB)*

---

### [02. Frontend Architecture & UI Engineering](file:///c:/Users/sabir/antigravity/campuspules/docs/02_frontend_architecture/CampusPulse_Frontend_Architecture.md)
* **Topics Covered:** Next.js 16 App Router hierarchy, exhaustive directory of all 32 compiled static & dynamic routes, layout and component breakdown (`Navbar`, `Footer`, `AuthProvider`, `ThemeProvider`), glassmorphic design system tokens (`#08090D`, `#4F46E5`), client-side Zod validation.
* **Download Manual:** [CampusPulse_Frontend_Architecture.pdf](file:///c:/Users/sabir/antigravity/campuspules/docs/02_frontend_architecture/CampusPulse_Frontend_Architecture.pdf) *(~417 KB)*

---

### [03. Backend, Database & Server Actions](file:///c:/Users/sabir/antigravity/campuspules/docs/03_backend_and_database/CampusPulse_Backend_and_Database.md)
* **Topics Covered:** MongoDB Atlas connection caching singleton (`src/lib/db/connection.ts`), custom DNS SRV resolver, 7 Mongoose schemas (`User`, `Event`, `FeedbackForm`, `FeedbackSubmission`, `EventQnA`, `SiteSettings`, `SocialBroadcast`), Next.js Server Actions engine (`src/actions/`), RBAC guards (`requireAdmin()`, `requireAuth()`).
* **Download Manual:** [CampusPulse_Backend_and_Database.pdf](file:///c:/Users/sabir/antigravity/campuspules/docs/03_backend_and_database/CampusPulse_Backend_and_Database.pdf) *(~668 KB)*

---

### [04. Features, Modules & Business Logic](file:///c:/Users/sabir/antigravity/campuspules/docs/04_features_and_modules/CampusPulse_Features_and_Modules.md)
* **Topics Covered:** Event discovery with capacity locks, scannable QR ticket generation & live gate verification (`/events/verify/[token]`), live interactive student Q&A with deduplicated upvotes, Google-Forms-like survey builder with automated NPS, media vault with video processing, executive institutional reporting with `@react-pdf/renderer`.
* **Download Manual:** [CampusPulse_Features_and_Modules.pdf](file:///c:/Users/sabir/antigravity/campuspules/docs/04_features_and_modules/CampusPulse_Features_and_Modules.pdf) *(~335 KB)*

---

### [05. Deployment, DevOps & Infrastructure](file:///c:/Users/sabir/antigravity/campuspules/docs/05_deployment_and_devops/CampusPulse_Deployment_and_DevOps.md)
* **Topics Covered:** Netlify 100% free serverless hosting (`netlify.toml` + automated GitHub webhook deployment), Docker multi-stage build & `docker-compose.yml` with persistent uploads volume, Firebase App Hosting (`apphosting.yaml`), Environment Variables Bible (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `JWT_SECRET`, `UPLOAD_DIR`, `APP_URL`).
* **Download Manual:** [CampusPulse_Deployment_and_DevOps.pdf](file:///c:/Users/sabir/antigravity/campuspules/docs/05_deployment_and_devops/CampusPulse_Deployment_and_DevOps.pdf) *(~369 KB)*

---

### [06. Native Android & Capacitor Mobile Engineering](file:///c:/Users/sabir/antigravity/campuspules/docs/06_mobile_android_capacitor/CampusPulse_Mobile_Android_Capacitor.md)
* **Topics Covered:** Capacitor 8.5.0 cross-platform bridge (`capacitor.config.ts`), native Android Studio project structure (`android/app`), custom branding & splash screens, compiling debug & release APKs via Gradle CLI (`gradlew assembleDebug`), pre-built standalone binary (`CampusPulse.apk`).
* **Download Manual:** [CampusPulse_Mobile_Android_Capacitor.pdf](file:///c:/Users/sabir/antigravity/campuspules/docs/06_mobile_android_capacitor/CampusPulse_Mobile_Android_Capacitor.pdf) *(~357 KB)*

---

## 🔄 Regenerating Documentation PDFs

If you make modifications to any `.md` file, you can regenerate all 6 PDFs in a single command:
```bash
node scripts/generate_docs_pdf.js
```
The script uses headless Chrome to convert each updated markdown document into a print-ready A4 PDF.
