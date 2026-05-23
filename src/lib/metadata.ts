import { Metadata } from "next";
import { getPost } from "./posts";

export async function generatePostMetadata(category: string, slug: string): Promise<Metadata> {
  const post = await getPost(category, slug);
  if (!post) return { title: "Not Found" };
  const keywords = post.keywords ? post.keywords.split(",").map((k) => k.trim()) : [category, post.title];
  return {
    title: `${post.title} | Beegeeservice`,
    description: post.excerpt,
    keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `/${category}/${slug}`,
    },
  };
}
