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

const defaultBanners = {
  Technical: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  Cultural: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  Sports: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  Workshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
};

const defaultVideos = {
  Technical: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  Workshop: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  Cultural: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  Sports: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("campuspulse");

  const events = await db.collection("events").find({}).toArray();

  for (const event of events) {
    const isInvalidBanner =
      !event.bannerUrl ||
      event.bannerUrl.startsWith("file://") ||
      event.bannerUrl.includes("C:/");

    const newBanner = isInvalidBanner
      ? defaultBanners[event.category] || defaultBanners.Technical
      : event.bannerUrl;

    const currentGallery = event.mediaGallery || { photos: [], rawClips: [] };
    const highlightVideo =
      currentGallery.generatedHighlightVideoUrl ||
      defaultVideos[event.category] ||
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const photos =
      currentGallery.photos && currentGallery.photos.length > 0
        ? currentGallery.photos.filter((p) => !p.startsWith("file://"))
        : [
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
          ];

    await db.collection("events").updateOne(
      { _id: event._id },
      {
        $set: {
          bannerUrl: newBanner,
          "mediaGallery.generatedHighlightVideoUrl": highlightVideo,
          "mediaGallery.photos": photos,
        },
      }
    );

    console.log(`✅ Updated event: "${event.title}" -> Banner: ${newBanner}`);
  }

  await client.close();
  console.log("All events successfully updated with high-res banners and media!");
}

run();
