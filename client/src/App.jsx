console.log("VITE_API_BASE =", import.meta.env.VITE_API_BASE);
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  // --- Load feeds from localStorage ---
  const [feeds, setFeeds] = useState(() => {
    const saved = localStorage.getItem("feeds");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Save feeds to localStorage when changed ---
  useEffect(() => {
    localStorage.setItem("feeds", JSON.stringify(feeds));
  }, [feeds]);

  const [newFeed, setNewFeed] = useState("");
  const [newCategory, setNewCategory] = useState("News");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  async function addFeed() {
    if (!newFeed.trim()) return;
    const feed = { url: newFeed, category: newCategory };
    setFeeds([...feeds, feed]);
    setNewFeed("");
  }

  function deleteFeed(index) {
    setFeeds(feeds.filter((_, i) => i !== index));
  }

  // --- Fetch all articles from backend for user's feeds ---
  async function refreshFeeds() {
    if (feeds.length === 0) {
      setArticles([]);
      return;
    }
    setLoading(true);
    try {
      const feedUrls = feeds.map((f) => f.url);
      const res = await fetch(`${API_BASE}/api/fetch-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeds: feedUrls }),
      });
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Error fetching feeds:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshFeeds();
  }, [feeds]);

  return (
    <div style={{ padding: "1rem", background: "#111827", color: "white", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>My News Reader</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button style={{ marginRight: "0.5rem", background: "purple", color: "white", padding: "0.3rem 0.7rem" }}>
          Export OPML
        </button>
        <button style={{ marginRight: "0.5rem", background: "purple", color: "white", padding: "0.3rem 0.7rem" }}>
          Import OPML
        </button>
        <button
          onClick={refreshFeeds}
          style={{ background: "green", color: "white", padding: "0.3rem 0.7rem" }}
        >
          {loading ? "Loading..." : "Refresh Now"}
        </button>
      </div>

      <input
        placeholder="Paste RSS / YouTube / Twitter / Reddit link..."
        value={newFeed}
        onChange={(e) => setNewFeed(e.target.value)}
        style={{ width: "60%", padding: "0.3rem", marginRight: "0.5rem" }}
      />

      <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
        <option value="News">News</option>
        <option value="Science">Science</option>
      </select>

      <button onClick={addFeed} style={{ marginLeft: "0.5rem", padding: "0.3rem 0.7rem" }}>
        Add
      </button>

      <div style={{ marginTop: "1rem" }}>
        {feeds.map((feed, i) => (
          <div key={i} style={{ marginBottom: "0.3rem" }}>
            <b>{feed.url}</b> — Category: {feed.category}{" "}
            <button onClick={() => deleteFeed(i)} style={{ color: "red", marginLeft: "0.5rem" }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <h2>Articles</h2>
      {articles.length === 0 && <p>No articles yet. Add feeds and click "Refresh Now".</p>}
      {articles.map((a, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <a href={a.link} target="_blank" style={{ color: "#60a5fa", textDecoration: "none" }}>
            <h3>{a.title}</h3>
          </a>
          <p style={{ color: "#ccc" }}>{a.source}</p>
        </div>
      ))}
    </div>
  );
}

