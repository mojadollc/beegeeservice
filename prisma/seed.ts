import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const posts = [
  {
    slug: "10-strategies-to-scale-your-business-in-2024",
    category: "business",
    title: "10 Strategies to Scale Your Business in 2024",
    excerpt: "Discover proven strategies that successful entrepreneurs use to scale their businesses effectively.",
    date: "2024-12-01",
    body: `Scaling a business requires a combination of strategic planning, resource management, and adaptability.\n\n## 1. Automate Repetitive Tasks\n\nInvest in tools and software that automate routine operations.\n\n## 2. Build a Strong Team\n\nYour business is only as strong as the people behind it.\n\n## 3. Focus on Customer Retention\n\nAcquiring new customers costs 5x more than retaining existing ones.\n\n## 4. Leverage Data Analytics\n\nUse data to make informed decisions about product development and marketing.\n\n## 5. Diversify Revenue Streams\n\nDon't rely on a single product or service.`,
  },
  {
    slug: "the-ultimate-guide-to-social-media-marketing",
    category: "marketing",
    title: "The Ultimate Guide to Social Media Marketing",
    excerpt: "Learn how to build a powerful social media presence that drives engagement and conversions.",
    date: "2024-11-28",
    body: `Social media marketing is no longer optional — it's essential.\n\n## Choose the Right Platforms\n\nNot every platform suits every business. B2B companies thrive on LinkedIn, while visual brands excel on Instagram.\n\n## Create Consistent Content\n\nPost regularly with a content calendar. Mix educational, entertaining, and promotional content.\n\n## Engage Authentically\n\nRespond to comments, join conversations, and show the human side of your brand.\n\n## Track Your Metrics\n\nMonitor engagement rates, reach, and conversions.`,
  },
  {
    slug: "ai-tools-every-developer-should-know-in-2024",
    category: "technology",
    title: "AI Tools Every Developer Should Know in 2024",
    excerpt: "From code assistants to deployment automation, these AI tools are transforming software development.",
    date: "2024-12-05",
    body: `Artificial intelligence is revolutionizing how we write, test, and deploy code.\n\n## Code Assistants\n\nAI-powered code completion tools can boost productivity by 30-50%.\n\n## Automated Testing\n\nAI can generate test cases and identify edge cases you might miss.\n\n## Infrastructure Management\n\nCloud platforms now offer AI-driven recommendations for scaling and cost optimization.\n\n## The Future\n\nDevelopers will spend less time on boilerplate and more time on creative problem-solving.`,
  },
  {
    slug: "building-a-productive-morning-routine",
    category: "lifestyle",
    title: "Building a Productive Morning Routine",
    excerpt: "How successful people structure their mornings for maximum productivity and well-being.",
    date: "2024-11-25",
    body: `Your morning sets the tone for the entire day.\n\n## Wake Up Early\n\nGive yourself time before the world demands your attention.\n\n## Move Your Body\n\nExercise boosts energy, mood, and cognitive function.\n\n## Plan Your Day\n\nSpend 10 minutes reviewing your priorities. Identify your top 3 tasks.\n\n## Protect Your Morning\n\nAvoid checking email or social media first thing.`,
  },
  {
    slug: "how-to-start-a-blog-that-actually-makes-money",
    category: "tips-and-guides",
    title: "How to Start a Blog That Actually Makes Money",
    excerpt: "A step-by-step guide to launching a profitable blog from scratch, even with no experience.",
    date: "2024-12-03",
    body: `Starting a blog is easy. Building one that generates income takes strategy.\n\n## Step 1: Choose Your Niche\n\nPick a topic you're passionate about AND that has commercial potential.\n\n## Step 2: Set Up Your Platform\n\nChoose a reliable hosting provider and a clean, fast theme.\n\n## Step 3: Create Valuable Content\n\nWrite in-depth articles that solve real problems.\n\n## Step 4: Build Traffic\n\nUse SEO, social media, and email marketing.\n\n## Step 5: Monetize\n\nExplore affiliate marketing, sponsored posts, or digital products.`,
  },
];

async function seed() {
  for (const post of posts) {
    await prisma.post.upsert({
      where: { category_slug: { category: post.category, slug: post.slug } },
      update: {},
      create: { ...post, image: "" },
    });
  }
  console.log("Seeded 5 sample posts");
}

seed().then(() => process.exit(0));
