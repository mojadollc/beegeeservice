import Link from "next/link";
import { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.category}/${post.slug}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/80 text-4xl font-bold capitalize">{post.category.replace("-", " ").charAt(0)}</span>
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
