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
  // SLIDE 4: SYSTEM ARCHITECTURE & TECH STACK (SIMPLIFIED)
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "System Architecture & Technologies Used", "03 / Technical Overview", 4);

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
      { text: "1. Frontend (User Interface):\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• React.js & Next.js: For building clean, interactive web pages and smooth page navigation.\n• Tailwind CSS: Provides a modern, responsive design that works on both mobile phones and laptops.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "2. Backend (Application Logic):\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• Node.js & Next.js: Handles event registrations, form submissions, and user requests.\n• NextAuth: Simple and secure login management for students and college admins.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "3. Database (Data Storage):\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• MongoDB Atlas: Cloud NoSQL database that stores user profiles, event details, and survey feedback.\n• Mongoose: Connects our application easily to MongoDB with structured data schemas.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "4. Architecture & Mobile Support:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• 3-Tier Architecture: Presentation Layer (UI) → Application Layer (Server) → Database (MongoDB).\n• Capacitor: Packages the web project into an installable Android App (APK).", options: { color: TEXT_LIGHT, fontSize: 10 } },
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
      "[INSERT 3-TIER ARCHITECTURE DIAGRAM]",
      "Simple 3-tier diagram: User Interface (Web / Android) → Application Server (Node/Next.js) → Cloud Database (MongoDB Atlas)."
    );

    slide.addNotes("Sir, our project is built using a standard 3-Tier Architecture: Frontend, Backend, and Database. For the frontend, we use React and Next.js with Tailwind CSS for a responsive UI. For the backend, we use Node.js and NextAuth for secure student and admin login. For the database, we use MongoDB Atlas to store all event and user records. Finally, using Capacitor, we also compiled it into an Android app.");
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
  // SLIDE 10: USER WORKFLOW & DATA FLOW DIAGRAM (DFD)
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "User Workflow & Data Flow Diagram (DFD)", "09 / System Workflow & DFD", 10);

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
      { text: "1. Student Discovery & Registration Flow:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• Student browses the event catalog with category filters (Technical/Cultural/Sports).\n• Clicks 'Register for Event' → System atomically reserves the seat & generates a unique Reference ID.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "2. Live In-Session Engagement Flow:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• During live talks/sessions, attendee opens the live Q&A forum.\n• Submits questions & upvotes trending peer queries in real time without interrupting speakers.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "3. Post-Event Feedback Submission:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• When the event concludes, attendee completes a dynamic survey form (1-5 star ratings & comments).\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "4. Admin & Coordinator Management Flow:\n", options: { bold: true, color: ACCENT_INDIGO, fontSize: 11.5 } },
      { text: "• Admin creates events with capacity limits, monitors registrations, and exports 1-click PDF reports.", options: { color: TEXT_LIGHT, fontSize: 10 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 14,
    });

    addPlaceholder(
      slide,
      "[INSERT DATA FLOW DIAGRAM / DFD]",
      "Flowchart: User Login → Event Discovery → 1-Click Registration → Live Q&A → Survey Feedback → Admin Report Generation."
    );

    slide.addNotes("Sir, Slide 10 explains the complete User Workflow and Data Flow. A student logs in, discovers events, and registers with 1 click. During the event, they participate in live Q&A, and post-event they submit feedback. On the coordinator side, all registrations and feedback are tracked in real time.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 11: SYSTEM TESTING & VALIDATION RESULTS
  // ═══════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, "System Testing & Validation Results", "10 / Testing & Verification", 11);

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
      { text: "1. Authentication & Security Testing:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "• Verified secure student login & password encryption via Bcrypt.\n• Tested Role Guards: Confirmed student accounts cannot access admin routes (/admin).\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "2. Capacity Lock & RSVP Testing:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "• Tested event limit: Verified system blocks registrations when maxCapacity is reached ('Event Full').\n• Verified that cancellation immediately restores seat availability for other students.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "3. Live Q&A Deduplication Testing:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "• Tested upvote logic: Confirmed a student cannot double-vote or spam upvotes on the same question.\n\n", options: { color: TEXT_LIGHT, fontSize: 10 } },

      { text: "4. Device Responsiveness & Survey Validation:\n", options: { bold: true, color: ACCENT_PURPLE, fontSize: 11.5 } },
      { text: "• Verified form submissions and UI responsiveness across Google Chrome, Edge, and mobile screens.", options: { color: TEXT_LIGHT, fontSize: 10 } },
    ], {
      x: 1.1,
      y: 1.75,
      w: 5.0,
      h: 4.8,
      fontFace: "Calibri",
      lineSpacing: 14,
    });

    addPlaceholder(
      slide,
      "[INSERT TEST CASES SUMMARY TABLE]",
      "Table showing key test cases: User Authentication, Seat Capacity Limit, Q&A Upvote Locking, and Survey Submission — All Passed (100%)."
    );

    slide.addNotes("In Slide 11, we cover system testing. We conducted functional testing on core modules: verifying that capacity locks prevent overbooking, upvoting cannot be duplicated, unauthorized users cannot access admin pages, and forms validate correctly across mobile and desktop.");
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
