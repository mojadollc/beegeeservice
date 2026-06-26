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
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  const showMsg = (text: string, type: "success" | "error") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 5000);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
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
    } catch {
      setLoginError("Network error. Please try again.");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("admin-token");
  };

  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` });

  const load = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      // silent fail on load
    }
  };

  const startEdit = async (p: Post) => {
    try {
      const res = await fetch(`/api/posts?category=${p.category}&slug=${p.slug}`);
      const full = await res.json();
      setForm({ title: full.title, category: full.category, excerpt: full.excerpt, image: full.image || "", keywords: full.keywords || "", body: full.body || "" });
      setEditing({ category: full.category, slug: full.slug });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      showMsg("Failed to load post for editing", "error");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ title: "", category: "business", excerpt: "", image: "", keywords: "", body: "" });
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showMsg("Please upload an image file", "error");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.status === 401) {
        showMsg("Session expired. Please login again.", "error");
        logout();
        return;
      }
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        showMsg("Upload failed", "error");
      }
    } catch {
      showMsg("Upload failed. Network error.", "error");
    }
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
    if (submitting) return;
    setSubmitting(true);

    try {
      const method = editing ? "PUT" : "POST";
      const payload = editing ? { ...form, slug: editing.slug } : form;
      const res = await fetch("/api/posts", {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        showMsg("Session expired. Please login again.", "error");
        logout();
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Failed to save post. Please try again.", "error");
        setSubmitting(false);
        return;
      }

      if (data.success) {
        showMsg(editing ? "Post updated successfully!" : "Post published successfully!", "success");
        setEditing(null);
        setForm({ title: "", category: "business", excerpt: "", image: "", keywords: "", body: "" });
        await load();
      } else {
        showMsg("Something went wrong. Post may not have been saved.", "error");
      }
    } catch {
      showMsg("Network error. Please check your connection and try again.", "error");
    }

    setSubmitting(false);
  };

  const remove = async (category: string, slug: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch("/api/posts", { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ category, slug }) });
      if (res.status === 401) {
        showMsg("Session expired. Please login again.", "error");
        logout();
        return;
      }
      if (res.ok) {
        showMsg("Post deleted", "success");
        load();
      }
    } catch {
      showMsg("Failed to delete post", "error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-extrabold text-center">Admin Login</h1>
          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
          <input required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Content Management</h1>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg mb-6 font-medium text-sm ${msg.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4 mb-12 border border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{editing ? "Edit Post" : "Create New Post"}</h2>
          {editing && <button type="button" onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input required placeholder="Enter article title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
            <input placeholder="keyword1, keyword2" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
          <input required placeholder="Brief description of the article" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragging ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-400 hover:bg-gray-50"}`}
          >
            {uploading ? (
              <p className="text-teal-600 font-medium">Uploading...</p>
            ) : form.image ? (
              <div className="flex flex-col items-center gap-3">
                <img src={form.image} alt="Preview" className="max-h-40 rounded-lg object-cover" />
                <p className="text-xs text-gray-500">Click or drag to replace</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10V8a5 5 0 0110 0v2" /></svg>
                <p className="text-sm text-gray-500">Drag & drop an image, or <span className="text-teal-600 font-medium">browse</span></p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {form.image && (
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: "" }))} className="text-xs text-red-500 hover:text-red-700 mt-1">Remove image</button>
          )}
        </div>

        {/* Markdown editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Body (Markdown) *</label>
          <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
            <div className="flex flex-wrap gap-1 bg-gray-50 px-3 py-2 border-b border-gray-200">
              {toolbarButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => insertMarkdown(btn.prefix, btn.suffix)}
                  className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 rounded hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition"
                  title={btn.label}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              required
              placeholder="Write your article content here... Supports Markdown formatting. You can also paste rich text (bold, links) and it will convert automatically."
              rows={14}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              onPaste={handlePaste}
              className="w-full px-4 py-3 resize-y focus:outline-none min-h-[200px]"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Supports Markdown. Paste from web to auto-convert bold & links.</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : editing ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-4 text-slate-800">All Posts ({posts.length})</h2>
      <div className="space-y-3">
        {posts.slice((page - 1) * perPage, page * perPage).map((p) => (
          <div key={`${p.category}/${p.slug}`} className="bg-white rounded-xl p-4 border border-gray-100 flex justify-between items-center hover:border-gray-200 transition">
            <div>
              <p className="font-semibold text-slate-800">{p.title}</p>
              <p className="text-sm text-gray-500">{p.category} &middot; {p.date}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(p)} className="text-teal-600 hover:text-teal-800 text-sm font-medium">Edit</button>
              <button onClick={() => remove(p.category, p.slug)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {Math.ceil(posts.length / perPage) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40">Prev</button>
          {Array.from({ length: Math.ceil(posts.length / perPage) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(Math.ceil(posts.length / perPage), p + 1))} disabled={page === Math.ceil(posts.length / perPage)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
