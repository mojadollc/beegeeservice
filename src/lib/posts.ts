import { prisma } from "./prisma";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  keywords?: string;
  content?: string;
};

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { category },
    orderBy: { date: "desc" },
  });
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image, keywords: p.keywords }));
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({ orderBy: { date: "desc" } });
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image, keywords: p.keywords }));
}

export async function getPost(category: string, slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({ where: { category_slug: { category, slug } } });
  if (!post) return null;
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(post.body);
  // Auto-link bare URLs not already in anchor tags
  const htmlContent = processed.toString().replace(
    /(?<!href=")(?<!<a[^>]*>)(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-teal-600 underline">$1</a>'
  );
  return { slug: post.slug, title: post.title, date: post.date, excerpt: post.excerpt, category: post.category, image: post.image, keywords: post.keywords, content: htmlContent };
}

export async function savePost(category: string, slug: string, data: { title: string; date: string; excerpt: string; image: string; keywords?: string }, body: string) {
  await prisma.post.upsert({
    where: { category_slug: { category, slug } },
    update: { title: data.title, excerpt: data.excerpt, image: data.image, keywords: data.keywords || "", body, date: data.date },
    create: { slug, category, title: data.title, excerpt: data.excerpt, image: data.image, keywords: data.keywords || "", body, date: data.date },
  });
}

export async function deletePost(category: string, slug: string) {
  await prisma.post.deleteMany({ where: { category, slug } });
}

export async function getRecommendedPosts(category: string, excludeSlug: string, limit = 3): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { category, slug: { not: excludeSlug } },
    orderBy: { date: "desc" },
    take: limit,
  });
  if (posts.length < limit) {
    const more = await prisma.post.findMany({
      where: { slug: { not: excludeSlug }, category: { not: category } },
      orderBy: { date: "desc" },
      take: limit - posts.length,
    });
    posts.push(...more);
  }
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image, keywords: p.keywords }));
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { OR: [{ title: { contains: query } }, { excerpt: { contains: query } }] },
    orderBy: { date: "desc" },
  });
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image, keywords: p.keywords }));
}
