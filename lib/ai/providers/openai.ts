import { AIRequestOptions, AIResponse, IAIProvider } from "../types";

export class OpenAIProvider implements IAIProvider {
  name = "OpenAI GPT Provider";
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
    this.model = model;
  }

  isAvailable(): boolean {
    return (
      !!this.apiKey &&
      this.apiKey.startsWith("sk-") &&
      !this.apiKey.includes("proj-F9DwRbey") &&
      this.apiKey.length >= 35
    );
  }

  private buildSystemInstruction(options: AIRequestOptions): string {
    const brand = options.brandContext;
    let base = options.systemPrompt || "You are an elite AI digital marketing strategist and copywriter.";
    if (brand) {
      base += `\n\nActive Brand Context:\n- Name: ${brand.name}\n- Industry: ${brand.industry || "General"}\n- Voice: ${brand.voice || "Professional"}\n- Tone: ${brand.tone || "Engaging"}\n- USP: ${brand.uniqueSellingProp || "Not specified"}\n- Persona: ${brand.targetPersona || "General Audience"}`;
    }
    return base;
  }

  async generateText(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error("OpenAI API key is not configured or active.");
    }

    const systemInstruction = this.buildSystemInstruction(options);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: options.prompt },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const promptTokens = data.usage?.prompt_tokens || Math.round(options.prompt.length / 4);
    const completionTokens = data.usage?.completion_tokens || Math.round(content.length / 4);

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
    const jsonPrompt = `${options.prompt}\n\nReturn strictly a valid JSON object matching the requested schema. Do not enclose in backticks or markdown fences.`;
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
      throw new Error("Failed to parse OpenAI JSON response.");
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
