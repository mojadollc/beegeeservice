import { getPost, getRecommendedPosts } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "./Sidebar";
import ReactionBar from "./ReactionBar";
import PostCard from "./PostCard";
import ShareButtons from "./ShareButtons";

export default async function PostDetail({ category, slug }: { category: string; slug: string }) {
  const post = await getPost(category, slug);
  if (!post) notFound();
  const recommended = await getRecommendedPosts(category, slug);
  const postUrl = `https://beegoo.app/${category}/${slug}`;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
      <div className="flex-1 min-w-0">
        <article>
          <Link href={`/${category}`} className="text-teal-600 text-sm font-medium hover:underline">&larr; Back to {category.replace(/-/g, " ")}</Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-2">{post.title}</h1>
          <p className="text-gray-400 text-sm mb-4">{post.date}</p>
          <ShareButtons url={postUrl} title={post.title} />
          {post.image && <img src={post.image} alt={post.title} className="w-full rounded-xl mb-8 mt-6" />}
          <div className="prose prose-lg max-w-none prose-a:text-teal-600 prose-a:underline" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          <ShareButtons url={postUrl} title={post.title} />
          <ReactionBar postId={`${category}/${slug}`} />
        </article>

        {recommended.length > 0 && (
          <section className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold mb-6">Recommended Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((p) => <PostCard key={`${p.category}/${p.slug}`} post={p} />)}
            </div>
          </section>
        )}
      </div>
      <div className="w-full lg:w-72 shrink-0">
        <Sidebar />
      </div>
    </div>
  );
}
