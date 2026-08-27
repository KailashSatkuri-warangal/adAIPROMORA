import { BrandContext } from "../types";

export interface AdGeneratorInput {
  productOrService: string;
  targetAudience?: string;
  offerDetails?: string;
  keywords?: string[];
  brandContext?: BrandContext | null;
}

export function buildAdPrompt(input: AdGeneratorInput): string {
  return `Generate high-ROI, compliant ad copy for Google Ads and Meta (Facebook/Instagram) Ads.
Product / Service: "${input.productOrService}"
${input.targetAudience ? `Target Audience: "${input.targetAudience}"` : ""}
${input.offerDetails ? `Offer / Promo: "${input.offerDetails}"` : ""}
${input.keywords?.length ? `Keywords: "${input.keywords.join(", ")}"` : ""}

Return a structured JSON matching this schema:
{
  "googleAds": {
    "headlines": [
      "Headline 1 (under 30 chars)",
      "Headline 2 (under 30 chars)",
      "Headline 3 (under 30 chars)",
      "Headline 4 (under 30 chars)",
      "Headline 5 (under 30 chars)"
    ],
    "descriptions": [
      "Description 1 with clear value prop and CTA (under 90 chars)",
      "Description 2 with trust signals and urgency (under 90 chars)",
      "Description 3 with secondary feature benefit (under 90 chars)"
    ],
    "negativeKeywords": ["free", "cheap", "cracked", "torrent", "jobs", "salary"]
  },
  "metaAds": {
    "primaryTextVariations": [
      "Variation 1: Problem-Agitate-Solve hook highlighting core friction and transformative outcome",
      "Variation 2: Social proof & clinical/operational proof angle with bulleted benefits",
      "Variation 3: Short, urgent direct-response offer hook"
    ],
    "headlines": [
      "Punchy Meta Ad Headline A",
      "Punchy Meta Ad Headline B"
    ],
    "callToAction": "Shop Now / Learn More / Claim Offer"
  },
  "audienceSuggestions": [
    "Lookalike 1% of highest LTV buyers",
    "Interest targeting: Competitor brands & Category keywords",
    "Retargeting 30-day website visitors & cart abandoners"
  ]
}`;
}
