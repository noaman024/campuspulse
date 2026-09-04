// CampusPulse - MongoDB Atlas Seed Script
// Populates official university events, departments, and credentials
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    if (line.startsWith("MONGODB_URI=")) {
      MONGODB_URI = line.replace("MONGODB_URI=", "").trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set. Please define it in your .env.local file or environment.");
  process.exit(1);
}

async function run() {
  console.log("Connecting to CampusPulse Database...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully.\n");

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      passwordHash: String,
      password: String,
      department: String,
      role: { type: String, enum: ["student", "admin"], default: "student" },
      createdAt: { type: Date, default: Date.now },
    });
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    const eventSchema = new mongoose.Schema({
      title: String,
      slug: { type: String, unique: true },
      description: String,
      category: { type: String, enum: ["Technical", "Cultural", "Sports", "Workshop"] },
      tags: [String],
      eventDate: Date,
      venue: String,
      maxCapacity: Number,
      status: { type: String, enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"], default: "upcoming" },
      organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      registeredUsers: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, qrCodeToken: String, attended: Boolean }],
      mediaGallery: { photos: [String], rawClips: [String] },
      reportData: { chiefGuest: String, objectives: String, outcomes: String, facultyCoordinator: String },
      createdAt: { type: Date, default: Date.now },
    });
    const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

    console.log("Syncing administrative and student accounts...");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@campuspulse.com" },
      {
        name: "Dr. A. K. Sharma",
        email: "admin@campuspulse.com",
        passwordHash: adminPassword,
        password: adminPassword,
        department: "Dean of Student Affairs",
        role: "admin",
      },
      { upsert: true, returnDocument: 'after' }
    );

    const student1 = await User.findOneAndUpdate(
      { email: "noaman@student.com" },
      {
        name: "Noaman Khan",
        email: "noaman@student.com",
        passwordHash: studentPassword,
        password: studentPassword,
        department: "Computer Science & Engineering",
        role: "student",
      },
      { upsert: true, returnDocument: 'after' }
    );

    const student2 = await User.findOneAndUpdate(
      { email: "sabir@student.com" },
      {
        name: "Sabir Ahmed",
        email: "sabir@student.com",
        passwordHash: studentPassword,
        password: studentPassword,
        department: "Information Technology",
        role: "student",
      },
      { upsert: true, returnDocument: 'after' }
    );

    console.log("User accounts verified.\n");

    // Realistic University Events
    const campusEvents = [
      {
        title: "HackPulse 2026: 24-Hour National Hackathon",
        slug: "hackpulse-2026",
        description: "Join over 40 teams across India in our flagship 24-hour hackathon. Build scalable solutions across Healthcare, Fintech, Smart Agriculture, and Clean Energy. Free high-speed WiFi, mentor support from industry software engineers, complimentary meals, and ₹50,000 cash prizes for winning teams.",
        category: "Technical",
        tags: ["Hackathon", "Full Stack", "Web Development", "AI/ML", "Prize Pool"],
        eventDate: new Date("2026-09-18T09:00:00"),
        venue: "Advanced Computing Labs (Block 4, 3rd Floor)",
        maxCapacity: 150,
        status: "upcoming",
        organizerId: admin._id,
        reportData: {
          chiefGuest: "Mr. Rajiv Nambiar (VP of Engineering, CloudCore Systems)",
          facultyCoordinator: "Prof. S. K. Gupta (Dept of CSE)",
          objectives: "Foster collaborative rapid prototyping and industry-standard software architecture among undergraduate students.",
          outcomes: "Over 35 deployed project prototypes submitted to university repository with industry feedback.",
        },
      },
      {
        title: "Tarang 2026: Annual Inter-College Cultural Fest",
        slug: "tarang-2026",
        description: "The premier cultural festival of our university! Two action-packed days featuring Battle of the Bands, Classical & Western Dance Duels, Theatrical Dramatics, Street Plays, Photography Exhibitions, and the Grand Star Night Concert. Food trucks and student pop-up stalls open throughout the day.",
        category: "Cultural",
        tags: ["Cultural Fest", "Music", "Dance", "Drama", "Star Night"],
        eventDate: new Date("2026-10-04T10:00:00"),
        venue: "University Amphitheatre & Central Lawns",
        maxCapacity: 800,
        status: "upcoming",
        organizerId: admin._id,
        reportData: {
          chiefGuest: "Ms. Ananya Roy (Eminent Theater Director & Classical Artist)",
          facultyCoordinator: "Dr. Shalini Verma (Cultural Council Secretary)",
          objectives: "Celebrate cultural diversity, stage performance excellence, and student artistic talent across 20+ visiting universities.",
          outcomes: "Over 800 participants across 14 competitive events with widespread student engagement.",
        },
      },
      {
        title: "Hands-on Masterclass: Cloud Infrastructure & Docker Containers",
        slug: "cloud-docker-masterclass",
        description: "An intensive technical workshop covering containerization with Docker, microservices orchestration, and zero-downtime deployments on Linux servers. Students will build and ship a production container on their personal laptops with guided faculty assistance.",
        category: "Workshop",
        tags: ["DevOps", "Docker", "Cloud", "Linux", "Hands-on"],
        eventDate: new Date("2026-09-24T14:00:00"),
        venue: "Seminar Hall B (IT Department)",
        maxCapacity: 60,
        status: "upcoming",
        organizerId: admin._id,
        reportData: {
          chiefGuest: "Dr. Vikram Joshi (Principal Cloud Architect)",
          facultyCoordinator: "Prof. M. R. Iyer (Dept of IT)",
          objectives: "Equip pre-final and final year students with practical containerization and CI/CD DevOps workflows.",
          outcomes: "Hands-on certificate issued to all attendees who successfully containerized their microservice.",
        },
      },
      {
        title: "Inter-Department Cricket Championship & Sports Olympiad",
        slug: "inter-department-cricket-2026",
        description: "The annual inter-departmental athletic tournament. 8 departmental teams battle in T20 knockout matches on turf pitch. Running alongside table tennis, badminton singles, and 100m sprint events. Refreshments provided for participants and spectators.",
        category: "Sports",
        tags: ["Cricket", "Athletics", "Sports Meet", "Tournament"],
        eventDate: new Date("2026-09-28T07:30:00"),
        venue: "Main Sports Complex & Cricket Pavilion",
        maxCapacity: 300,
        status: "upcoming",
        organizerId: admin._id,
        reportData: {
          chiefGuest: "Col. R. S. Rathore (Director of Physical Education)",
          facultyCoordinator: "Coach Ramesh Patil (Sports Council)",
          objectives: "Encourage physical fitness, team spirit, and competitive sportsmanship among all academic branches.",
          outcomes: "Winners trophy and individual medals awarded during the final presentation ceremony.",
        },
      },
      {
        title: "Campus Placement Bootcamp: Technical Mock Interviews & Resume Clinic",
        slug: "placement-readiness-bootcamp",
        description: "Comprehensive career preparation workshop organized by the Training & Placement Cell. Features live 1-on-1 resume reviews, mock behavioral HR panels, and system design coding interviews conducted by corporate alumni.",
        category: "Workshop",
        tags: ["Placements", "Resume", "Interviews", "Career", "T&P"],
        eventDate: new Date("2026-10-10T10:30:00"),
        venue: "Auditorium 1 (Management Block)",
        maxCapacity: 120,
        status: "upcoming",
        organizerId: admin._id,
        reportData: {
          chiefGuest: "Mr. Deepanker Bose (Head of University Relations, TechHire)",
          facultyCoordinator: "Prof. Sunita Deshmukh (Placement Officer)",
          objectives: "Enhance student confidence, resume ATS scores, and interview performance for the upcoming campus placement season.",
          outcomes: "Over 120 students received personalized feedback on resume projects and mock HR assessments.",
        },
      },
      {
        title: "RoboWars 2026: Autonomous Drone & Line Follower Challenge",
        slug: "robowars-2026",
        description: "The Robotics Club presents the flagship robotics arena tournament. Witness wired and wireless combat bots in the arena pit, alongside obstacle-course drone racing and precision line follower robot challenges.",
        category: "Technical",
        tags: ["Robotics", "Hardware", "Drones", "IoT", "Competition"],
        eventDate: new Date("2026-10-18T11:00:00"),
        venue: "Mechanical Engineering Workshop Arena",
        maxCapacity: 200,
        status: "upcoming",
        organizerId: admin._id,
        reportData: {
          chiefGuest: "Dr. P. N. Murthy (Director, Robotics Research Institute)",
          facultyCoordinator: "Prof. Rajesh Kulkarni (Dept of Mechanical Engg)",
          objectives: "Promote embedded electronics, micro-controller programming, and mechanical fabrication skills.",
          outcomes: "Live combat arena matches completed with awards for Best Design and Arena Champion.",
        },
      },
    ];

    console.log("Updating campus events in database...");
    for (const evt of campusEvents) {
      await Event.findOneAndUpdate(
        { slug: evt.slug },
        { ...evt, registeredUsers: [
          { userId: student1._id, qrCodeToken: `TKT-${evt.slug.toUpperCase()}-001`, attended: false },
          { userId: student2._id, qrCodeToken: `TKT-${evt.slug.toUpperCase()}-002`, attended: false }
        ] },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`- Updated: ${evt.title} [${evt.category}]`);
    }

    console.log("\n==================================================");
    console.log("UNIVERSITY DATABASE SYNCED SUCCESSFULLY!");
    console.log("==================================================");
    console.log("\nPortal Credentials:");
    console.log("   Admin:   admin@campuspulse.com / admin123 (Dr. A. K. Sharma)");
    console.log("   Student: noaman@student.com / student123 (Noaman Khan)");
    console.log("   Student: sabir@student.com / student123 (Sabir Ahmed)");
    console.log("==================================================\n");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Database sync error:", error.message);
    process.exit(1);
  }
}

run();
