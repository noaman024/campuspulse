// MongoDB Atlas Connection Test & Seed Script
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  "mongodb://mdnoaman024_db_user:N030907@ac-bar3zxx-shard-00-00.kei9pjd.mongodb.net:27017,ac-bar3zxx-shard-00-01.kei9pjd.mongodb.net:27017,ac-bar3zxx-shard-00-02.kei9pjd.mongodb.net:27017/campuspulse?ssl=true&replicaSet=atlas-48mkzo-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  console.log("🔌 Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully!\n");

    const db = mongoose.connection.db;

    // Show existing collections
    const collections = await db.listCollections().toArray();
    console.log("📦 Existing collections:", collections.map((c) => c.name));

    // --- Create User Schema ---
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

    // --- Create Event Schema ---
    const eventSchema = new mongoose.Schema({
      title: String,
      slug: String,
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

    console.log("\n🌱 Syncing users & database...\n");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@campuspulse.com" },
      {
        name: "Admin User",
        email: "admin@campuspulse.com",
        passwordHash: adminPassword,
        password: adminPassword,
        department: "Administration",
        role: "admin",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Admin user synced: admin@campuspulse.com / admin123");

    const student1 = await User.findOneAndUpdate(
      { email: "noaman@student.com" },
      {
        name: "Noaman Khan",
        email: "noaman@student.com",
        passwordHash: studentPassword,
        password: studentPassword,
        department: "Computer Science",
        role: "student",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Student user synced: noaman@student.com / student123");

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
      { upsert: true, new: true }
    );
    console.log("✅ Student user synced: sabir@student.com / student123");

    // Check if events already exist
    const existingEventsCount = await Event.countDocuments();
    if (existingEventsCount > 0) {
      console.log(`\n📅 Database already has ${existingEventsCount} events.`);
      console.log("\n==================================================");
      console.log("🎉 DATABASE USERS & CREDENTIALS SYNCED SUCCESSFULLY!");
      console.log("==================================================");
      console.log("\n📋 Login Credentials:");
      console.log("   Admin:   admin@campuspulse.com / admin123");
      console.log("   Student: noaman@student.com / student123");
      console.log("   Student: sabir@student.com / student123");
      await mongoose.disconnect();
      return;
    }

    // Create Events
    const events = [
      {
        title: "AI & Machine Learning Workshop",
        slug: "ai-ml-workshop",
        description: "Dive into the world of Artificial Intelligence and Machine Learning. This hands-on workshop covers neural networks, deep learning fundamentals, and practical implementations using Python and TensorFlow. Perfect for beginners and intermediate developers looking to expand their AI skills.",
        category: "Technical",
        tags: ["AI", "Machine Learning", "Python", "Workshop"],
        eventDate: new Date("2026-09-15T10:00:00"),
        venue: "CS Lab 101, Main Building",
        maxCapacity: 60,
        status: "upcoming",
        organizerId: admin._id,
      },
      {
        title: "Annual Cultural Fest - Rangeela 2026",
        slug: "rangeela-2026",
        description: "The biggest cultural extravaganza of the year is here! Join us for two days of music, dance, drama, art exhibitions, and food stalls. Featuring performances from top college bands and professional artists. Don't miss the grand finale night!",
        category: "Cultural",
        tags: ["Music", "Dance", "Cultural Fest", "Entertainment"],
        eventDate: new Date("2026-10-05T09:00:00"),
        venue: "Open Air Theatre & Main Auditorium",
        maxCapacity: 500,
        status: "upcoming",
        organizerId: admin._id,
      },
      {
        title: "Inter-College Cricket Tournament",
        slug: "cricket-tournament-2026",
        description: "Gear up for the annual inter-college cricket tournament! Teams from 16 colleges will compete in a knockout format. Registration open for players and spectators alike. Exciting prizes and trophies for winners and runners-up.",
        category: "Sports",
        tags: ["Cricket", "Tournament", "Inter-College", "Sports"],
        eventDate: new Date("2026-09-20T07:00:00"),
        venue: "College Cricket Ground",
        maxCapacity: 200,
        status: "upcoming",
        organizerId: admin._id,
      },
      {
        title: "Web Development Bootcamp",
        slug: "web-dev-bootcamp",
        description: "A comprehensive 3-day bootcamp covering modern web development with React, Next.js, and Node.js. Build a full-stack project from scratch. Includes hands-on sessions, code reviews, and mentorship from industry professionals.",
        category: "Workshop",
        tags: ["Web Dev", "React", "Next.js", "Full Stack"],
        eventDate: new Date("2026-09-08T09:30:00"),
        venue: "Seminar Hall B, IT Department",
        maxCapacity: 40,
        status: "upcoming",
        organizerId: admin._id,
      },
      {
        title: "Hackathon - Code for Change",
        slug: "hackathon-code-for-change",
        description: "24-hour hackathon focused on building solutions for social good. Teams of 3-4 will compete to create innovative apps addressing real-world problems in education, healthcare, and environment. Amazing prizes worth ₹1 Lakh!",
        category: "Technical",
        tags: ["Hackathon", "Coding", "Innovation", "Social Good"],
        eventDate: new Date("2026-10-12T08:00:00"),
        venue: "Innovation Centre, Block C",
        maxCapacity: 120,
        status: "upcoming",
        organizerId: admin._id,
      },
      {
        title: "Photography Workshop & Contest",
        slug: "photography-workshop",
        description: "Learn photography techniques from professional photographers. Topics include composition, lighting, mobile photography, and post-processing. The workshop concludes with a photo contest with exciting prizes!",
        category: "Cultural",
        tags: ["Photography", "Art", "Contest", "Creative"],
        eventDate: new Date("2026-09-25T14:00:00"),
        venue: "Arts Gallery, Fine Arts Building",
        maxCapacity: 50,
        status: "upcoming",
        organizerId: admin._id,
      },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`\n✅ ${createdEvents.length} events created:`);
    createdEvents.forEach((e) => console.log(`   📅 ${e.title} [${e.category}]`));

    // Register some students to events
    await Event.updateOne(
      { slug: "ai-ml-workshop" },
      { $push: { registeredUsers: { userId: student1._id, qrCodeToken: "QR-AI-" + Date.now(), attended: false } } }
    );
    await Event.updateOne(
      { slug: "ai-ml-workshop" },
      { $push: { registeredUsers: { userId: student2._id, qrCodeToken: "QR-AI2-" + Date.now(), attended: false } } }
    );
    await Event.updateOne(
      { slug: "web-dev-bootcamp" },
      { $push: { registeredUsers: { userId: student1._id, qrCodeToken: "QR-WEB-" + Date.now(), attended: false } } }
    );
    console.log("\n✅ Student registrations added to events");

    console.log("\n" + "=".repeat(50));
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📋 Login Credentials:");
    console.log("   Admin:   admin@campuspulse.com / admin123");
    console.log("   Student: noaman@student.com / student123");
    console.log("   Student: sabir@student.com / student123");
    console.log("\n🌐 Run: npm run dev → http://localhost:3000\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB Atlas.");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("ENOTFOUND") || error.message.includes("authentication")) {
      console.error("\n💡 Check:");
      console.error("   1. Atlas Network Access → Allow 0.0.0.0/0");
      console.error("   2. Database user password is correct");
      console.error("   3. Cluster is active on cloud.mongodb.com");
    }
    process.exit(1);
  }
}

run();
