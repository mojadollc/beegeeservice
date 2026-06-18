import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Beegoo - Business, Marketing, Technology & Lifestyle Blog",
    template: "%s | Beegoo",
  },
  description: "Expert insights on Business, Marketing, Technology, Lifestyle, Tips and Guides. Stay informed with the latest articles and strategies.",
  keywords: ["business", "marketing", "technology", "lifestyle", "tips", "guides", "blog", "beegoo"],
  openGraph: {
    type: "website",
    siteName: "Beegoo",
    title: "Beegoo - Business, Marketing, Technology & Lifestyle Blog",
    description: "Expert insights on Business, Marketing, Technology, Lifestyle, Tips and Guides.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
