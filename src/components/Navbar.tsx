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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">Beegeeservice</Link>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <ul className="hidden md:flex gap-6">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="hover:text-indigo-600 transition font-medium">{l.label}</Link></li>
          ))}
        </ul>
      </nav>
      {open && (
        <ul className="md:hidden px-4 pb-4 space-y-2 bg-white border-t">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} className="block py-2 hover:text-indigo-600 font-medium">{l.label}</Link></li>
          ))}
        </ul>
      )}
    </header>
  );
}
