import React, { useEffect, useRef } from "react";

export default function ArticleCard({ article, onSelect }) {
  const isYouTube =
    article.link?.includes("youtube.com/watch") ||
    article.link?.includes("youtu.be");
  const isTwitter =
    article.link?.includes("twitter.com") || article.link?.includes("x.com");
  const isReddit = article.link?.includes("reddit.com");

  const videoId = isYouTube
    ? article.link.split("v=")[1]?.split("&")[0] ||
      article.link.split("/").pop()
    : null;
  const tweetId = isTwitter
    ? article.link.match(/status\/(\d+)/)?.[1]
    : null;

  const twitterRef = useRef(null);
  const redditRef = useRef(null);

  useEffect(() => {
    if (isTwitter && tweetId && twitterRef.current) {
      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window.twttr.widgets.load(twitterRef.current);
      }
    }
  }, [isTwitter, tweetId]);

  useEffect(() => {
    if (isReddit && redditRef.current) {
      if (!document.getElementById("reddit-embed")) {
        const script = document.createElement("script");
        script.src = "https://embed.redditmedia.com/widgets/platform.js";
        script.async = true;
        script.id = "reddit-embed";
        document.body.appendChild(script);
      } else {
        window.__redditEmbed && window.__redditEmbed();
      }
    }
  }, [isReddit]);

  return (
    <div
      onClick={() => onSelect(article)}
      className="block rounded-2xl bg-gray-800 hover:bg-gray-700 transition p-4 shadow cursor-pointer"
    >
      {/* --- YouTube --- */}
      {isYouTube && videoId ? (
        <div className="mb-3 rounded-xl overflow-hidden aspect-video relative group">
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube video thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ▶ Preview
            </span>
          </div>
        </div>
      ) : null}

      {/* --- Twitter / X --- */}
      {isTwitter && tweetId ? (
        <div ref={twitterRef} className="mb-3">
          <blockquote className="twitter-tweet" data-theme="dark">
            <a href={`https://x.com/i/status/${tweetId}`}></a>
          </blockquote>
        </div>
      ) : null}

      {/* --- Reddit --- */}
      {isReddit ? (
        <div ref={redditRef} className="mb-3 reddit-embed bg-gray-900 rounded-xl p-3">
          <blockquote className="reddit-card" data-card-created="true" data-theme="dark">
            <a href={article.link}>{article.title}</a>
          </blockquote>
        </div>
      ) : null}

      {/* --- Default image fallback --- */}
      {!isYouTube && !isTwitter && !isReddit && article.image && (
        <img
          src={article.image}
          alt=""
          className="w-full h-48 object-cover rounded-xl mb-3"
          loading="lazy"
        />
      )}

      {/* --- Text info --- */}
      <h2 className="text-lg font-semibold mb-1 text-blue-400 hover:underline">
        {article.title}
      </h2>
      <p className="text-sm text-gray-400 mb-2">{article.feedTitle}</p>
      <p className="text-sm text-gray-300 line-clamp-3">{article.summary}</p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(article.publishedAt).toLocaleString()}
      </p>
    </div>
  );
}
