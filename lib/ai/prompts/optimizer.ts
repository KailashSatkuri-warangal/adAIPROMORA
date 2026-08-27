import { BrandContext } from "../types";

export interface OptimizerInput {
  content: string;
  targetKeyword?: string;
  brandContext?: BrandContext | null;
}

export function buildContentOptimizerPrompt(input: OptimizerInput): string {
  return `Analyze and optimize the following marketing / blog content for on-page SEO, readability, keyword relevance, and conversion impact:

Target Keyword: "${input.targetKeyword || "Primary Focus Term"}"
Content to analyze:
"""
${input.content}
"""

Return a structured JSON matching this schema:
{
  "score": 85,
  "keywordDensity": "1.8%",
  "readabilityLevel": "Grade 8 (High Readability)",
  "wordCount": 650,
  "checks": {
    "keywordInTitle": true,
    "keywordInFirst100Words": true,
    "keywordInHeadings": true,
    "featuredSnippetReadiness": "High",
    "searchIntentMatch": "Strong (Informational & Commercial)"
  },
  "semanticGaps": [
    "Mention specific clinical ingredients or quantifiable metric proof",
    "Add an explicit step-by-step implementation section",
    "Include a structured FAQ block to capture 'People Also Ask' boxes"
  ],
  "actionableFixes": [
    "Increase keyword occurrences in subheaders by 1-2 instances.",
    "Shorten paragraph length to max 3 sentences for mobile readability.",
    "Add a high-converting CTA anchor before the final concluding thoughts."
  ],
  "optimizedContent": "Fully rewritten, enhanced version of the input content that incorporates the target keyword naturally, strengthens hooks, adds subheadings, fixes formatting, and boosts the overall SEO score to 95+ while preserving the user's authentic intent."
}`;
}
