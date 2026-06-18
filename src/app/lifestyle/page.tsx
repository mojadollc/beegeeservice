import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Lifestyle Articles | Beegoo",
  description: "Lifestyle tips, wellness advice, and inspiration for everyday living.",
  keywords: ["lifestyle", "wellness", "health", "productivity", "living"],
};

export default function Page() { return <CategoryPage category="lifestyle" label="Lifestyle" />; }
