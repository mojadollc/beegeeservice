import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Marketing Articles | Beegeeservice",
  description: "Expert marketing tips, digital strategies, and campaign insights.",
  keywords: ["marketing", "digital marketing", "SEO", "social media", "advertising"],
};

export default function Page() { return <CategoryPage category="marketing" label="Marketing" />; }
