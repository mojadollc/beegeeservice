import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId") || "";
  const [category, slug] = postId.split("/");
  const post = await prisma.post.findUnique({ where: { category_slug: { category, slug } }, include: { reactions: true } });
  if (!post) return NextResponse.json({});
  const counts: Record<string, number> = {};
  post.reactions.forEach((r) => { counts[r.emoji] = r.count; });
  return NextResponse.json(counts);
}

export async function POST(req: NextRequest) {
  const { postId, emoji } = await req.json();
  const [category, slug] = postId.split("/");
  const post = await prisma.post.findUnique({ where: { category_slug: { category, slug } } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  await prisma.reaction.upsert({
    where: { postId_emoji: { postId: post.id, emoji } },
    update: { count: { increment: 1 } },
    create: { postId: post.id, emoji, count: 1 },
  });
  return NextResponse.json({ success: true });
}
