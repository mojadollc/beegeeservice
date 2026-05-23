import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Technology Articles | Beegeeservice",
  description: "Stay updated with the latest technology trends, reviews, and tutorials.",
  keywords: ["technology", "tech", "software", "programming", "AI"],
};

export default function Page() { return <CategoryPage category="technology" label="Technology" />; }
