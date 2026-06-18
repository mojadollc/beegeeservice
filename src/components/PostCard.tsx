import Link from "next/link";
import { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.category}/${post.slug}`} className="group block bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="200" fill="#f1f5f9" />
              <circle cx="320" cy="40" r="80" fill="#e2e8f0" />
              <circle cx="60" cy="170" r="60" fill="#cbd5e1" />
              <path d="M0 140 Q200 60 400 120 L400 200 L0 200Z" fill="#0d9488" opacity="0.15" />
            </svg>
            <span className="relative text-slate-400 text-3xl font-bold capitalize">{post.category.replace("-", " ").charAt(0)}</span>
          </>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-teal-600 uppercase tracking-wide">{post.category.replace(/-/g, " ")}</span>
        <h3 className="mt-2 text-base font-semibold text-slate-800 group-hover:text-teal-700 transition line-clamp-2 leading-snug">{post.title}</h3>
        <p className="mt-2 text-slate-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
        <p className="mt-3 text-xs text-slate-400">{post.date}</p>
      </div>
    </Link>
  );
}
