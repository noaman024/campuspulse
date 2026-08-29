const { MongoClient } = require("mongodb");

const uri =
  "mongodb://mdnoaman024_db_user:N030907@ac-bar3zxx-shard-00-00.kei9pjd.mongodb.net:27017,ac-bar3zxx-shard-00-01.kei9pjd.mongodb.net:27017,ac-bar3zxx-shard-00-02.kei9pjd.mongodb.net:27017/campuspulse?ssl=true&replicaSet=atlas-48mkzo-shard-0&authSource=admin&retryWrites=true&w=majority";

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
