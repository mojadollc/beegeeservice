import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, savePost, deletePost } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token && verifyToken(token);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");
  if (category && slug) {
    const post = await prisma.post.findUnique({ where: { category_slug: { category, slug } } });
    return NextResponse.json(post);
  }
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, category, excerpt, image, keywords, body } = await req.json();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const date = new Date().toISOString().split("T")[0];
  await savePost(category, slug, { title, date, excerpt, image: image || "", keywords: keywords || "" }, body);
  return NextResponse.json({ success: true, slug });
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { category, slug, title, excerpt, image, keywords, body } = await req.json();
  await savePost(category, slug, { title, date: new Date().toISOString().split("T")[0], excerpt, image: image || "", keywords: keywords || "" }, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { category, slug } = await req.json();
  await deletePost(category, slug);
  return NextResponse.json({ success: true });
}
