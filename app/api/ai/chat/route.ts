import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildAssistantSystemPrompt } from "@/lib/ai/prompts/assistant";

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

    let brand = null;
    try {
      brand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      // Ignore DB read failure
    }

    const systemPrompt = buildAssistantSystemPrompt(brand);

    // Save or retrieve conversation
    let convId = conversationId || `conv-${Date.now()}`;
    let previousMessages: any[] = [];

    try {
      if (!conversationId) {
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

      await db.aIMessage.create({
        data: {
          conversationId: convId,
          role: "user",
          content: message,
        },
      });

      previousMessages = await db.aIMessage.findMany({
        where: { conversationId: convId },
        orderBy: { createdAt: "desc" },
        take: 6,
      });
    } catch (e) {
      // Ignore DB write error
    }

    const conversationHistoryText = previousMessages.length > 0
      ? previousMessages
          .reverse()
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n\n")
      : "";

    const contextualPrompt = conversationHistoryText
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

    let assistantMsg = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      role: "assistant",
      content: aiResponse.content,
      model: aiResponse.model,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedMsg = await db.aIMessage.create({
        data: {
          conversationId: convId,
          role: "assistant",
          content: aiResponse.content,
          model: aiResponse.model,
          tokensUsed: aiResponse.totalTokens,
        },
      });
      assistantMsg = { ...savedMsg, createdAt: savedMsg.createdAt.toISOString() } as any;
    } catch (e) {
      // Ignore DB save failure
    }

    return NextResponse.json({
      conversationId: convId,
      message: assistantMsg,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
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

    try {
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
    } catch (dbErr) {
      return NextResponse.json({ conversations: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ conversations: [] });
  }
}
