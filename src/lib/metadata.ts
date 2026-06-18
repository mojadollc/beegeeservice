import { Metadata } from "next";
import { getPost } from "./posts";

const BASE_URL = "https://beegoo.app";

export async function generatePostMetadata(category: string, slug: string): Promise<Metadata> {
  const post = await getPost(category, slug);
  if (!post) return { title: "Not Found" };
  const keywords = post.keywords ? post.keywords.split(",").map((k) => k.trim()) : [category, post.title];
  const imageUrl = post.image ? `${BASE_URL}${post.image}` : undefined;
  return {
    title: `${post.title} | Beegoo`,
    description: post.excerpt,
    keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${BASE_URL}/${category}/${slug}`,
      publishedTime: post.date,
      siteName: "Beegoo",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/${category}/${slug}`,
    },
  };
}
