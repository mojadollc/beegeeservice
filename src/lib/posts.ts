import { prisma } from "./prisma";
import { remark } from "remark";
import html from "remark-html";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  content?: string;
};

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { category },
    orderBy: { date: "desc" },
  });
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image }));
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({ orderBy: { date: "desc" } });
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image }));
}

export async function getPost(category: string, slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({ where: { category_slug: { category, slug } } });
  if (!post) return null;
  const processed = await remark().use(html).process(post.body);
  return { slug: post.slug, title: post.title, date: post.date, excerpt: post.excerpt, category: post.category, image: post.image, content: processed.toString() };
}

export async function savePost(category: string, slug: string, data: { title: string; date: string; excerpt: string; image: string }, body: string) {
  await prisma.post.upsert({
    where: { category_slug: { category, slug } },
    update: { title: data.title, excerpt: data.excerpt, image: data.image, body, date: data.date },
    create: { slug, category, title: data.title, excerpt: data.excerpt, image: data.image, body, date: data.date },
  });
}

export async function deletePost(category: string, slug: string) {
  await prisma.post.deleteMany({ where: { category, slug } });
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { OR: [{ title: { contains: query } }, { excerpt: { contains: query } }] },
    orderBy: { date: "desc" },
  });
  return posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, category: p.category, image: p.image }));
}
