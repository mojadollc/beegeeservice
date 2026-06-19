import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

const categories = [
  { slug: "business", label: "Business" },
  { slug: "marketing", label: "Marketing" },
  { slug: "technology", label: "Technology" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "tips-and-guides", label: "Tips & Guides" },
];

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <>
      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        {posts.length === 0 ? (
          <p className="text-slate-500">No articles yet. <Link href="/admin" className="text-teal-600 underline">Create your first post</Link></p>
        ) : (
          <>
            {/* Featured Article */}
            <div className="mb-14">
              <Link href={`/${posts[0].category}/${posts[0].slug}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden h-[380px]">
                  {posts[0].image ? (
                    <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 relative">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="200" fill="#e2e8f0" />
                        <circle cx="320" cy="40" r="80" fill="#cbd5e1" />
                        <circle cx="60" cy="170" r="60" fill="#94a3b8" />
                        <path d="M0 140 Q200 60 400 120 L400 200 L0 200Z" fill="#0d9488" opacity="0.2" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block bg-teal-600 text-white text-xs font-medium uppercase tracking-wide px-3 py-1 rounded-full mb-3">{posts[0].category.replace(/-/g, " ")}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-teal-300 transition leading-tight">{posts[0].title}</h2>
                    <p className="text-slate-300 mt-2 line-clamp-2 max-w-2xl text-sm">{posts[0].excerpt}</p>
                    <p className="text-slate-400 text-xs mt-3">{posts[0].date}</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Secondary Featured */}
            {posts.length > 1 && (
              <div className="grid md:grid-cols-2 gap-5 mb-14">
                {posts.slice(1, 3).map((post) => (
                  <Link key={`${post.category}/${post.slug}`} href={`/${post.category}/${post.slug}`} className="group block relative rounded-xl overflow-hidden h-[220px]">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 relative">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="200" fill="#e2e8f0" />
                          <circle cx="320" cy="40" r="80" fill="#cbd5e1" />
                          <circle cx="60" cy="170" r="60" fill="#94a3b8" />
                          <path d="M0 140 Q200 60 400 120 L400 200 L0 200Z" fill="#0d9488" opacity="0.2" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block bg-teal-600/90 text-white text-xs font-medium uppercase px-2 py-0.5 rounded-full mb-2">{post.category.replace(/-/g, " ")}</span>
                      <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition line-clamp-2">{post.title}</h3>
                      <p className="text-slate-400 text-xs mt-1">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Latest Articles */}
            {posts.length > 3 && (
              <div className="mb-14">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Latest Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {posts.slice(3, 12).map((post) => (
                    <PostCard key={`${post.category}/${post.slug}`} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Category Sections */}
            {categories.map((cat) => {
              const catPosts = posts.filter((p) => p.category === cat.slug).slice(0, 3);
              if (catPosts.length === 0) return null;
              return (
                <div key={cat.slug} className="mt-14">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-800">{cat.label}</h2>
                    <Link href={`/${cat.slug}`} className="text-teal-600 text-sm font-medium hover:underline">View all →</Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catPosts.map((post) => (
                      <PostCard key={`${post.category}/${post.slug}`} post={post} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>
    </>
  );
}
