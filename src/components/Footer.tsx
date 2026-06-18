import Link from "next/link";

const categories = [
  { href: "/business", label: "Business" },
  { href: "/marketing", label: "Marketing" },
  { href: "/technology", label: "Technology" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/tips-and-guides", label: "Tips & Guides" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="text-xl font-bold text-white tracking-tight mb-2">Bee<span className="text-teal-400">goo</span></p>
            <p className="text-sm leading-relaxed">Expert insights on Business, Marketing, Technology, and Lifestyle to help you grow.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Categories</p>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.href}><Link href={c.href} className="text-sm hover:text-teal-400 transition">{c.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Quick Links</p>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-teal-400 transition">Home</Link></li>
              <li><Link href="/search" className="text-sm hover:text-teal-400 transition">Search</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Beegoo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
