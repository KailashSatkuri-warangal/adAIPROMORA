import { BrandContext } from "../types";

export interface BlogGeneratorInput {
  topic: string;
  keyword?: string;
  targetAudience?: string;
  tone?: string;
  length?: "short" | "medium" | "long";
  language?: string;
  brandContext?: BrandContext | null;
}

export function buildBlogPrompt(input: BlogGeneratorInput): string {
  return `Generate a comprehensive, SEO-optimized blog article and metadata for the following topic:
Topic: "${input.topic}"
${input.keyword ? `Primary Keyword: "${input.keyword}"` : ""}
${input.targetAudience ? `Target Audience: "${input.targetAudience}"` : ""}
${input.tone ? `Tone of Voice: "${input.tone}"` : ""}
${input.length ? `Article Length Target: "${input.length}"` : ""}
Language: "${input.language || "English"}"

Return a structured JSON object matching this schema:
{
  "title": "Compelling, click-worthy SEO title (under 60 characters)",
  "outline": ["1. Introduction...", "2. Section Header...", "3. Subtopic...", "4. Conclusion..."],
  "fullArticle": "Complete markdown article with formatted H2/H3 headers, bullet points, and clinical/actionable insights",
  "metaTitle": "Search engine optimized meta title (50-60 chars)",
  "metaDescription": "Action-oriented meta description with keyword (140-160 chars)",
  "faq": [
    { "question": "Relevant question 1?", "answer": "Concise authoritative answer" },
    { "question": "Relevant question 2?", "answer": "Concise authoritative answer" }
  ],
  "cta": "Engaging call-to-action closing phrase",
  "seoScore": 92,
  "readabilityScore": 88
}`;
}
