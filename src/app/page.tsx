import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

const heights = ["h-80", "h-96", "h-[22rem]", "h-[26rem]", "h-80", "h-[28rem]", "h-96", "h-[22rem]", "h-80", "h-[26rem]"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  const posts = await getAllPosts();
  const shuffled = shuffle(posts);

  return (
    <>
      {/* TikTok-style masonry grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <p className="text-slate-500">No articles yet. <Link href="/admin" className="text-teal-600 underline">Create your first post</Link></p>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {shuffled.map((post, i) => (
              <Link
                key={`${post.category}/${post.slug}`}
                href={`/${post.category}/${post.slug}`}
                className={`group block relative rounded-xl overflow-hidden break-inside-avoid ${heights[i % heights.length]}`}
              >
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="200" fill="#f1f5f9" />
                      <circle cx="320" cy="40" r="80" fill="#e2e8f0" />
                      <circle cx="60" cy="170" r="60" fill="#cbd5e1" />
                      <path d="M0 140 Q200 60 400 120 L400 200 L0 200Z" fill="#0d9488" opacity="0.15" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block bg-teal-600/90 text-white text-[10px] font-medium uppercase px-2 py-0.5 rounded-full mb-2">{post.category.replace(/-/g, " ")}</span>
                  <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-teal-300 transition line-clamp-3 leading-snug">{post.title}</h3>
                  <p className="text-slate-400 text-xs mt-1">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
