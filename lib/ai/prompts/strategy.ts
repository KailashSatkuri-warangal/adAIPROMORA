import { BrandContext } from "../types";

export interface StrategyInput {
  goals: string[];
  timelineDays?: number;
  budgetMonthly?: number;
  targetChannels?: string[];
  brandContext?: BrandContext | null;
}

export function buildStrategyPrompt(input: StrategyInput): string {
  return `Generate an end-to-end 360-degree Marketing Strategy & 30-Day Growth Execution Plan for:
Target Goals: ${input.goals.join(", ")}
${input.budgetMonthly ? `Monthly Budget: $${input.budgetMonthly}` : ""}
${input.targetChannels?.length ? `Priority Channels: ${input.targetChannels.join(", ")}` : ""}

Return a structured JSON matching this schema:
{
  "strategyTitle": "Growth Blueprint: High-Velocity Market Expansion",
  "positioning": "Precise market positioning angle emphasizing distinct USP",
  "targetPersona": {
    "title": "Primary Decision Maker / Core Buyer",
    "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
    "buyingTriggers": ["Trigger 1", "Trigger 2"]
  },
  "channelBreakdown": [
    { "channel": "SEO & Content Hub", "allocation": "30%", "tactics": "Publish 4 pillar cluster guides targeting high-intent long-tail keywords" },
    { "channel": "Paid Acquisition (Meta/Google)", "allocation": "40%", "tactics": "Run problem-solution video hooks retargeting quiz/landing page visitors" },
    { "channel": "Lifecycle Email Automation", "allocation": "15%", "tactics": "Implement 4-part abandoned cart and lead nurture drip" },
    { "channel": "Social Proof & Community", "allocation": "15%", "tactics": "Curate weekly user transformation spotlights and founder stories" }
  ],
  "thirtyDayMilestones": {
    "week1": "Foundational setup: On-page SEO tags, Brand Kit assets, pixel tracking, and Welcome email sequence.",
    "week2": "Launch initial ad creative batch across Meta & Google; publish 2 core SEO pillar articles.",
    "week3": "Analyze early CTR and ROAS signals; scale top 2 ad variations and launch quiz retargeting flow.",
    "week4": "Conduct mid-cycle review, compile attribution metrics, and schedule next month's content calendar."
  },
  "projectedKpis": {
    "trafficGrowth": "+35%",
    "qualifiedLeads": "450 - 750",
    "targetCAC": "$24 - $32",
    "projectedROAS": "3.8x"
  }
}`;
}
