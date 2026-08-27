import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildAssistantSystemPrompt } from "@/lib/ai/prompts/assistant";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId, contextType, contextId } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check Quota
    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    // Fetch Brand Context
    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const systemPrompt = buildAssistantSystemPrompt(brand);

    // Save or retrieve conversation
    let convId = conversationId;
    if (!convId) {
      const conv = await db.aIConversation.create({
        data: {
          workspaceId: user.workspaceId,
          userId: user.id,
          title: message.slice(0, 45) + "...",
          contextType: contextType || "general",
          contextId,
        },
      });
      convId = conv.id;
    }

    // Save User message
    await db.aIMessage.create({
      data: {
        conversationId: convId,
        role: "user",
        content: message,
      },
    });

    // Fetch last 6 messages for context memory
    const previousMessages = await db.aIMessage.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    const conversationHistoryText = previousMessages
      .reverse()
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const contextualPrompt = previousMessages.length > 1
      ? `Conversation History:\n${conversationHistoryText}\n\nLatest User Request: ${message}`
      : message;

    // Execute AI Generation
    const aiResponse = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateText({
        prompt: contextualPrompt,
        systemPrompt,
        brandContext: brand,
        feature: "assistant",
        workspaceId: user.workspaceId,
      });
    });

    // Save Assistant message
    const assistantMsg = await db.aIMessage.create({
      data: {
        conversationId: convId,
        role: "assistant",
        content: aiResponse.content,
        model: aiResponse.model,
        tokensUsed: aiResponse.totalTokens,
      },
    });

    // Track usage
    await recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "assistant",
      model: aiResponse.model,
      promptTokens: aiResponse.promptTokens,
      completionTokens: aiResponse.completionTokens,
      totalTokens: aiResponse.totalTokens,
    });

    return NextResponse.json({
      conversationId: convId,
      message: assistantMsg,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI marketing request." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await db.aIConversation.findMany({
      where: { workspaceId: user.workspaceId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
