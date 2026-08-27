import { BrandContext } from "../types";

export function buildMarketingReportPrompt(metricsSummary: any, brand?: BrandContext | null): string {
  return `Generate an executive-level AI marketing intelligence report based on the following real campaign analytics:
Analytics Summary:
${JSON.stringify(metricsSummary, null, 2)}
${brand ? `Brand: ${brand.name} | Industry: ${brand.industry || "General"}` : ""}

Return a structured JSON matching this schema:
{
  "title": "Comprehensive Executive Marketing & Growth Attribution Report",
  "period": "Last 30 Days",
  "executiveSummary": "2-3 paragraphs synthesizing top-line performance, revenue attribution, customer acquisition efficiency, and market traction.",
  "whatWorked": [
    "Key success driver 1 with specific metric context",
    "Key success driver 2 with specific metric context",
    "Key success driver 3 with specific metric context"
  ],
  "whatDidNotWork": [
    "Underperforming channel or creative bottleneck with rationale",
    "Conversion leak or elevated CPA segment needing restructuring"
  ],
  "topChannels": [
    { "channel": "Channel Name", "trafficShare": "40%", "leadsGenerated": 420, "revenue": "$14,500", "status": "Scaling" },
    { "channel": "Channel Name 2", "trafficShare": "30%", "leadsGenerated": 280, "revenue": "$9,200", "status": "Optimizing" }
  ],
  "conversionOpportunities": [
    "High-impact optimization lever 1",
    "High-impact optimization lever 2"
  ],
  "recommendedActionItems": [
    "Priority 1 tactical task for the next sprint",
    "Priority 2 tactical task for the next sprint",
    "Priority 3 tactical task for the next sprint"
  ],
  "nextMonthStrategy": "Strategic roadmap overview for scaling next cycle."
}`;
}
