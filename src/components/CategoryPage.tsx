import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function CategoryPage({ category, label }: { category: string; label: string }) {
  const posts = await getPostsByCategory(category);
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2">{label}</h1>
      <p className="text-gray-500 mb-8">Browse all {label.toLowerCase()} articles</p>
      {posts.length === 0 ? (
        <p className="text-gray-500">No articles in this category yet. <Link href="/admin" className="text-indigo-600 underline">Create one</Link></p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      )}
    </section>
  );
}
