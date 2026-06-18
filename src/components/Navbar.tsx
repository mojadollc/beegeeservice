"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/business", label: "Business" },
  { href: "/marketing", label: "Marketing" },
  { href: "/technology", label: "Technology" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/tips-and-guides", label: "Tips & Guides" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-slate-800 tracking-tight">
          Bee<span className="text-teal-600">goo</span>
        </Link>
        <button className="md:hidden p-2 text-slate-600" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <ul className="hidden md:flex gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="px-3 py-2 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition text-sm font-medium">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {open && (
        <ul className="md:hidden px-4 pb-4 space-y-1 bg-white border-t border-gray-100">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 px-3 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-teal-50 font-medium">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
