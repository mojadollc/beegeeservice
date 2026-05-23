import { Metadata } from "next";
import PostDetail from "@/components/PostDetail";
import { generatePostMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata("marketing", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostDetail category="marketing" slug={slug} />;
}
