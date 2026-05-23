import { getPost } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "./Sidebar";
import ReactionBar from "./ReactionBar";

export default async function PostDetail({ category, slug }: { category: string; slug: string }) {
  const post = await getPost(category, slug);
  if (!post) notFound();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
      <article className="flex-1 min-w-0">
        <Link href={`/${category}`} className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to {category.replace(/-/g, " ")}</Link>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-2">{post.title}</h1>
        <p className="text-gray-400 text-sm mb-8">{post.date}</p>
        {post.image && <img src={post.image} alt={post.title} className="w-full rounded-xl mb-8" />}
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        <ReactionBar postId={`${category}/${slug}`} />
      </article>
      <div className="w-full lg:w-72 shrink-0">
        <Sidebar />
      </div>
    </div>
  );
}
