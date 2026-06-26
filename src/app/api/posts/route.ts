import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, savePost, deletePost } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token && verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    if (category && slug) {
      const post = await prisma.post.findUnique({ where: { category_slug: { category, slug } } });
      return NextResponse.json(post);
    }
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { title, category, excerpt, image, keywords, body } = await req.json();
    if (!title || !category || !excerpt || !body) {
      return NextResponse.json({ error: "Title, category, excerpt, and body are required" }, { status: 400 });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const date = new Date().toISOString().split("T")[0];
    await savePost(category, slug, { title, date, excerpt, image: image || "", keywords: keywords || "" }, body);
    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: "Failed to save post. Please try again." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { category, slug, title, excerpt, image, keywords, body } = await req.json();
    if (!title || !category || !slug || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await savePost(category, slug, { title, date: new Date().toISOString().split("T")[0], excerpt, image: image || "", keywords: keywords || "" }, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/posts error:", err);
    return NextResponse.json({ error: "Failed to update post. Please try again." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { category, slug } = await req.json();
    await deletePost(category, slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/posts error:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
