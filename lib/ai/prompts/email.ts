import { BrandContext } from "../types";

export interface EmailGeneratorInput {
  campaignType: "welcome" | "newsletter" | "promo" | "cart_recovery" | "reengagement" | "cold_outreach";
  subjectGoal: string;
  keyPoints?: string[];
  ctaUrl?: string;
  brandContext?: BrandContext | null;
}

export function buildEmailPrompt(input: EmailGeneratorInput): string {
  return `Generate an engaging, high-deliverability email marketing template:
Campaign Type: "${input.campaignType}"
Campaign Goal / Topic: "${input.subjectGoal}"
${input.keyPoints?.length ? `Key Value Points: ${input.keyPoints.join(", ")}` : ""}
${input.ctaUrl ? `CTA Destination: "${input.ctaUrl}"` : ""}

Return a structured JSON matching this schema:
{
  "subjectLines": [
    "Subject Line Option 1 (Curiosity / Benefit driven)",
    "Subject Line Option 2 (Urgency / Direct)",
    "Subject Line Option 3 (Personalized emoji angle)"
  ],
  "previewText": "Engaging pre-header text that complements the subject lines (under 80 chars)",
  "body": "Full formatted email body in clean markdown with greeting {{firstName}}, compelling narrative, bullet points, and CTA button",
  "ctaText": "Clickable Button Copy",
  "ctaUrl": "${input.ctaUrl || "https://yourdomain.com/special-offer"}",
  "followUpEmail": {
    "delayDays": 2,
    "subject": "Quick follow up regarding your earlier note",
    "body": "Short, polite 3-sentence nudge email reminding the contact of the core benefit and deadline."
  },
  "spamScoreTips": [
    "Avoid ALL CAPS in subject line",
    "Ensure 60:40 text-to-image ratio",
    "Include physical company footer and one-click unsubscribe tag"
  ]
}`;
}
