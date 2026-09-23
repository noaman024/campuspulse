# ⚙️ CampusPulse — Features, Modules & Business Logic Manual

**Version:** 1.0.0 (Production)  
**Classification:** Functional Specifications & Feature Mechanics  
**Target Audience:** Product Engineers, Quality Assurance, Institutional Administrators  
**Last Updated:** September 2026  

---

## 1. Feature Index & Module Summary

CampusPulse is engineered around six interconnected functional modules:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CAMPUSPULSE MODULES                             │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ 1. Event Discovery   │ 2. Scannable QR Pass │ 3. Live Q&A Forum             │
│    & Smart RSVP      │    & Door Verify     │    & Upvote Engine            │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 4. Dynamic Feedback  │ 5. Media Vault &     │ 6. Executive Institutional    │
│    Survey Engine     │    Video Processing  │    Reports & PDF Export       │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 2. Module 1: Event Discovery & Smart RSVP

### 1.1 Category & Search Filtering
Events are classified into four university categories:
- **Technical:** Hackathons, coding workshops, robotics challenges, guest tech talks.
- **Cultural:** Annual fests, dance competitions, theatre, music concerts.
- **Sports:** Inter-college cricket, football leagues, chess championships.
- **Workshops:** Hands-on AI labs, resume writing, career guidance seminars.

### 1.2 Capacity Locking & Race Condition Prevention
When an event nears capacity:
1. `maxCapacity` is checked atomically inside `rsvpEventAction()`.
2. If `registeredUsers.length >= maxCapacity`, the RSVP action immediately rejects the request with an error: *"Event has reached full capacity."*
3. The UI renders an amber/red progress bar indicating available seats (e.g., *"142 / 150 Seats Filled"*).

### 1.3 Multi-Platform Event Sharing
Each event card and event details page includes an interactive share modal that generates deep links with pre-filled event titles, venues, and registration links for:
- **WhatsApp Web & Mobile:** `https://api.whatsapp.com/send?text=...`
- **Telegram:** `https://t.me/share/url?url=...&text=...`
- **LinkedIn:** Direct post sharing link
- **X (Twitter):** Pre-composed tweet with hashtags `#CampusPulse #UniversityEvents`

---

## 3. Module 2: Scannable QR Passes & Door Verification

### 2.1 QR Token Generation
Upon completing an RSVP, CampusPulse generates a unique, cryptographically random **UUID v4** token stored in `registeredUsers[i].qrCodeToken`. Using the `qrcode` library, this token is rendered into a high-contrast digital boarding pass containing:
- Attendee full name and student ID
- Event title, date, venue, and seat number
- Live encoded verification URL: `https://<domain>/events/verify/<qrCodeToken>`

### 2.2 Door Security Check-In Workflow
1. Event security personnel or coordinators point any smartphone camera at the student's digital pass.
2. The phone opens `/events/verify/[token]`.
3. The page runs `verifyQrCodeAction(token)`.
4. The screen immediately displays:
   -  **VALID TICKET:** Displays green badge, student photo, department, and registration timestamp.
   -  **ALREADY ATTENDED:** Shows orange warning if ticket was already scanned earlier.
   -  **INVALID / FRAUDULENT:** Shows red alert if the token does not exist in the database.
5. The coordinator clicks **"Confirm Check-In"** to toggle `attended: true` in real time.

---

## 4. Module 3: Live Q&A Forum & Upvoting Engine

### 4.1 Interactive Engagement Board
During live workshops or guest lectures, students can open `/portal/qna` to post questions without interrupting the speaker.
- **Deduplicated Upvoting:** Each upvote appends the student's `userId` to the question's `upvotes` array via MongoDB `$addToSet`. Clicking again triggers `$pull`, allowing students to toggle upvotes without duplicate voting.
- **Sorting Logic:** Questions are dynamically sorted by `upvoteCount` in descending order, ensuring the most pressing student questions rise to the top.
- **Organizer Pinning & Answers:** Event coordinators have exclusive buttons to **Pin Question** (`isPinned: true`) and submit **Official Answers**, which render with an institutional badge.

---

## 5. Module 4: Dynamic Feedback & Survey Engine

### 5.1 Google-Forms-Style Builder
Campus coordinators can create post-event surveys with three question types:
1. **Rating Scale:** 1 to 5 star ratings.
2. **Multiple Choice:** Custom radio options with single-select answers.
3. **Open-Ended Long Text:** Qualitative feedback and suggestions.

### 5.2 Automated Sentiment & NPS Computation
Submissions are aggregated into:
- **Average Star Rating** across all questions.
- **Net Promoter Score (NPS):** Promoters (scores 4-5) vs Detractors (scores 1-2).
- **Attendance-to-Feedback Conversion Rate:** Percentage of attendees who completed the survey.

---

## 6. Module 5: Media Vault & Video Processing

CampusPulse supports high-resolution photo galleries and video clip showcases:
- **Video Helper & Compression (`src/lib/video-helper.ts` & `video-compressor.ts`):** Validates MP4/WebM MIME types and parses YouTube/Vimeo embed codes.
- **Serverless Fallback:** In containerized or local environments, uploads are saved to `public/uploads`. In read-only serverless hosts, files are automatically converted to Base64 Data URIs so file uploads never fail.
- **Fullscreen Lightbox:** Includes keyboard navigation (Arrow keys, Escape), high-res zoom, and direct download buttons.

---

## 7. Module 6: Executive Institutional Reports & PDF Engine

University administrations require documented paper trails for event budgets and accreditation:
- **Automated Data Aggregation:** Pulls event attendance counts, Chief Guest details, educational objectives, learning outcomes, and student feedback scores.
- **Official Letterhead Styling:** Renders an institutional document with university crest, coordinator signatures, and structured tables.
- **1-Click PDF Generation:** Powered by `@react-pdf/renderer`, coordinators can export clean, vector-crisp PDF reports ready for print and administrative archiving.
