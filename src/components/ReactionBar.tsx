"use client";
import { useState, useEffect } from "react";

const reactions = [
  { emoji: "😍", label: "Love it" },
  { emoji: "👍", label: "Helpful" },
  { emoji: "🤔", label: "Interesting" },
  { emoji: "😐", label: "Meh" },
  { emoji: "👎", label: "Not helpful" },
];

export default function ReactionBar({ postId }: { postId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reactions?postId=${encodeURIComponent(postId)}`)
      .then((r) => r.json())
      .then(setCounts);
    const stored = localStorage.getItem(`reaction-${postId}`);
    if (stored) setVoted(stored);
  }, [postId]);

  const vote = async (emoji: string) => {
    if (voted) return;
    setVoted(emoji);
    localStorage.setItem(`reaction-${postId}`, emoji);
    setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, emoji }),
    });
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <p className="text-gray-600 font-semibold mb-4">How did you find this article?</p>
      <div className="flex flex-wrap gap-3">
        {reactions.map((r) => (
          <button
            key={r.emoji}
            onClick={() => vote(r.emoji)}
            disabled={!!voted}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition ${
              voted === r.emoji
                ? "border-indigo-500 bg-indigo-50 scale-110"
                : voted
                ? "opacity-60 cursor-not-allowed"
                : "hover:scale-110 hover:border-indigo-300 hover:bg-indigo-50"
            }`}
          >
            <span className="text-3xl">{r.emoji}</span>
            <span className="text-xs text-gray-500">{counts[r.emoji] || 0}</span>
          </button>
        ))}
      </div>
      {voted && <p className="text-sm text-gray-400 mt-3">Thanks for your feedback!</p>}
    </div>
  );
}
