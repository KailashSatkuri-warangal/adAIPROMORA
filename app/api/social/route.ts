import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SocialPlatform, ContentStatus } from "@prisma/client";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { safeFirestoreOp } from "@/lib/firestore-db";

const DEFAULT_ACCOUNTS = [
  { platform: SocialPlatform.INSTAGRAM, accountName: "Instagram Official", handle: "@vedaglowindia", followers: 34200, isConnected: true },
  { platform: SocialPlatform.LINKEDIN, accountName: "LinkedIn Company", handle: "VedaGlow Organics India", followers: 8900, isConnected: true },
  { platform: SocialPlatform.X_TWITTER, accountName: "X (Twitter)", handle: "@vedaglowin", followers: 14500, isConnected: true },
  { platform: SocialPlatform.YOUTUBE, accountName: "YouTube Channel", handle: "@vedagloworganics", followers: 52000, isConnected: true },
];

const DEFAULT_POSTS = [
  {
    platform: SocialPlatform.INSTAGRAM,
    caption: "🚨 Is your moisturizer suddenly stinging? Here are 5 undeniable signs your skin barrier is compromised 🌿👇\n\n1. Stinging on application\n2. Chronic flaking\n3. Redness that won't calm down\n4. Sudden breakouts\n5. Rough texture\n\nSwitch to cold-pressed bio-ferments with code VEDA15!",
    hashtags: "#SkinBarrierRepair #AyurvedicSkincare #CleanBeautyIndia #VedaGlow",
    status: ContentStatus.PUBLISHED,
    likes: 1240,
    comments: 184,
    shares: 320,
    impressions: 48500,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    platform: SocialPlatform.LINKEDIN,
    caption: "In cosmetic chemistry, synthetic preservatives are often the hidden cause of contact dermatitis in reactive skin.\n\nWhen formulating VedaGlow, we rejected 42 common chemical stabilizers in favor of cold-pressed Ayurvedic botanicals. A 78% reduction in redness across 5,000+ consumer trials proves clinical efficacy without toxicity.",
    hashtags: "#D2C #Biotech #CleanBeauty #IndianFounders #ProductIntegrity",
    status: ContentStatus.PUBLISHED,
    likes: 420,
    comments: 68,
    shares: 94,
    impressions: 16200,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    platform: SocialPlatform.X_TWITTER,
    caption: "7 Skincare myths debunked by cosmetic chemists in 2026 🧵👇\n\n1/ More steps does NOT equal better skin. Layering 8 harsh actives destroys your acid mantle.\n2/ Synthetic fragrance is the #1 cause of allergic contact dermatitis.\n3/ Pure cold-pressed bio-ferments heal damaged barriers 2x faster.",
    hashtags: "#SkincareThreads #CleanBeauty #Ayurveda",
    status: ContentStatus.SCHEDULED,
    likes: 0,
    comments: 0,
    shares: 0,
    impressions: 0,
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
];

// 1. GET: Fetch all social accounts and posts with automatic seeding
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let accounts = await db.socialAccount.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "asc" },
    });

    if (accounts.length === 0) {
      for (const acc of DEFAULT_ACCOUNTS) {
        await db.socialAccount.create({
          data: {
            workspaceId: user.workspaceId,
            ...acc,
          },
        });
      }
      accounts = await db.socialAccount.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "asc" },
      });
    }

    let posts = await db.socialPost.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    if (posts.length === 0) {
      for (const p of DEFAULT_POSTS) {
        await db.socialPost.create({
          data: {
            workspaceId: user.workspaceId,
            ...p,
          },
        });
      }
      posts = await db.socialPost.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ accounts, posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Create post, Toggle account, or AI Enhance
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // AI ENHANCE CAPTION
    if (action === "ai_enhance") {
      const { prompt, platform } = body;
      const brand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });

      const aiRes = await AIProviderFactory.executeWithFallback(async (provider) => {
        return await provider.generateText({
          prompt: `Enhance this social post caption for ${platform || "Instagram"}: "${prompt}". Make it engaging, include high-converting hook and 4-5 relevant hashtags for Indian clean beauty market.`,
          brandContext: brand,
          feature: "social_post",
          workspaceId: user.workspaceId,
        });
      });

      return NextResponse.json({ enhancedCaption: aiRes.content });
    }

    // TOGGLE ACCOUNT CONNECTION
    if (action === "toggle_account") {
      const { accountId, isConnected } = body;
      const updated = await db.socialAccount.update({
        where: { id: accountId },
        data: { isConnected },
      });
      return NextResponse.json({ account: updated });
    }

    // CREATE NEW SOCIAL POST
    const { platform, caption, hashtags, scheduledFor, status } = body;
    let platformEnum: SocialPlatform = SocialPlatform.INSTAGRAM;
    if (platform === "LINKEDIN") platformEnum = SocialPlatform.LINKEDIN;
    else if (platform === "X_TWITTER" || platform === "TWITTER") platformEnum = SocialPlatform.X_TWITTER;
    else if (platform === "YOUTUBE") platformEnum = SocialPlatform.YOUTUBE;
    else if (platform === "FACEBOOK") platformEnum = SocialPlatform.FACEBOOK;
    else if (platform === "THREADS") platformEnum = SocialPlatform.THREADS;

    const isPublishNow = status === "PUBLISHED" || !scheduledFor;

    const newPost = await db.socialPost.create({
      data: {
        workspaceId: user.workspaceId,
        platform: platformEnum,
        caption,
        hashtags: hashtags || "#CleanBeauty #AyurvedicSkincare #adAIPROMORA",
        status: isPublishNow ? ContentStatus.PUBLISHED : ContentStatus.SCHEDULED,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        publishedAt: isPublishNow ? new Date() : null,
        likes: isPublishNow ? Math.floor(Math.random() * 80) + 20 : 0,
        comments: isPublishNow ? Math.floor(Math.random() * 15) + 3 : 0,
        shares: isPublishNow ? Math.floor(Math.random() * 10) + 1 : 0,
        impressions: isPublishNow ? Math.floor(Math.random() * 1500) + 450 : 0,
      },
    });

    return NextResponse.json({ post: newPost, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT / PATCH: Update post caption, status, or schedule
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, caption, status, scheduledFor, platform } = await req.json();

    const updateData: any = {};
    if (caption !== undefined) updateData.caption = caption;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "PUBLISHED") {
        updateData.publishedAt = new Date();
        updateData.impressions = Math.floor(Math.random() * 800) + 250;
        updateData.likes = Math.floor(Math.random() * 45) + 12;
      }
    }
    if (scheduledFor !== undefined) updateData.scheduledFor = scheduledFor ? new Date(scheduledFor) : null;
    if (platform !== undefined) updateData.platform = platform;

    const updated = await db.socialPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ post: updated, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Delete a social post
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    await db.socialPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
