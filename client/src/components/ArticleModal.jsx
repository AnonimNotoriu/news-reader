import React from "react";

export default function ArticleModal({ article, onClose, onToggleRead, onToggleBookmark }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{article.title}</h2>
        <p className="text-sm text-gray-400 mb-4">
          {article.feedTitle} • {new Date(article.publishedAt).toLocaleString()}
        </p>

        {article.image && (
          <img
            src={article.image}
            alt=""
            className="w-full rounded-xl mb-4"
          />
        )}

        <p className="text-gray-200 whitespace-pre-line leading-relaxed">
          {article.summary || "No summary available."}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onToggleRead}
            className={`px-4 py-2 rounded font-semibold ${
              article.isRead ? "bg-gray-700 text-gray-300" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {article.isRead ? "Mark as Unread" : "Mark as Read"}
          </button>

          <button
            onClick={onToggleBookmark}
            className={`px-4 py-2 rounded font-semibold ${
              article.isBookmarked ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {article.isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            Open Original
          </a>
        </div>
      </div>
    </div>
  );
}
