import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Business Articles | Beegoo",
  description: "Latest business insights, strategies, and news to grow your business.",
  keywords: ["business", "entrepreneurship", "strategy", "growth"],
};

export default function Page() { return <CategoryPage category="business" label="Business" />; }
