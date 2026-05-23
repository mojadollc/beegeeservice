import PostDetail from "@/components/PostDetail";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostDetail category="tips-and-guides" slug={slug} />;
}
