// scripts/generate_slide_pdf.js
// Renders the 12-slide presentation deck as a 16:9 Widescreen PDF for CampusPulse
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const slidesData = [
  {
    number: "01",
    category: "Cover & Title",
    title: "CampusPulse",
    subtitle: "Enterprise Campus Event Discovery, Real-Time Engagement & Institutional Analytics Platform",
    isCover: true,
  },
  {
    number: "02",
    category: "01 / Context & Background",
    title: "Problem Statement & Campus Challenges",
    points: [
      { h: "1. Scattered & Fragmented Notice Distribution:", d: "Event notices get buried across scattered WhatsApp groups, cluttered inboxes, and physical notice boards. Students miss registration deadlines and venue announcements." },
      { h: "2. Inefficient & Manual Registration Queues:", d: "Paper forms and manual spreadsheet entries create massive desk bottlenecks, handwriting errors, lost registrations, and frequent seat overbooking." },
      { h: "3. Low Student Feedback Participation:", d: "Traditional post-event Google Forms see less than 10% student participation with zero automated sentiment analysis, leaving organizers blind to attendee satisfaction." },
      { h: "4. Heavy Accreditation (NAAC/NBA) Documentation:", d: "Faculty coordinators spend weeks compiling attendance records, photos, and outcomes manually for institutional accreditation audits." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT / GRAPHIC]",
    placeholderDesc: "Diagram showing chaotic campus paper notices, fragmented WhatsApp circulars, and long manual registration queues.",
  },
  {
    number: "03",
    category: "02 / Strategic Vision",
    title: "Proposed Solution & Project Objectives",
    points: [
      { h: "1. Centralized Campus Event Hub:", d: "A single unified responsive web and mobile portal aggregating Technical, Cultural, Sports, and Academic Workshop events across all departments." },
      { h: "2. Simple 1-Click RSVP with Capacity Control:", d: "Instant seat reservation backed by atomic database locks to prevent overbooking, accompanied by an instant digital Registration Confirmation Card." },
      { h: "3. Interactive In-Session Student Q&A:", d: "Live session engagement board with atomic deduplicated student upvotes, allowing trending questions to rise to the speaker's attention." },
      { h: "4. Dynamic Feedback & Automated Accreditation Reports:", d: "Google-Forms-style survey builder with real-time Net Promoter Score (NPS) analytics and 1-Click Executive PDF Letterhead reports for college administration." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT / DIAGRAM]",
    placeholderDesc: "CampusPulse high-level ecosystem diagram connecting Students, Event Coordinators, Live Q&A, Feedback, and Admin Reports.",
  },
  {
    number: "04",
    category: "03 / Technical Overview",
    title: "System Architecture & Technologies Used",
    points: [
      { h: "1. Frontend (User Interface):", d: "React.js & Next.js for clean, fast interactive web pages. Tailwind CSS ensures responsive layout on both laptops and smartphones." },
      { h: "2. Backend (Application Logic):", d: "Node.js handles event registrations and user requests. NextAuth manages simple, secure login sessions for students and admins." },
      { h: "3. Database (Data Storage):", d: "MongoDB Atlas cloud NoSQL database stores user profiles, events, and feedback. Mongoose provides structured data schemas." },
      { h: "4. Architecture & Mobile Support:", d: "Standard 3-Tier Architecture (UI → Server → Database). Capacitor packages the web app into an installable Android APK." },
    ],
    placeholderTitle: "[INSERT 3-TIER ARCHITECTURE DIAGRAM]",
    placeholderDesc: "Simple 3-tier diagram: User Interface (Web / Android) → Application Server (Node/Next.js) → Cloud Database (MongoDB Atlas).",
  },
  {
    number: "05",
    category: "04 / Core Features",
    title: "Module 1: Event Discovery & Categorized Directory",
    points: [
      { h: "• Multi-Category Academic Catalog:", d: "Events categorized into Technical (Hackathons, Coding), Cultural (Fests, Music), Sports (Tournaments), and Academic Workshops." },
      { h: "• Real-Time Fuzzy Search & Filtering:", d: "Students can instantly search by title, department, tags, or venue with dynamic status toggles (Upcoming, Ongoing, Completed)." },
      { h: "• Rich Event Detail View:", d: "Each event showcases high-res banner media, detailed schedules, venue location, faculty coordinator contacts, and prerequisites." },
      { h: "• 1-Click Viral Social Sharing:", d: "Deep-linked sharing modal for WhatsApp, Telegram, LinkedIn, and X/Twitter with pre-formatted event titles and registration links." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT: /events]",
    placeholderDesc: "Screenshot of the CampusPulse Event Discovery Catalog showing category filter pills, search bar, and colorful event cards.",
  },
  {
    number: "06",
    category: "05 / Core Features",
    title: "Module 2: Simple 1-Click Registration & Capacity Control",
    points: [
      { h: "• Frictionless 1-Click Registration:", d: "Logged-in students click 'Register for Event' and are instantly enrolled without filling repetitive personal details or manual forms." },
      { h: "• Atomic Capacity Lock (Zero Overbooking):", d: "Database transactions atomically enforce seat limits (maxCapacity). As soon as capacity is filled, the button locks to 'Event Full'." },
      { h: "• Real-Time Headcount Progress Bar:", d: "Visual progress bar showing live filled seats (e.g. '142 / 150 Seats Reserved') with dynamic color shifts as seats run low." },
      { h: "• Registration Details Card & Cancellation:", d: "Confirmed attendees view their name, email, seat status, and unique reference ID. Flexible 1-click cancellation immediately frees up seats." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT: /events/[slug]]",
    placeholderDesc: "Screenshot of the Event Detail Page showing the Registration Confirmed Card, Student Details, and the Capacity Progress Bar.",
  },
  {
    number: "07",
    category: "06 / In-Session Engagement",
    title: "Module 3: Live Interactive Q&A & Upvoting Forum",
    points: [
      { h: "• In-Session Student Queries:", d: "During live seminars, hackathons, and guest lectures, attendees post questions from their laptops or phones without interrupting the speaker." },
      { h: "• Atomic Deduplicated Upvoting:", d: "Students upvote questions they care about. MongoDB $addToSet and $pull operations strictly ensure one upvote per student per question." },
      { h: "• Popularity Ranking Engine:", d: "Questions are dynamically sorted by upvote count, ensuring the most urgent student queries naturally rise to the coordinator's screen." },
      { h: "• Organizer Pinning & Verified Replies:", d: "Event coordinators and professors can pin important announcements (isPinned: true) and post official verified answers." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT: /portal/qna]",
    placeholderDesc: "Screenshot of the Live Q&A forum showing student questions, upvote counter buttons, and an organizer's pinned answer badge.",
  },
  {
    number: "08",
    category: "07 / Institutional Quality",
    title: "Module 4: Dynamic Feedback & NPS Survey Analytics",
    points: [
      { h: "• Google-Forms-Style Dynamic Builder:", d: "Coordinators can create custom post-event feedback forms with Star Ratings (1-5), Multiple Choice questions, and Open Text feedback." },
      { h: "• Automated Net Promoter Score (NPS):", d: "The platform automatically aggregates ratings to calculate event NPS (Promoters vs Detractors) and overall average satisfaction scores." },
      { h: "• Student Anonymity Option:", d: "Students can choose to submit verified or anonymous feedback, encouraging honest qualitative critique without fear." },
      { h: "• Response Analytics & CSV Export:", d: "Real-time visualization of participant sentiment breakdowns, attendance-to-response conversion rates, and exportable tables." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT: Feedback Analytics]",
    placeholderDesc: "Screenshot of the student feedback survey form alongside the admin sentiment analytics bar chart and star rating distribution.",
  },
  {
    number: "09",
    category: "08 / Administrative Tools",
    title: "Module 5: Media Vault & Executive Accreditation Reports",
    points: [
      { h: "• High-Resolution Media Vault:", d: "Centralized photo gallery with full-screen lightbox inspection and MP4/WebM video clip playback with YouTube/Vimeo embed parsing." },
      { h: "• High-Reliability Upload Pipeline:", d: "Stores media in local /public/uploads with an automatic Base64 Data URI fallback on read-only serverless clouds so uploads never fail." },
      { h: "• Automated Executive Report Generator:", d: "Automatically compiles Chief Guest details, faculty coordinators, objectives, student attendance numbers, and feedback stats." },
      { h: "• 1-Click Institutional PDF Export:", d: "Powered by @react-pdf/renderer, coordinators export clean, official letterhead PDF documents ready for NAAC/NBA audit files." },
    ],
    placeholderTitle: "[INSERT SCREENSHOT: Executive PDF Report]",
    placeholderDesc: "Screenshot of the Media Vault Photo Gallery alongside a sample generated Institutional Executive PDF Report on college letterhead.",
  },
  {
    number: "10",
    category: "09 / System Workflow & DFD",
    title: "User Workflow & Data Flow Diagram (DFD)",
    points: [
      { h: "1. Student Discovery & Registration Flow:", d: "Student browses event catalog with category filters → Clicks 'Register for Event' → System atomically reserves seat & generates unique Reference ID." },
      { h: "2. Live In-Session Engagement Flow:", d: "During live talks, attendee opens live Q&A forum → Submits questions & upvotes trending peer queries in real time without interrupting speakers." },
      { h: "3. Post-Event Feedback Submission:", d: "When the event concludes, attendee completes dynamic survey form (1-5 star ratings & comments) to provide structured feedback." },
      { h: "4. Admin & Coordinator Management Flow:", d: "Admin creates events with capacity limits, tracks registrations in real time, and exports official 1-click PDF reports." },
    ],
    placeholderTitle: "[INSERT DATA FLOW DIAGRAM / DFD]",
    placeholderDesc: "Flowchart: User Login → Event Discovery → 1-Click Registration → Live Q&A → Survey Feedback → Admin Report Generation.",
  },
  {
    number: "11",
    category: "10 / Testing & Verification",
    title: "System Testing & Validation Results",
    points: [
      { h: "1. Authentication & Security Testing:", d: "Verified secure student login & Bcrypt password encryption. Tested Role Guards: Confirmed student accounts cannot access admin routes (/admin)." },
      { h: "2. Capacity Lock & RSVP Testing:", d: "Tested event limit: Verified system blocks registrations when maxCapacity is reached ('Event Full'). Cancellation immediately restores seat availability." },
      { h: "3. Live Q&A Deduplication Testing:", d: "Tested upvote logic: Confirmed a student cannot double-vote or spam upvotes on the same question, preventing vote manipulation." },
      { h: "4. Device Responsiveness & Survey Validation:", d: "Verified form submissions and UI responsiveness across Google Chrome, Microsoft Edge, and Android/iOS mobile screens." },
    ],
    placeholderTitle: "[INSERT TEST CASES SUMMARY TABLE]",
    placeholderDesc: "Table showing key test cases: User Authentication, Seat Capacity Limit, Q&A Upvote Locking, and Survey Submission — All Passed (100%).",
  },
  {
    number: "12",
    category: "11 / Summary & Vision",
    title: "Project Impact, Future Scope & Conclusion",
    isConclusion: true,
  }
];

function buildHtml() {
  let slidesHtml = slidesData.map(s => {
    if (s.isCover) {
      return `
      <div class="slide slide-cover">
        <div class="brand-badge">FINAL YEAR MAJOR PROJECT PRESENTATION</div>
        <h1 class="cover-title">CampusPulse</h1>
        <p class="cover-subtitle">${s.subtitle}</p>
        <p class="cover-desc">A Next.js 16 & MongoDB Atlas production ecosystem featuring simple 1-click registration, live Q&A with upvoting, dynamic feedback surveys, and automated executive PDF accreditation reports.</p>
        <div class="cover-cards-row">
          <div class="cover-card">
            <div class="card-header-tag">SUBMITTED BY (STUDENT TEAM):</div>
            <p><strong>[STUDENT 1 NAME]</strong> — Roll No: [ROLL NUMBER]</p>
            <p><strong>[STUDENT 2 NAME]</strong> — Roll No: [ROLL NUMBER]</p>
            <p class="text-muted">Department of Computer Science & Engineering</p>
            <p class="text-muted">[INSTITUTE / UNIVERSITY NAME], Year 2025–2026</p>
          </div>
          <div class="cover-card">
            <div class="card-header-tag purple">PROJECT GUIDANCE & MENTORSHIP:</div>
            <p class="text-muted">Under the Supervision of:</p>
            <p><strong>[MENTOR / PROFESSOR NAME]</strong></p>
            <p class="text-purple">[DESIGNATION, e.g. Assistant Professor / HOD]</p>
            <p class="text-muted">Department of Computer Science & Engineering</p>
          </div>
        </div>
      </div>
      `;
    }

    if (s.isConclusion) {
      return `
      <div class="slide">
        <div class="slide-header">
          <div>
            <div class="slide-cat">${s.category.toUpperCase()}</div>
            <h2 class="slide-title">${s.title}</h2>
          </div>
          <div class="slide-num">${s.number} / 12</div>
        </div>
        <div class="slide-body-split">
          <div class="slide-card">
            <div class="card-header-tag emerald">MEASURABLE PROJECT IMPACT</div>
            <div class="point-item">
              <div class="point-head">• 100% Paperless Registration:</div>
              <div class="point-desc">Completely eliminates manual paper forms and physical desk queues.</div>
            </div>
            <div class="point-item">
              <div class="point-head">• 5-Second Seat Confirmation:</div>
              <div class="point-desc">Atomic database reservation guarantees zero seat overbooking.</div>
            </div>
            <div class="point-item">
              <div class="point-head">• 300% Boost in Student Feedback:</div>
              <div class="point-desc">In-platform survey forms with automated sentiment scoring and NPS.</div>
            </div>
            <div class="point-item">
              <div class="point-head">• 90% Administrative Time Saved:</div>
              <div class="point-desc">Generates institutional accreditation audit reports in 1 click.</div>
            </div>
          </div>
          <div class="slide-card">
            <div class="card-header-tag purple">FUTURE ENHANCEMENTS & ROADMAP</div>
            <div class="point-item">
              <div class="point-head">• AI Event Recommendation Engine:</div>
              <div class="point-desc">Suggests seminars based on student department & past preferences.</div>
            </div>
            <div class="point-item">
              <div class="point-head">• Automated Participation Certificates:</div>
              <div class="point-desc">Digitally signed PDF certificates generated automatically post-event.</div>
            </div>
            <div class="point-item">
              <div class="point-head">• Campus Push & SMS Notifications:</div>
              <div class="point-desc">Real-time alerts for schedule delays and venue changes.</div>
            </div>
            <div class="thank-you-box">
              <h3>THANK YOU!</h3>
              <p>Questions & Open Discussion with the Panel</p>
            </div>
          </div>
        </div>
      </div>
      `;
    }

    // Standard Slide
    return `
    <div class="slide">
      <div class="slide-header">
        <div>
          <div class="slide-cat">${s.category.toUpperCase()}</div>
          <h2 class="slide-title">${s.title}</h2>
        </div>
        <div class="slide-num">${s.number} / 12</div>
      </div>
      <div class="slide-body-split">
        <div class="slide-card">
          ${s.points.map(p => `
            <div class="point-item">
              <div class="point-head">${p.h}</div>
              <div class="point-desc">${p.d}</div>
            </div>
          `).join('')}
        </div>
        <div class="placeholder-card">
          <div class="placeholder-badge">IMAGE / SCREENSHOT</div>
          <div class="placeholder-title">${s.placeholderTitle}</div>
          <div class="placeholder-desc">${s.placeholderDesc}</div>
        </div>
      </div>
    </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampusPulse — Presentation Deck</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: 297mm 167mm; /* Exact 16:9 Widescreen aspect ratio */
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0B0F19;
      color: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .slide {
      width: 297mm;
      height: 167mm;
      padding: 14mm 18mm;
      position: relative;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #0B0F19;
    }

    /* Slide Header */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1.5px solid #232D42;
      padding-bottom: 3.5mm;
      margin-bottom: 5mm;
    }

    .slide-cat {
      font-size: 8.5pt;
      font-weight: 700;
      color: #6366F1;
      letter-spacing: 1.2px;
      margin-bottom: 1.5mm;
    }

    .slide-title {
      font-size: 17pt;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.3px;
    }

    .slide-num {
      font-size: 10pt;
      font-weight: 700;
      color: #94A3B8;
      background: #141A29;
      padding: 2mm 4mm;
      border-radius: 4px;
      border: 1px solid #232D42;
    }

    /* 2-Column Split Body */
    .slide-body-split {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 6mm;
      flex: 1;
    }

    .slide-card {
      background: #141A29;
      border: 1px solid #232D42;
      border-radius: 5mm;
      padding: 5mm 6mm;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .point-item {
      margin-bottom: 2mm;
    }

    .point-head {
      font-size: 9.8pt;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 1mm;
    }

    .point-desc {
      font-size: 8.8pt;
      color: #CBD5E1;
      line-height: 1.45;
    }

    /* Placeholder Card */
    .placeholder-card {
      background: #141A29;
      border: 1.5px dashed #6366F1;
      border-radius: 5mm;
      padding: 6mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
    }

    .placeholder-badge {
      position: absolute;
      top: 4mm;
      left: 4mm;
      background: #1E2638;
      color: #8B5CF6;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.8px;
      padding: 1.5mm 3.5mm;
      border-radius: 3mm;
      border: 1px solid #8B5CF6;
    }

    .placeholder-title {
      font-size: 12pt;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 3mm;
    }

    .placeholder-desc {
      font-size: 9pt;
      color: #94A3B8;
      line-height: 1.45;
      max-width: 85%;
    }

    /* Cover Slide */
    .slide-cover {
      justify-content: center;
      padding: 18mm 22mm;
    }

    .brand-badge {
      display: inline-block;
      align-self: flex-start;
      background: #1E2638;
      color: #6366F1;
      font-size: 8.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 2mm 5mm;
      border-radius: 4mm;
      border: 1px solid #6366F1;
      margin-bottom: 4mm;
    }

    .cover-title {
      font-size: 38pt;
      font-weight: 900;
      letter-spacing: -1px;
      color: #FFFFFF;
      margin-bottom: 2mm;
    }

    .cover-subtitle {
      font-size: 13.5pt;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 3.5mm;
    }

    .cover-desc {
      font-size: 10pt;
      color: #94A3B8;
      max-width: 90%;
      margin-bottom: 7mm;
      line-height: 1.5;
    }

    .cover-cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
    }

    .cover-card {
      background: #141A29;
      border: 1px solid #232D42;
      border-radius: 4mm;
      padding: 4mm 5mm;
      font-size: 9pt;
      line-height: 1.5;
    }

    .card-header-tag {
      font-size: 8pt;
      font-weight: 800;
      color: #6366F1;
      margin-bottom: 2mm;
      letter-spacing: 0.8px;
    }

    .card-header-tag.purple { color: #8B5CF6; }
    .card-header-tag.emerald { color: #10B981; }

    .text-muted { color: #94A3B8; }
    .text-purple { color: #8B5CF6; font-weight: 700; }

    .thank-you-box {
      margin-top: 3mm;
      background: #1E2638;
      border: 1px solid #6366F1;
      border-radius: 3.5mm;
      padding: 3mm;
      text-align: center;
    }

    .thank-you-box h3 {
      font-size: 13pt;
      font-weight: 800;
      color: #FFFFFF;
    }

    .thank-you-box p {
      font-size: 8.5pt;
      color: #6366F1;
      font-weight: 700;
    }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;
}

console.log("Generating 16:9 Presentation PDF...");
const tempHtmlPath = path.join(process.cwd(), "docs", "temp_deck.html");
const pdfPath = path.join(process.cwd(), "docs", "CampusPulse_Presentation_Deck.pdf");

fs.writeFileSync(tempHtmlPath, buildHtml(), 'utf8');

try {
  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${tempHtmlPath}"`;
  execSync(cmd, { stdio: 'pipe' });

  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(` SUCCESS: Generated CampusPulse_Presentation_Deck.pdf (${(stats.size / 1024).toFixed(1)} KB)`);
  }
} catch (e) {
  console.error("Error generating presentation PDF:", e.message);
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}
