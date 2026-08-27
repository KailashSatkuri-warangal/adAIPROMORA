import { BrandContext } from "../types";

export function buildCompetitorAnalysisPrompt(competitorUrl: string, brand?: BrandContext | null): string {
  return `Perform an in-depth competitive intelligence audit on the publicly available market positioning of:
Competitor Domain: "${competitorUrl}"
${brand ? `Our Brand: "${brand.name}" (Industry: ${brand.industry || "General"})` : ""}

Return a structured JSON matching this schema:
{
  "name": "Competitor Brand Name",
  "domain": "${competitorUrl}",
  "summary": "2-3 sentence overview of their positioning, target segment, and primary market claims",
  "strengths": [
    "Key market advantage 1 (e.g. established brand recognition, large social footprint)",
    "Key advantage 2 (e.g. extensive product line, low pricing tiers)"
  ],
  "weaknesses": [
    "Identifiable vulnerability 1 (e.g. lack of clinical proof, artificial additives, slow customer service)",
    "Vulnerability 2 (e.g. neglected long-tail SEO keywords, rigid software UI)"
  ],
  "seoOpportunities": [
    "High-intent keyword cluster where competitor is underperforming",
    "Content format gap (e.g. lack of in-depth comparison calculators)"
  ],
  "socialPresence": {
    "estimatedReach": "Moderate - High",
    "primaryChannels": "Instagram, TikTok, YouTube",
    "contentCadence": "1-2 times daily"
  },
  "battlecard": {
    "keyDifferentiator": "Our clear winning edge over this competitor",
    "pitchToFrustratedUsers": "Exact 2-sentence positioning angle to win over their churned customers",
    "adCounterStrategy": "Recommended paid ad hooks to target their audience interest clusters",
    "contentActionItems": [
      "Publish an objective comparison guide highlighting our core USP",
      "Launch targeted FAQ addressing their most frequent customer complaints"
    ]
  }
}`;
}
