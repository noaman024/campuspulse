const { MongoClient } = require("mongodb");

const uri =
  "mongodb://mdnoaman024_db_user:N030907@ac-bar3zxx-shard-00-00.kei9pjd.mongodb.net:27017,ac-bar3zxx-shard-00-01.kei9pjd.mongodb.net:27017,ac-bar3zxx-shard-00-02.kei9pjd.mongodb.net:27017/campuspulse?ssl=true&replicaSet=atlas-48mkzo-shard-0&authSource=admin&retryWrites=true&w=majority";

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
