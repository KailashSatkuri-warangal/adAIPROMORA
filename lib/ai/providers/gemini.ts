import { AIRequestOptions, AIResponse, IAIProvider } from "../types";

export class GeminiAIProvider implements IAIProvider {
  name = "Google Gemini Provider";
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model = "gemini-1.5-flash-latest") {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.model = model;
  }

  isAvailable(): boolean {
    // Only attempt real Gemini calls if a genuine valid Google API key is provided
    return (
      !!this.apiKey &&
      this.apiKey.startsWith("AIzaSy") &&
      this.apiKey.length >= 30
    );
  }

  private buildSystemInstruction(options: AIRequestOptions): string {
    const brand = options.brandContext;
    let base = options.systemPrompt || "You are an elite AI digital marketing strategist and copywriter.";
    if (brand) {
      base += `\n\nActive Brand Context:\n- Name: ${brand.name}\n- Industry: ${brand.industry || "General"}\n- Business Type: ${brand.businessType || "B2B/B2C"}\n- Voice: ${brand.voice || "Professional"}\n- Tone: ${brand.tone || "Engaging"}\n- USP: ${brand.uniqueSellingProp || "Not specified"}\n- Target Persona: ${brand.targetPersona || "General Audience"}\n- Guidelines: ${brand.guidelines || "Adhere to high quality marketing best practices."}`;
    }
    return base;
  }

  async generateText(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error("Gemini API key is not configured.");
    }

    const systemInstruction = this.buildSystemInstruction(options);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: options.prompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const promptTokens = data.usageMetadata?.promptTokenCount || Math.round(options.prompt.length / 4);
    const completionTokens = data.usageMetadata?.candidatesTokenCount || Math.round(content.length / 4);

    return {
      content,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      model: this.model,
      provider: this.name,
    };
  }

  async generateJSON<T>(options: AIRequestOptions): Promise<{ data: T; usage: AIResponse }> {
    const jsonPrompt = `${options.prompt}\n\nCRITICAL: Respond ONLY with a valid JSON object matching the requested schema. Do not enclose in markdown ticks if possible, or return strictly valid parseable JSON.`;
    const textRes = await this.generateText({ ...options, prompt: jsonPrompt });

    let raw = textRes.content.trim();
    if (raw.startsWith("```json")) {
      raw = raw.slice(7);
    } else if (raw.startsWith("```")) {
      raw = raw.slice(3);
    }
    if (raw.endsWith("```")) {
      raw = raw.slice(0, -3);
    }
    raw = raw.trim();

    try {
      const parsed = JSON.parse(raw);
      return { data: parsed, usage: textRes };
    } catch (e) {
      throw new Error("Failed to parse Gemini response as JSON: " + raw.slice(0, 100));
    }
  }

  async generateStream(options: AIRequestOptions): Promise<ReadableStream<Uint8Array>> {
    const textRes = await this.generateText(options);
    const encoder = new TextEncoder();
    const chunks = textRes.content.split(" ");

    let index = 0;
    return new ReadableStream({
      async start(controller) {
        const interval = setInterval(() => {
          if (index < chunks.length) {
            const chunk = (index === 0 ? "" : " ") + chunks[index];
            controller.enqueue(encoder.encode(chunk));
            index++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 20);
      },
    });
  }
}
