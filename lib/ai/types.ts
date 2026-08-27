export interface BrandContext {
  name: string;
  industry?: string | null;
  businessType?: string | null;
  tagline?: string | null;
  description?: string | null;
  targetAudience?: string | null;
  targetPersona?: string | null;
  uniqueSellingProp?: string | null;
  voice?: string | null;
  tone?: string | null;
  guidelines?: string | null;
  website?: string | null;
  logoUrl?: string | null;
}

export interface AIRequestOptions {
  prompt: string;
  systemPrompt?: string;
  brandContext?: BrandContext | null;
  feature?: string;
  workspaceId?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  model?: string;
}

export interface AIResponse {
  content: string;
  structuredData?: any;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
  provider: string;
}

export interface IAIProvider {
  name: string;
  isAvailable(): boolean;
  generateText(options: AIRequestOptions): Promise<AIResponse>;
  generateJSON<T>(options: AIRequestOptions): Promise<{ data: T; usage: AIResponse }>;
  generateStream(options: AIRequestOptions): Promise<ReadableStream<Uint8Array>>;
}
