import { BrandContext } from "../types";

export function buildLandingPageAuditPrompt(url: string, brand?: BrandContext | null): string {
  return `Analyze and optimize the conversion architecture and copy structure of the landing page:
URL: "${url}"
${brand ? `Brand Context: ${brand.name} | USP: ${brand.uniqueSellingProp || "N/A"}` : ""}

Return a structured JSON matching this schema:
{
  "url": "${url}",
  "conversionScore": 76,
  "seoScore": 88,
  "copyScore": 81,
  "ctaScore": 72,
  "structureAnalysis": {
    "hasClearHero": true,
    "hasSocialProof": true,
    "hasFaq": false,
    "hasStickyCta": false
  },
  "uxRecommendations": [
    "Move the primary conversion CTA button above the fold on mobile screens.",
    "Add trusted badges, verified reviews, or clinical proof metrics directly beneath the main headline.",
    "Introduce an interactive 60-second quiz or calculator to capture non-ready buyers."
  ],
  "copyRecommendations": [
    "Replace passive headline with direct transformation statement.",
    "Use bullet points emphasizing benefits over technical specifications.",
    "Highlight risk reversal (e.g. 30-day guarantee / free trial without credit card)."
  ],
  "improvedStructureBlueprint": [
    { "section": "1. Hero Section", "content": "Bold benefit-driven H1 + 2-sentence subheadline + High-contrast Primary CTA + Social proof badge (4.9/5 stars)" },
    { "section": "2. The Agitation & Problem", "content": "3 key frustrations ideal customers experience with current legacy solutions" },
    { "section": "3. The Solution & Mechanism", "content": "How our proprietary approach eliminates friction and restores performance" },
    { "section": "4. Tangible Benefits Grid", "content": "6-grid visual card breakdown of outcomes, time saved, and metric gains" },
    { "section": "5. Case Studies / Testimonials", "content": "3 specific customer quotes with before/after metric results" },
    { "section": "6. Interactive FAQ Accordion", "content": "Addressing top 5 objections (pricing, onboarding, compatibility, support)" },
    { "section": "7. Final Sticky CTA", "content": "Last-chance risk-free offer with countdown or bonus incentive" }
  ]
}`;
}
