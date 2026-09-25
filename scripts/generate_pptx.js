// scripts/generate_pptx.js
// Generates a 12-Slide Master PowerPoint Presentation (.pptx) for CampusPulse
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

async function generatePresentation() {
  console.log("Generating CampusPulse 12-Slide PowerPoint Presentation...");

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 13.33 x 7.5 inches
  pres.author = "CampusPulse Project Team";
  pres.title = "CampusPulse — Master Project Presentation";
  pres.company = "CampusPulse University Platform";

  // Palette Tokens
  const BG_COLOR = "0B0F19";
  const CARD_BG = "141A29";
  const CARD_BORDER = "232D42";
  const ACCENT_INDIGO = "6366F1";
  const ACCENT_PURPLE = "8B5CF6";
  const ACCENT_EMERALD = "10B981";
  const TEXT_WHITE = "FFFFFF";
  const TEXT_MUTED = "94A3B8";
  const TEXT_LIGHT = "E2E8F0";

  function addHeader(slide, title, category, slideNumber) {
    // Header Banner
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 0.4,
      w: 11.73,
      h: 0.9,
      fill: { color: "000000", transparency: 100 },
      line: { color: "000000", transparency: 100 }
    });

    // Category Tag
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.45,
      w: 8.0,
      h: 0.25,
      fontSize: 10,
      fontFace: "Calibri",
      color: ACCENT_INDIGO,
      bold: true,
      charSpacing: 1.5,
    });

    // Slide Main Title
    slide.addText(title, {
      x: 0.8,
      y: 0.72,
      w: 9.5,
      h: 0.5,
      fontSize: 22,
      fontFace: "Segoe UI",
      color: TEXT_WHITE,
      bold: true,
    });

    // Slide Number Badge
    slide.addText(`${slideNumber} / 12`, {
      x: 11.3,
      y: 0.55,
      w: 1.2,
      h: 0.35,
      fontSize: 11,
      fontFace: "Segoe UI",
      color: TEXT_MUTED,
      align: "right",
      bold: true,
    });

    // Subtle divider
    slide.addShape(pres.ShapeType.line, {
      x: 0.8,
      y: 1.25,
      w: 11.73,
      h: 0,
      line: { color: CARD_BORDER, width: 1.2 }
    });
  }

  function addPlaceholder(slide, label, subtext, x = 6.8, y = 1.55, w = 5.7, h = 5.2) {
    // Box
    slide.addShape(pres.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: ACCENT_INDIGO, width: 1.5, dashType: "dash" },
    });

    // Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: x + 0.4,
      y: y + 0.4,
      w: 2.2,
      h: 0.35,
      rectRadius: 0.08,
      fill: { color: "1E2638" },
      line: { color: ACCENT_PURPLE, width: 1 },
    });
    slide.addText("IMAGE / SCREENSHOT", {
      x: x + 0.4,
      y: y + 0.4,
      w: 2.2,
      h: 0.35,
      fontSize: 9,
      fontFace: "Segoe UI",
      color: ACCENT_PURPLE,
      bold: true,
      align: "center",
    });

    // Center Instructions
    slide.addText(label, {
      x: x + 0.4,
      y: y + 1.8,
      w: w - 0.8,
      h: 0.8,
      fontSize: 14,
      fontFace: "Segoe UI",
      color: TEXT_WHITE,
      bold: true,
      align: "center",
    });

    slide.addText(subtext, {
      x: x + 0.4,
      y: y + 2.6,
      w: w - 0.8,
      h: 1.2,
      fontSize: 11,
      fontFace: "Calibri",
      color: TEXT_MUTED,
      align: "center",
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 1: TITLE SLIDE
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    // Brand Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 0.8,
      w: 3.2,
      h: 0.4,
      rectRadius: 0.1,
      fill: { color: "1E2638" },
      line: { color: ACCENT_INDIGO, width: 1 }
    });
    slide.addText("FINAL YEAR MAJOR PROJECT", {
      x: 0.8,
      y: 0.8,
      w: 3.2,
      h: 0.4,
      fontSize: 10,
      fontFace: "Segoe UI",
      color: ACCENT_INDIGO,
      bold: true,
      align: "center",
      charSpacing: 1.2,
    });

    // Main Title
    slide.addText("CampusPulse", {
      x: 0.8,
      y: 1.35,
      w: 11.0,
      h: 1.2,
      fontSize: 48,
      fontFace: "Segoe UI",
      color: TEXT_WHITE,
      bold: true,
    });

    // Subtitle
    slide.addText("Enterprise Campus Event Discovery, Real-Time Engagement & Institutional Analytics Platform", {
      x: 0.8,
      y: 2.55,
      w: 11.5,
      h: 0.6,
      fontSize: 16,
      fontFace: "Segoe UI",
      color: ACCENT_PURPLE,
      bold: true,
    });

    // Description text
    slide.addText("A Next.js 16 & MongoDB Atlas production ecosystem featuring simple 1-click registration, live Q&A with upvoting, dynamic feedback surveys, and automated executive PDF accreditation reports.", {
      x: 0.8,
      y: 3.25,
      w: 11.0,
      h: 0.7,
      fontSize: 12,
      fontFace: "Calibri",
      color: TEXT_MUTED,
      lineSpacing: 18,
    });

    // Left Card: Team
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 4.3,
      w: 5.6,
      h: 2.4,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });
    slide.addText("SUBMITTED BY (STUDENT TEAM):", {
      x: 1.1,
      y: 4.5,
      w: 5.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Segoe UI",
      color: ACCENT_INDIGO,
      bold: true,
    });
    slide.addText([
      { text: "• [STUDENT 1 NAME] — Roll No: [ROLL NUMBER]\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "• [STUDENT 2 NAME] — Roll No: [ROLL NUMBER]\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "• Department of Computer Science & Engineering\n", options: { color: TEXT_MUTED } },
      { text: "• [INSTITUTE / UNIVERSITY NAME], Academic Year 2025–2026", options: { color: TEXT_MUTED } },
    ], {
      x: 1.1,
      y: 4.85,
      w: 5.0,
      h: 1.6,
      fontSize: 11,
      fontFace: "Calibri",
      lineSpacing: 18,
    });

    // Right Card: Guide
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 4.3,
      w: 5.7,
      h: 2.4,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });
    slide.addText("PROJECT GUIDANCE & MENTORSHIP:", {
      x: 7.1,
      y: 4.5,
      w: 5.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Segoe UI",
      color: ACCENT_PURPLE,
      bold: true,
    });
    slide.addText([
      { text: "Under the Supervision of:\n", options: { color: TEXT_MUTED } },
      { text: "[MENTOR / PROFESSOR NAME]\n", options: { bold: true, fontSize: 13, color: TEXT_WHITE } },
      { text: "[DESIGNATION, e.g. Assistant Professor / HOD]\n", options: { color: ACCENT_PURPLE } },
      { text: "Department of Computer Science & Engineering\n[COLLEGE / UNIVERSITY NAME]", options: { color: TEXT_MUTED } },
    ], {
      x: 7.1,
      y: 4.85,
      w: 5.0,
      h: 1.6,
      fontSize: 11,
      fontFace: "Calibri",
      lineSpacing: 18,
    });

    slide.addNotes("Good morning respected evaluators, teachers, and panel members. Today we are presenting CampusPulse — an enterprise-grade university event discovery, live engagement, and institutional reporting platform.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 2: PROBLEM STATEMENT
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Problem Statement & Campus Challenges", "01 / Context & Background", 2);

    // Left Column Content
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "1. Scattered & Fragmented Notice Distribution:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 12 } },
      { text: "Event flyers and circulars get buried across multiple unorganized WhatsApp groups, chaotic email inboxes, and physical notice boards. Students frequently miss critical deadlines and venue announcements.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "2. Inefficient & Manual Registration Queues:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 12 } },
      { text: "Paper forms and manual spreadsheet entries create massive desk bottlenecks, handwriting errors, lost registrations, and frequent seat overbooking due to lack of real-time capacity locks.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "3. Low Student Feedback Participation:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 12 } },
      { text: "Traditional post-event Google Forms see less than 10% student participation, with zero automated sentiment analysis, leaving organizers blind to attendee satisfaction.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "4. Heavy Accreditation (NAAC/NBA) Documentation:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 12 } },
      { text: "Faculty coordinators spend weeks compiling attendance records, photos, and outcomes manually for institutional accreditation audits.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    // Right Column Placeholder
    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT / GRAPHIC]",
      "Diagram showing chaotic campus paper notices, fragmented WhatsApp circulars, and long manual registration queues."
    );

    slide.addNotes("In traditional university environments, event coordination is fragmented across unorganized WhatsApp chats, manual paper forms leading to seat overbooking, and negligible student feedback.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 3: PROPOSED SOLUTION & OBJECTIVES
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Proposed Solution & Project Objectives", "02 / Strategic Vision", 3);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "1. Centralized Campus Event Hub:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 12 } },
      { text: "A single unified responsive web and mobile portal aggregating Technical, Cultural, Sports, and Academic Workshop events across all departments.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "2. Simple 1-Click RSVP with Capacity Control:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 12 } },
      { text: "Instant seat reservation backed by atomic database locks to prevent overbooking, accompanied by an instant digital Registration Confirmation Card.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "3. Interactive In-Session Student Q&A:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 12 } },
      { text: "Live session engagement board with atomic deduplicated student upvotes, allowing trending questions to rise to the speaker's attention.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "4. Dynamic Feedback & Automated Accreditation Reports:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 12 } },
      { text: "Google-Forms-style survey builder with real-time Net Promoter Score (NPS) analytics and 1-Click Executive PDF Letterhead reports for college administration.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT / DIAGRAM]",
      "CampusPulse high-level ecosystem diagram connecting Students, Event Coordinators, Live Q&A, Feedback, and Admin Reports."
    );

    slide.addNotes("CampusPulse solves these problems with a unified, 4-pillar solution: a centralized event directory, simple 1-click registration with capacity limits, live Q&A with upvoting, and automated accreditation reporting.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 4: SYSTEM ARCHITECTURE & TECH STACK
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "System Architecture & Technology Stack", "03 / Technical Foundations", 4);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• Frontend Layer:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Next.js 16.3.3 (Turbopack, App Router), React 19.2.8, Tailwind CSS v4, Framer Motion for smooth micro-animations, Lucide React icons.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "• Backend & Server Actions:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Next.js Server Actions (src/actions/) with 50MB body streaming, Edge Route Handlers, role-based middleware guards.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "• Database & ORM:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "MongoDB Atlas Cloud, Mongoose 9.9.4 with Global Connection Caching Singleton and Google Public DNS (8.8.8.8) SRV resolver.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "• Authentication & Security:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "NextAuth.js v4 (Stateless JWT sessions, Bcrypt password hashing with 10 salt rounds, strict student/admin RBAC).\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "• Mobile & Deployment:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Capacitor 8.5 (Native Android APK), Netlify Serverless with automated GitHub webhooks, Multi-stage Docker container.", options: { color: TEXT_LIGHT, fontSize: 10 } },
    ], {
      x: 1.1,
      y: 1.7,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 14,
    });

    addPlaceholder(
      slide,
      "[INSERT ARCHITECTURE DIAGRAM]",
      "Three-tier architecture diagram showing Client (Web & Android), Next.js 16 Server Actions / NextAuth, and MongoDB Atlas Persistence layer."
    );

    slide.addNotes("CampusPulse is built using the latest industry standards: Next.js 16 App Router with Turbopack, React 19, MongoDB Atlas with connection pooling, NextAuth with Bcrypt encryption, and Capacitor for native Android deployment.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 5: MODULE 1 — EVENT DISCOVERY & DIRECTORY
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Module 1: Event Discovery & Categorized Directory", "04 / Core Features", 5);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• Multi-Category Academic Catalog:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Events categorized into Technical (Hackathons, Coding), Cultural (Fests, Music), Sports (Tournaments), and Academic Workshops.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Real-Time Fuzzy Search & Filtering:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Students can instantly search by title, department, tags, or venue with dynamic status toggles (Upcoming, Ongoing, Completed).\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Rich Event Detail View:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Each event showcases high-res banner media, detailed schedules, venue location, faculty coordinator contacts, and prerequisites.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• 1-Click Viral Social Sharing:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Deep-linked sharing modal for WhatsApp, Telegram, LinkedIn, and X/Twitter with pre-formatted event titles and registration links.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT: /events]",
      "Screenshot of the CampusPulse Event Discovery Catalog showing category filter pills, search bar, and colorful event cards."
    );

    slide.addNotes("Module 1 is our Event Discovery catalog. Students can browse, filter across Technical, Cultural, and Sports categories, search in real time, and share event links to WhatsApp or Telegram with one tap.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 6: MODULE 2 — SIMPLE 1-CLICK REGISTRATION
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Module 2: Simple 1-Click Registration & Capacity Control", "05 / Core Features", 6);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• Frictionless 1-Click Registration:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Logged-in students click 'Register for Event' and are instantly enrolled without filling repetitive personal details or manual forms.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Atomic Capacity Lock (Zero Overbooking):\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Database transactions atomically enforce seat limits (maxCapacity). As soon as capacity is filled, the button locks to 'Event Full'.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Real-Time Headcount Progress Bar:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Visual progress bar showing live filled seats (e.g. '142 / 150 Seats Reserved') with dynamic color shifts as seats run low.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Registration Details Card & Cancellation:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Confirmed attendees view their name, email, seat status, and unique reference ID. Flexible 1-click cancellation immediately frees up seats for other students.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT: /events/[slug]]",
      "Screenshot of the Event Detail Page showing the Registration Confirmed Card, Student Details, and the Capacity Progress Bar."
    );

    slide.addNotes("Module 2 handles simple 1-click registration. We enforce atomic seat capacity locks to completely prevent overbooking, and provide students with an immediate confirmation card and flexible cancellation.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 7: MODULE 3 — LIVE Q&A FORUM
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Module 3: Live Interactive Q&A & Upvoting Forum", "06 / In-Session Engagement", 7);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• In-Session Student Queries:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "During live seminars, hackathons, and guest lectures, attendees post questions from their laptops or phones without interrupting the speaker.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Atomic Deduplicated Upvoting:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Students upvote questions they care about. MongoDB $addToSet and $pull operations strictly ensure one upvote per student per question.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Popularity Ranking Engine:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Questions are dynamically sorted by upvote count, ensuring the most urgent student queries naturally rise to the coordinator's screen.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Organizer Pinning & Verified Replies:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Event coordinators and professors can pin important announcements (isPinned: true) and post official verified answers.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT: /portal/qna]",
      "Screenshot of the Live Q&A forum showing student questions, upvote counter buttons, and an organizer's pinned answer badge."
    );

    slide.addNotes("Module 3 is our Live Q&A engagement engine. Students can submit questions during guest lectures and upvote trending queries. Organizers can pin critical updates and reply with official badges.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 8: MODULE 4 — DYNAMIC FEEDBACK ENGINE
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Module 4: Dynamic Feedback & NPS Survey Analytics", "07 / Institutional Quality", 8);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• Google-Forms-Style Dynamic Builder:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Coordinators can create custom post-event feedback forms with Star Ratings (1-5), Multiple Choice questions, and Open Text feedback.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Automated Net Promoter Score (NPS):\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "The platform automatically aggregates ratings to calculate event NPS (Promoters vs Detractors) and overall average satisfaction scores.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Student Anonymity Option:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Students can choose to submit verified or anonymous feedback, encouraging honest qualitative critique without fear.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Response Analytics & CSV Export:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Real-time visualization of participant sentiment breakdowns, attendance-to-response conversion rates, and exportable tables.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT: Feedback Analytics]",
      "Screenshot of the student feedback survey form alongside the admin sentiment analytics bar chart and star rating distribution."
    );

    slide.addNotes("Module 4 is our Dynamic Feedback Builder. Coordinators configure custom question surveys, and the system automatically calculates average ratings and Net Promoter Scores for institutional review.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 9: MODULE 5 — MEDIA VAULT & EXECUTIVE REPORTS
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Module 5: Media Vault & Executive Accreditation Reports", "08 / Administrative Tools", 9);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• High-Resolution Media Vault:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Centralized photo gallery with full-screen lightbox inspection and MP4/WebM video clip playback with YouTube/Vimeo embed parsing.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• High-Reliability Upload Pipeline:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Stores media in local /public/uploads with an automatic Base64 Data URI fallback on read-only serverless clouds so uploads never fail.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Automated Executive Report Generator:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Automatically compiles Chief Guest details, faculty coordinators, objectives, student attendance numbers, and feedback stats.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• 1-Click Institutional PDF Export:\n", options: { bold: true, color: ACCENT_EMERALD, fontSize: 11.5 } },
      { text: "Powered by @react-pdf/renderer, coordinators export clean, official letterhead PDF documents ready for NAAC/NBA audit files.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT: Executive PDF Report]",
      "Screenshot of the Media Vault Photo Gallery alongside a sample generated Institutional Executive PDF Report on college letterhead."
    );

    slide.addNotes("Module 5 provides a high-resolution media showcase and our 1-click executive report generator. It compiles attendance data, objectives, and feedback into a clean printable PDF required for college accreditation.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 10: NATIVE ANDROID MOBILE APP (CAPACITOR 8.5)
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Native Android Mobile Application (Capacitor 8.5)", "09 / Cross-Platform Engineering", 10);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• Hybrid Native Architecture:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Packaged using Capacitor 8.5 into a full-screen, hardware-accelerated Android WebView with native lifecycle controls.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Standalone Production Binary (CampusPulse.apk):\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Pre-compiled APK (Application ID: com.campuspulse.app, Size: ~3.68 MB) ready for direct sideloading and Play Store distribution.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Native Assets & Brand Isolation:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Custom branded splash screens (splash.png) and adaptive launcher icons across all Android DPI buckets (hdpi to xxxhdpi).\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Live Sync Cloud Updates:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "Connects to production remote URL (APP_URL), enabling web updates to reflect instantly on mobile devices without requiring app store updates.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT SCREENSHOT: Android App / Phone Mockup]",
      "Photo of CampusPulse running on an Android smartphone screen, showing the mobile navigation drawer and event cards."
    );

    slide.addNotes("CampusPulse is not just a website; it is packaged as a native Android APK using Capacitor 8.5. We have already compiled CampusPulse.apk which can be installed directly on any student smartphone.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 11: SECURITY, RBAC & DEVOPS DEPLOYMENT
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Security, RBAC & Multi-Platform DevOps", "10 / DevOps & Governance", 11);

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText([
      { text: "• Role-Based Access Control (RBAC):\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Server-level guards (requireAdmin(), requireAuth()) strictly protect admin panels, survey creators, and report export endpoints from unauthorized students.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Cryptographic Session Security:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Bcrypt password hashing with 10 salt rounds, stateless 30-day JWT sessions, and security headers (nosniff, X-Frame-Options, XSS protection).\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• 100% Free Serverless Hosting (Netlify):\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Fully configured netlify.toml with automated GitHub webhook CI/CD pipeline. Pushing to origin/main triggers instant live deployment.\n\n", options: { color: TEXT_LIGHT, fontSize: 10.5 } },

      { text: "• Production Multi-Stage Dockerization:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "Lightweight Dockerfile (Node 20 Alpine) with non-root user and docker-compose.yml with persistent volume mounting for VPS hosting.", options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    addPlaceholder(
      slide,
      "[INSERT DEVOPS FLOWCHART]",
      "Diagram showing the CI/CD pipeline: Git Commit -> GitHub Push -> Netlify Automatic Webhook Build -> Live Web & Mobile App."
    );

    slide.addNotes("For security, we enforce Bcrypt password hashing, NextAuth JWT sessions, and server-side RBAC guards. For deployment, we configured 100% free serverless hosting on Netlify with automated CI/CD and Docker containerization.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 12: CONCLUSION, IMPACT & FUTURE SCOPE
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "Project Impact, Future Scope & Conclusion", "11 / Summary & Vision", 12);

    // Left Box: Impact
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 1.55,
      w: 5.6,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText("MEASURABLE PROJECT IMPACT", {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 0.3,
      fontSize: 12,
      fontFace: "Segoe UI",
      color: ACCENT_EMERALD,
      bold: true,
    });

    slide.addText([
      { text: "• 100% Paperless Registration:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "Completely eliminates manual paper forms and physical queue registration.\n\n", options: { color: TEXT_LIGHT } },
      { text: "• 5-Second Seat Confirmation:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "Atomic database reservation guarantees no double-booking.\n\n", options: { color: TEXT_LIGHT } },
      { text: "• 300% Boost in Student Feedback:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "In-platform survey forms with automated sentiment scoring.\n\n", options: { color: TEXT_LIGHT } },
      { text: "• 90% Administrative Time Saved:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "Generates institutional accreditation audit reports in 1 click.", options: { color: TEXT_LIGHT } },
    ], {
      x: 1.1,
      y: 2.15,
      w: 5.0,
      h: 4.2,
      fontSize: 10.5,
      fontFace: "Calibri",
      lineSpacing: 15,
    });

    // Right Box: Future Scope & Thank You
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 1.55,
      w: 5.7,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 }
    });

    slide.addText("FUTURE ENHANCEMENTS & ROADMAP", {
      x: 7.1,
      y: 1.75,
      w: 5.0,
      h: 0.3,
      fontSize: 12,
      fontFace: "Segoe UI",
      color: ACCENT_PURPLE,
      bold: true,
    });

    slide.addText([
      { text: "• AI Event Recommendation Engine:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "Suggests upcoming seminars based on student department & past interests.\n\n", options: { color: TEXT_LIGHT } },
      { text: "• Automated Participation Certificates:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "Digital signed certificates generated automatically post-event.\n\n", options: { color: TEXT_LIGHT } },
      { text: "• Campus Push & SMS Notifications:\n", options: { bold: true, color: TEXT_WHITE } },
      { text: "Real-time alerts for schedule delays and venue changes.\n\n", options: { color: TEXT_LIGHT } },
    ], {
      x: 7.1,
      y: 2.15,
      w: 5.0,
      h: 2.6,
      fontSize: 10.5,
      fontFace: "Calibri",
      lineSpacing: 14,
    });

    // Thank You callout banner
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.1,
      y: 5.0,
      w: 5.1,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: "1E2638" },
      line: { color: ACCENT_INDIGO, width: 1.2 }
    });

    slide.addText("THANK YOU!", {
      x: 7.1,
      y: 5.15,
      w: 5.1,
      h: 0.4,
      fontSize: 16,
      fontFace: "Segoe UI",
      color: TEXT_WHITE,
      bold: true,
      align: "center",
    });

    slide.addText("Questions & Open Discussion with the Panel", {
      x: 7.1,
      y: 5.6,
      w: 5.1,
      h: 0.35,
      fontSize: 11,
      fontFace: "Calibri",
      color: ACCENT_INDIGO,
      bold: true,
      align: "center",
    });

    slide.addNotes("To conclude, CampusPulse provides an end-to-end, paperless campus event ecosystem. In the future, we plan to integrate AI event recommendations and automated certificate generation. Thank you, and we welcome any questions from the panel.");
  }

  // Save the presentation
  const outputDir = path.join(process.cwd(), "docs");
  const outputPath = path.join(outputDir, "CampusPulse_Presentation_Deck.pptx");

  await pres.writeFile({ fileName: outputPath });
  console.log(`\n SUCCESS: Created PowerPoint Presentation at ${outputPath}`);
}

generatePresentation().catch(err => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
