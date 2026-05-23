import { searchPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const posts = query ? await searchPosts(query) : [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">
        {query ? `Showing results for "${q}"` : "Enter a search term"}
      </p>
      {posts.length === 0 && query ? (
        <p className="text-gray-500">No articles found matching your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <PostCard key={`${post.category}/${post.slug}`} post={post} />)}
        </div>
      )}
    </section>
  );
}
