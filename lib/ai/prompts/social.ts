import { BrandContext } from "../types";

export interface SocialGeneratorInput {
  topic: string;
  platforms?: string[];
  tone?: string;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  callToAction?: string;
  brandContext?: BrandContext | null;
}

export function buildSocialPrompt(input: SocialGeneratorInput): string {
  return `Generate high-converting, platform-tailored social media posts for:
Topic: "${input.topic}"
Tone: "${input.tone || "Engaging & Professional"}"
${input.callToAction ? `Call to Action: "${input.callToAction}"` : ""}
Include Emojis: ${input.includeEmojis !== false ? "Yes" : "No"}
Include Hashtags: ${input.includeHashtags !== false ? "Yes" : "No"}

Return a JSON object matching this schema:
{
  "platforms": {
    "instagram": "Catchy visual caption with line breaks and emoji bullet points",
    "linkedin": "Thought-leadership style post with strong opening hook and professional takeaways",
    "x_twitter": "Engaging punchy post or thread starter under 280 characters",
    "facebook": "Community-focused post with conversational tone and clear link prompt",
    "threads": "Casual, discussion-sparking short post",
    "youtube_community": "Community announcement post with question poll prompt"
  },
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
  "recommendedTimes": ["Tuesday at 10:00 AM", "Thursday at 2:30 PM", "Sunday at 6:00 PM"]
}`;
}
