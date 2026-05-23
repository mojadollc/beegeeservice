"use client";
import { useState, useEffect } from "react";

type Post = { slug: string; title: string; date: string; category: string; excerpt: string };

const categories = [
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "tips-and-guides", label: "Tips & Guides" },
];

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ title: "", category: "business", excerpt: "", image: "", body: "" });
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (token) load();
  }, [token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("admin-token", data.token);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("admin-token");
  };

  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` });

  const load = () => fetch("/api/posts").then((r) => r.json()).then(setPosts);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (data.url) setForm((prev) => ({ ...prev, image: data.url }));
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/posts", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
    setForm({ title: "", category: "business", excerpt: "", image: "", body: "" });
    setMsg("Post published!");
    load();
    setTimeout(() => setMsg(""), 3000);
  };

  const remove = async (category: string, slug: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/posts", { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ category, slug }) });
    load();
  };

  // Login screen
  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-extrabold text-center">Admin Login</h1>
          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
          <input required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Login</button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">Content Management</h1>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
      </div>

      {msg && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-6">{msg}</div>}

      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4 mb-12">
        <h2 className="text-xl font-bold">Create New Post</h2>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-4 py-2">
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input required placeholder="Short excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border rounded-lg px-4 py-2" />

        {/* Image upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Article Image</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="w-full text-sm" />
          {uploading && <p className="text-sm text-indigo-600">Uploading...</p>}
          {form.image && (
            <div className="flex items-center gap-3">
              <img src={form.image} alt="Preview" className="h-20 rounded-lg object-cover" />
              <span className="text-xs text-gray-500 break-all">{form.image}</span>
            </div>
          )}
        </div>

        <textarea required placeholder="Article body (Markdown supported)" rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Publish</button>
      </form>

      <h2 className="text-xl font-bold mb-4">All Posts ({posts.length})</h2>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={`${p.category}/${p.slug}`} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-500">{p.category} &middot; {p.date}</p>
            </div>
            <button onClick={() => remove(p.category, p.slug)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
