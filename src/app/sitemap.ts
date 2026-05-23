import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const BASE_URL = "https://beegeeservice.com";

const categories = ["business", "marketing", "technology", "lifestyle", "tips-and-guides"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/${post.category}/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${BASE_URL}/${cat}`,
    lastModified: new Date(),
  }));

  return [
    { url: BASE_URL, lastModified: new Date() },
    ...categoryUrls,
    ...postUrls,
  ];
}
