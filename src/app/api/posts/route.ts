import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, savePost, deletePost } from "@/lib/posts";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token && verifyToken(token);
}

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, category, excerpt, image, body } = await req.json();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const date = new Date().toISOString().split("T")[0];
  await savePost(category, slug, { title, date, excerpt, image: image || "" }, body);
  return NextResponse.json({ success: true, slug });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { category, slug } = await req.json();
  await deletePost(category, slug);
  return NextResponse.json({ success: true });
}
