const { MongoClient } = require("mongodb");
const fs = require("fs");

let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    if (line.startsWith("MONGODB_URI=")) {
      uri = line.replace("MONGODB_URI=", "").trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

if (!uri) {
  console.error("Error: MONGODB_URI is not set. Please define it in your .env.local file or environment.");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("campuspulse");

  const updateResult = await db.collection("feedbackforms").updateMany(
    {},
    {
      $set: {
        isPublished: true,
        acceptingResponses: true,
      },
    }
  );

  console.log("Updated existing forms count:", updateResult.modifiedCount);

  const forms = await db.collection("feedbackforms").find({}).toArray();
  console.log(
    "All forms in DB:",
    forms.map((f) => ({
      id: f._id,
      title: f.title,
      isPublished: f.isPublished,
      acceptingResponses: f.acceptingResponses,
    }))
  );

  // If no feedback forms exist, create 2 sample feedback forms for existing events so students can immediately test!
  if (forms.length === 0) {
    const events = await db.collection("events").find({}).limit(2).toArray();
    for (const ev of events) {
      await db.collection("feedbackforms").insertOne({
        eventId: ev._id,
        title: `${ev.title} — Participant Feedback`,
        instructions:
          "Please take 2 minutes to share your thoughts and help us improve future campus events.",
        isPublished: true,
        acceptingResponses: true,
        questions: [
          {
            questionId: "q1-" + Date.now(),
            prompt: "How would you rate the overall event experience?",
            type: "rating",
            options: [],
            isRequired: true,
            order: 0,
          },
          {
            questionId: "q2-" + Date.now(),
            prompt: "The session objectives were clearly met and valuable.",
            type: "likert",
            options: [],
            isRequired: true,
            order: 1,
          },
          {
            questionId: "q3-" + Date.now(),
            prompt: "What was the best part of this event and what can we improve?",
            type: "text",
            options: [],
            isRequired: false,
            order: 2,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Created sample feedback form for: ${ev.title}`);
    }
  }

  await client.close();
  console.log("Done!");
}

run();
