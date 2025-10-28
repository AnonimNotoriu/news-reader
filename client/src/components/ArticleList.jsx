import { useState } from "react";
import ArticleCard from "./ArticleCard";
import { List, LayoutGrid } from "lucide-react";

export default function ArticleList({ articles, onSelectArticle }) {
  const [layout, setLayout] = useState("list");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Articles</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout("list")}
            className={`p-2 rounded ${layout === "list" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded ${layout === "grid" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      <div
        className={
          layout === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {articles.map((a) => (
          <ArticleCard key={a.id || a.link} article={a} onSelect={onSelectArticle} />
        ))}
      </div>
    </div>
  );
}
