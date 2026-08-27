import { BrandContext } from "../types";

export interface CalendarGenerateInput {
  monthName?: string;
  focusTheme?: string;
  platforms?: string[];
  cadencePerWeek?: number;
  brandContext?: BrandContext | null;
}

export function buildCalendarPrompt(input: CalendarGenerateInput): string {
  return `Generate a high-performing, 30-Day Multi-Channel Content Calendar for:
Focus Theme: "${input.focusTheme || "Product Authority & Customer Acquisition"}"
Platforms: ${input.platforms?.join(", ") || "Instagram, LinkedIn, X, Blog, Newsletter"}
Posts per week: ${input.cadencePerWeek || 4}

Return a structured JSON matching this schema:
{
  "theme": "${input.focusTheme || "Product Authority & Customer Acquisition"}",
  "totalPosts": 15,
  "items": [
    {
      "day": 1,
      "platform": "INSTAGRAM",
      "contentType": "social_post",
      "title": "Educational Carousel: 5 Mistakes to Avoid in Your Strategy",
      "topic": "Common Pitfalls & Fixes",
      "status": "IDEA",
      "captionHook": "Stop wasting budget on these 5 outdated tactics..."
    },
    {
      "day": 3,
      "platform": "LINKEDIN",
      "contentType": "social_post",
      "title": "Founder's Breakdown: How we optimized our acquisition funnel",
      "topic": "Thought Leadership & Transparency",
      "status": "IDEA",
      "captionHook": "3 years ago, our conversion rate was stalled at 1.2%..."
    },
    {
      "day": 5,
      "platform": "X_TWITTER",
      "contentType": "social_post",
      "title": "Tactical Thread: 7 Free Tools every marketer needs",
      "topic": "Curated Tool Stack",
      "status": "IDEA",
      "captionHook": "The modern marketing tech stack is broken. Here's what actually works: 🧵"
    },
    {
      "day": 8,
      "platform": "BLOG",
      "contentType": "blog_post",
      "title": "In-Depth Guide: Scaling Organic Search Velocity in 2026",
      "topic": "SEO Pillar",
      "status": "IDEA",
      "captionHook": "Pillar content targeting primary high-intent keyword cluster."
    },
    {
      "day": 10,
      "platform": "EMAIL",
      "contentType": "email",
      "title": "Community Newsletter: Behind the scenes + Exclusive 15% VIP Access",
      "topic": "Lifecycle Offer",
      "status": "IDEA",
      "captionHook": "VIP community digest with limited-batch promo code."
    }
  ]
}`;
}
