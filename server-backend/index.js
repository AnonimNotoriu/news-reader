import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Parser from "rss-parser";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const parser = new Parser();

// ✅ Enable CORS for both local dev and production
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://rss-reader-backend-syim.onrender.com"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// --- Simple test endpoint ---
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

// --- POST /api/fetch-multiple ---
// Expects { feeds: ["https://reddit.com/r/worldnews.rss", ...] }
app.post("/api/fetch-multiple", async (req, res) => {
  const { feeds } = req.body;

  if (!feeds || feeds.length === 0) {
    return res.json({ articles: [] });
  }

  try {
    const allArticles = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const articles = feed.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          author: item.author || item.creator || null,
          contentSnippet: item.contentSnippet,
          isoDate: item.isoDate,
        }));
        allArticles.push(...articles);
      } catch (err) {
        console.error("Error fetching feed:", feedUrl, err.message);
      }
    }

    res.json({ articles: allArticles });
  } catch (error) {
    console.error("Error fetching feeds:", error);
    res.status(500).json({ error: "Failed to fetch feeds" });
  }
});

// --- Start the server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
