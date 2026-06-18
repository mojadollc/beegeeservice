import { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tips & Guides | Beegoo",
  description: "Practical tips, how-to guides, and step-by-step tutorials.",
  keywords: ["tips", "guides", "how-to", "tutorials", "advice"],
};

export default function Page() { return <CategoryPage category="tips-and-guides" label="Tips & Guides" />; }
