"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { href: "/business", label: "Business" },
  { href: "/marketing", label: "Marketing" },
  { href: "/technology", label: "Technology" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/tips-and-guides", label: "Tips & Guides" },
];

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-3">Search</h3>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 text-white px-3 rounded-r-lg hover:bg-indigo-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-3">Categories</h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="text-gray-700 hover:text-indigo-600 transition font-medium text-sm">{c.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
