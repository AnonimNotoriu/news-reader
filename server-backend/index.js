import express from "express";
import fetch from "node-fetch";
import Parser from "rss-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 10000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Helper: proxy fetch with user-agent headers
async function fetchFeed(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`Status code ${res.status}`);
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    return feed;
  } catch (err) {
    console.error(`Error fetching feed: ${url}`, err.message);
    return null;
  }
}

app.get("/api/feed", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  const feed = await fetchFeed(url);
  if (!feed) return res.status(500).json({ error: "Failed to fetch feed" });

  res.json(feed);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
