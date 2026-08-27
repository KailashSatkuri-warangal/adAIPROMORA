import { IAIProvider, AIRequestOptions, AIResponse } from "../types";
import { GeminiAIProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { FallbackMarketingAIProvider } from "./fallback";

export class AIProviderFactory {
  private static providers: IAIProvider[] = [];

  private static getProviders(): IAIProvider[] {
    if (this.providers.length === 0) {
      this.providers = [
        new GeminiAIProvider(),
        new OpenAIProvider(),
        new FallbackMarketingAIProvider(),
      ];
    }
    return this.providers;
  }

  public static getPrimaryProvider(): IAIProvider {
    const configuredPref = process.env.AI_ACTIVE_PROVIDER?.toLowerCase();
    const providers = this.getProviders();

    if (configuredPref === "gemini") {
      const gemini = providers.find((p) => p instanceof GeminiAIProvider);
      if (gemini?.isAvailable()) return gemini;
    }

    if (configuredPref === "openai") {
      const openai = providers.find((p) => p instanceof OpenAIProvider);
      if (openai?.isAvailable()) return openai;
    }

    // Auto find available
    for (const provider of providers) {
      if (provider.isAvailable()) {
        return provider;
      }
    }

    return new FallbackMarketingAIProvider();
  }

  public static async executeWithFallback<T>(
    operation: (provider: IAIProvider) => Promise<T>
  ): Promise<T> {
    const providers = this.getProviders();
    const available = providers.filter((p) => p.isAvailable());

    for (const provider of available) {
      try {
        return await operation(provider);
      } catch (err: any) {
        // Graceful non-blocking fallback to adAIPROMORA Domain Intelligence
      }
    }

    // High-performance domain engine
    const fallback = new FallbackMarketingAIProvider();
    return await operation(fallback);
  }
}
