import Link from "next/link";
import { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.category}/${post.slug}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="200" fill="#4338ca" />
              <circle cx="320" cy="40" r="80" fill="#6366f1" />
              <circle cx="60" cy="170" r="60" fill="#7c3aed" />
              <path d="M0 140 Q200 60 400 120 L400 200 L0 200Z" fill="#818cf8" opacity="0.5" />
            </svg>
            <span className="relative text-white/90 text-4xl font-bold capitalize">{post.category.replace("-", " ").charAt(0)}</span>
          </>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{post.category.replace(/-/g, " ")}</span>
        <h3 className="mt-1 text-lg font-bold group-hover:text-indigo-600 transition line-clamp-2">{post.title}</h3>
        <p className="mt-2 text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
        <p className="mt-3 text-xs text-gray-400">{post.date}</p>
      </div>
    </Link>
  );
}
