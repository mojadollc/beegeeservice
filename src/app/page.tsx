import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

const categories = [
  { slug: "business", label: "Business", color: "from-blue-500 to-indigo-600" },
  { slug: "marketing", label: "Marketing", color: "from-pink-500 to-rose-600" },
  { slug: "technology", label: "Technology", color: "from-cyan-500 to-blue-600" },
  { slug: "lifestyle", label: "Lifestyle", color: "from-amber-400 to-orange-500" },
  { slug: "tips-and-guides", label: "Tips & Guides", color: "from-green-400 to-emerald-600" },
];

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Beegeeservice</h1>
          <p className="text-lg md:text-xl text-indigo-100">Insights on Business, Marketing, Technology, Lifestyle & More</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className={`bg-gradient-to-br ${c.color} text-white rounded-xl p-4 text-center font-semibold shadow hover:scale-105 transition`}>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No articles yet. <Link href="/admin" className="text-indigo-600 underline">Create your first post</Link></p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 9).map((post) => (
              <PostCard key={`${post.category}/${post.slug}`} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
