import { BrandContext } from "../types";

export function buildKeywordResearchPrompt(term: string, brand?: BrandContext | null): string {
  return `Perform comprehensive semantic keyword intelligence and search intent analysis for the root query:
Root Term: "${term}"
${brand?.industry ? `Industry: "${brand.industry}"` : ""}

Return a structured JSON matching this schema:
{
  "rootTerm": "${term}",
  "estimatedVolume": 18500,
  "difficulty": 45,
  "cpc": 2.75,
  "intent": "Commercial / Informational",
  "isAiEstimate": true,
  "relatedKeywords": [
    { "term": "related query 1", "intent": "Informational", "difficulty": 32, "volume": 12000, "cpc": 1.80 },
    { "term": "related query 2", "intent": "Commercial", "difficulty": 51, "volume": 8400, "cpc": 3.20 },
    { "term": "related query 3", "intent": "Transactional", "difficulty": 48, "volume": 6200, "cpc": 3.90 },
    { "term": "related query 4", "intent": "Informational", "difficulty": 25, "volume": 4500, "cpc": 1.10 }
  ],
  "longTailQuestions": [
    "What is the most effective way to...",
    "How does X compare against Y for beginners?",
    "Why does X happen when using Y?"
  ],
  "contentOpportunities": [
    "Pillar resource guide addressing top 5 consumer misconceptions",
    "Direct product comparison table vs market leader",
    "Checklist or calculator downloadable lead magnet"
  ]
}`;
}

export function buildSeoAuditPrompt(url: string): string {
  return `Analyze and simulate an in-depth technical and content SEO audit for the webpage:
URL: "${url}"

Return a structured JSON matching this schema:
{
  "targetUrl": "${url}",
  "overallScore": 88,
  "technicalScore": 92,
  "contentScore": 85,
  "mobileScore": 94,
  "performanceScore": 82,
  "metaAnalysis": {
    "title": "Optimized Page Title | Brand Name",
    "titleLength": 54,
    "titleStatus": "good",
    "description": "Engaging meta description containing primary keyword and clear click incentive under 160 characters.",
    "descriptionLength": 148,
    "descriptionStatus": "good"
  },
  "headings": {
    "h1Count": 1,
    "h1Text": "Primary Target Keyword Heading",
    "h2Count": 6,
    "hierarchyStatus": "optimal"
  },
  "issues": [
    { "severity": "warning", "message": "3 product images lack explicit WebP compression or descriptive ALT attributes." },
    { "severity": "notice", "message": "BreadcrumbList Schema markup should be added to category landing paths." },
    { "severity": "good", "message": "Canonical tags, robots.txt, and XML sitemap are correctly structured." }
  ],
  "recommendations": [
    "Include primary search term within the first 100 words of the body content.",
    "Add structured FAQ schema markup for featured snippet potential.",
    "Implement internal cross-links from top-ranked guides to this page."
  ]
}`;
}
