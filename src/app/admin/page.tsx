"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type Post = { slug: string; title: string; date: string; category: string; excerpt: string; image?: string; keywords?: string; body?: string };

const categories = [
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "tips-and-guides", label: "Tips & Guides" },
];

const toolbarButtons = [
  { label: "H1", prefix: "# ", suffix: "" },
  { label: "H2", prefix: "## ", suffix: "" },
  { label: "H3", prefix: "### ", suffix: "" },
  { label: "B", prefix: "**", suffix: "**" },
  { label: "I", prefix: "_", suffix: "_" },
  { label: "Quote", prefix: "> ", suffix: "" },
  { label: "UL", prefix: "- ", suffix: "" },
  { label: "OL", prefix: "1. ", suffix: "" },
  { label: "Code", prefix: "`", suffix: "`" },
  { label: "Link", prefix: "[", suffix: "](url)" },
];

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ title: "", category: "business", excerpt: "", image: "", keywords: "", body: "" });
  const [editing, setEditing] = useState<{ category: string; slug: string } | null>(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const startEdit = async (p: Post) => {
    const res = await fetch(`/api/posts?category=${p.category}&slug=${p.slug}`);
    const full = await res.json();
    setForm({ title: full.title, category: full.category, excerpt: full.excerpt, image: full.image || "", keywords: full.keywords || "", body: full.body || "" });
    setEditing({ category: full.category, slug: full.slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ title: "", category: "business", excerpt: "", image: "", keywords: "", body: "" });
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
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
  }, [token]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const insertMarkdown = (prefix: string, suffix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.body.slice(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const newBody = form.body.slice(0, start) + replacement + form.body.slice(end);
    setForm((prev) => ({ ...prev, body: newBody }));
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + prefix.length;
      ta.selectionEnd = start + prefix.length + (selected || "text").length;
    }, 0);
  };

  const htmlToMarkdown = (html: string): string => {
    let md = html;
    md = md.replace(/<b>|<strong>/gi, "**").replace(/<\/b>|<\/strong>/gi, "**");
    md = md.replace(/<i>|<em>/gi, "_").replace(/<\/i>|<\/em>/gi, "_");
    md = md.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n");
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n");
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n");
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
    md = md.replace(/<br\s*\/?>/gi, "\n");
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
    md = md.replace(/<\/?(ul|ol|div|span)[^>]*>/gi, "");
    md = md.replace(/<[^>]+>/g, "");
    md = md.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    md = md.replace(/\n{3,}/g, "\n\n");
    return md.trim();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const htmlData = e.clipboardData.getData("text/html");
    if (!htmlData) return;
    e.preventDefault();
    const md = htmlToMarkdown(htmlData);
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newBody = form.body.slice(0, start) + md + form.body.slice(end);
    setForm((prev) => ({ ...prev, body: newBody }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch("/api/posts", { method: "PUT", headers: authHeaders(), body: JSON.stringify({ ...form, slug: editing.slug }) });
      setMsg("Post updated!");
      setEditing(null);
    } else {
      await fetch("/api/posts", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      setMsg("Post published!");
    }
    setForm({ title: "", category: "business", excerpt: "", image: "", keywords: "", body: "" });
    load();
    setTimeout(() => setMsg(""), 3000);
  };

  const remove = async (category: string, slug: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/posts", { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ category, slug }) });
    load();
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">Content Management</h1>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
      </div>

      {msg && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-6">{msg}</div>}

      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4 mb-12">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{editing ? "Edit Post" : "Create New Post"}</h2>
          {editing && <button type="button" onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>}
        </div>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-4 py-2">
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input required placeholder="Short excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        <input placeholder="SEO Keywords (comma separated)" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full border rounded-lg px-4 py-2" />

        {/* Image upload - drag & drop */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Article Image</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}`}
          >
            {uploading ? (
              <p className="text-indigo-600 font-medium">Uploading...</p>
            ) : form.image ? (
              <div className="flex flex-col items-center gap-3">
                <img src={form.image} alt="Preview" className="max-h-40 rounded-lg object-cover" />
                <p className="text-xs text-gray-500">Click or drag to replace</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10V8a5 5 0 0110 0v2" /></svg>
                <p className="text-sm text-gray-500">Drag & drop an image here, or <span className="text-indigo-600 font-medium">browse</span></p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {form.image && (
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: "" }))} className="text-xs text-red-500 hover:text-red-700">Remove image</button>
          )}
        </div>

        {/* Markdown editor with toolbar */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Article Body (Markdown)</label>
          <div className="border rounded-lg overflow-hidden">
            <div className="flex flex-wrap gap-1 bg-gray-100 px-3 py-2 border-b">
              {toolbarButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => insertMarkdown(btn.prefix, btn.suffix)}
                  className="px-2 py-1 text-xs font-semibold bg-white border rounded hover:bg-indigo-50 hover:border-indigo-300 transition"
                  title={btn.label}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              required
              placeholder="Write your article content here..."
              rows={12}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              onPaste={handlePaste}
              className="w-full px-4 py-3 resize-y focus:outline-none"
            />
          </div>
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">{editing ? "Update" : "Publish"}</button>
      </form>

      <h2 className="text-xl font-bold mb-4">All Posts ({posts.length})</h2>
      <div className="space-y-3">
        {posts.slice((page - 1) * perPage, page * perPage).map((p) => (
          <div key={`${p.category}/${p.slug}`} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-500">{p.category} &middot; {p.date}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(p)} className="text-indigo-500 hover:text-indigo-700 text-sm font-medium">Edit</button>
              <button onClick={() => remove(p.category, p.slug)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {Math.ceil(posts.length / perPage) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40">Prev</button>
          {Array.from({ length: Math.ceil(posts.length / perPage) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(Math.ceil(posts.length / perPage), p + 1))} disabled={page === Math.ceil(posts.length / perPage)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
