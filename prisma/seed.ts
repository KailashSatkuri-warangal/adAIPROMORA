import { PrismaClient, Role, PlanTier, ContentStatus, SocialPlatform } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding adAIPROMORA database with Indian & Global demo ecosystem (Developed by Satkuri Kailash)...");

  // Clean existing data for idempotent seeding
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.automationLog.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.aIUsage.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.emailCampaign.deleteMany();
  await prisma.contactSegment.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.sEOAudit.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.socialPost.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.contentCalendarItem.deleteMany();
  await prisma.contentVersion.deleteMany();
  await prisma.content.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.project.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const passwordHash = await bcrypt.hash("password123", 10);
  const primaryUser = await prisma.user.create({
    data: {
      name: "Satkuri Kailash",
      email: "kailash@aipromora.in",
      passwordHash,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Satkuri Kailash (Demo)",
      email: "demo@omnimarket.ai",
      passwordHash,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "AIPROMORA Labs India",
      slug: "aipromora-india",
      members: {
        create: [
          {
            userId: primaryUser.id,
            role: Role.OWNER,
          },
          {
            userId: demoUser.id,
            role: Role.ADMIN,
          },
        ],
      },
      subscription: {
        create: {
          plan: PlanTier.PRO,
          status: "active",
          monthlyGenerationsLimit: 1000,
          generationsUsed: 148,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  // 3. Create Brand
  const brand = await prisma.brand.create({
    data: {
      workspaceId: workspace.id,
      name: "VedaGlow Organics India",
      website: "https://vedaglow.in",
      industry: "Ayurvedic & Clean Skincare / D2C Beauty",
      businessType: "D2C & B2B Premium Retail",
      tagline: "Pure Ayurvedic Botanicals. Clinically Proven Radiance.",
      description:
        "VedaGlow Organics India crafts cold-pressed Ayurvedic botanicals and barrier repair formulations engineered for sensitive Indian skin types with zero synthetic toxins or fillers.",
      targetAudience:
        "Health-conscious millennial and Gen-Z consumers (ages 22-45) across tier-1 & tier-2 Indian cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad) and international wellness clinics.",
      targetPersona:
        "Pooja (29), tech product lead in Bengaluru. Experiences barrier sensitivity from city pollution and screen heat. Values clean Ayurvedic transparency, cruelty-free certifications, and sustainable packaging.",
      uniqueSellingProp:
        "100% cold-pressed Ayurvedic botanicals with independent clinical trials demonstrating 78% redness reduction within 14 days.",
      voice: "Inspiring, Authoritative, Empathetic, and Scientifically Rigorous",
      tone: "Warm, Empowering, Educational, and Transparent",
      preferredLanguage: "en-IN",
      colorsJson: JSON.stringify({
        primary: "#0F766E", // Emerald Teal
        secondary: "#D97706", // Warm Amber
        accent: "#F43F5E", // Vibrant Rose
        neutral: "#1E293B", // Deep Slate
        surface: "#F8FAFC", // Pure Light
      }),
      fontsJson: JSON.stringify({
        heading: "Plus Jakarta Sans",
        body: "Inter",
      }),
      guidelines:
        "Always highlight clinical Ayurvedic efficacy while celebrating heritage. Never use aggressive fear-mongering language. Include clear CTAs to free skin analysis quiz.",
    },
  });

  // 4. Create Project & Campaigns
  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: "2026 Pan-India & Global Expansion",
      description: "Scaling customer acquisition across SEO in India, Meta Ads, LinkedIn B2B, and automated lifecycle email sequences.",
      status: "active",
    },
  });

  const campaign1 = await prisma.campaign.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      brandId: brand.id,
      name: "Festive Glow 2026 Barrier Serum Launch",
      objective: "Direct Sales & D2C Customer Acquisition across India",
      status: "active",
      budget: 500000,
      spent: 124000,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      channelsJson: JSON.stringify(["META_ADS", "GOOGLE_ADS", "EMAIL", "SOCIAL", "SEO"]),
      targetAudience: "Urban Indian professionals experiencing seasonal pollution dryness & sensitive skin",
      strategyOverview:
        "Multi-touch funnel: Top-of-funnel Instagram & Meta UGC video hooks -> SEO informational pillar post -> Retargeting Meta carousel -> 4-part abandoned checkout email workflow with 15% first-order discount code 'VEDA15'.",
      messagingPillarsJson: JSON.stringify([
        "Restore damaged skin barrier in 14 days with cold-pressed Ayurvedic lipids",
        "Clinical proof: 78% redness reduction verified by independent dermatologists",
        "100% biodegradable glass apothecary packaging crafted in India",
      ]),
      kpisJson: JSON.stringify({
        targetCAC: 450,
        targetROAS: 4.5,
        targetRevenue: 2500000,
        targetEmailOpenRate: 46,
      }),
      metricsJson: JSON.stringify({
        impressions: 482000,
        clicks: 18450,
        leads: 1820,
        conversions: 540,
        revenue: 615000,
        roas: 4.96,
      }),
    },
  });

  // 5. Create Blog Content
  const contentBlog = await prisma.content.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      campaignId: campaign1.id,
      brandId: brand.id,
      title: "The Definitive Guide to Skin Barrier Repair in India: Ingredients, Routine & Clinical Insights",
      type: "blog",
      status: ContentStatus.PUBLISHED,
      currentVersion: 2,
      primaryKeyword: "ayurvedic skin barrier repair serum india",
      secondaryKeywordsJson: JSON.stringify(["ceramides for sensitive skin", "redness relief routine india", "clean botanical beauty bengaluru"]),
      seoScore: 96,
      readabilityScore: 90,
      summary: "A deep dive into lipid restoration, microbiome balance, and cold-pressed Ayurvedic bio-ferments for rapid skin recovery.",
      body: `# The Definitive Guide to Skin Barrier Repair in India

If your skin feels persistently tight after commuting, stings when applying basic moisturizers, or experiences sudden breakouts alongside flaking in Indian city weather, your stratum corneum is likely compromised.

In this dermatological guide by VedaGlow Organics India (adAIPROMORA), we break down the biochemistry of lipid repair and share a 14-day protocol to restore radiant equilibrium.

---

## 1. Why Urban Indian Skin Faces Barrier Damage
High humidity combined with particulate pollution (PM2.5) strips essential ceramides:
- **Pollution Oxidation:** Free radicals break down skin elasticity.
- **Over-Exfoliation:** Harsh chemical scrubs deplete natural moisture lipids.
- **Synthetic Fragrance Sensitization:** Artificial perfumes cause contact dermatitis.

---

## 2. The 3-Pillar Ayurvedic Restoration Protocol
1. **Biomimetic Lipid Replenishment:** 3:1:1 ratio of phytoceramides and omega fatty acids.
2. **Soothing Oat Beta-Glucan & Gotu Kola (Centella):** Calms visible erythema and redness by 78% in clinical trials.
3. **Non-Comedogenic Moisture Lock:** Cold-pressed bio-ferments sealing hydration for 24 hours.`,
      metadataJson: JSON.stringify({ tags: ["Skincare", "Ayurveda", "Barrier Repair", "D2C India"] }),
    },
  });

  // 6. Create Visual Calendar items
  const now = new Date();
  const calendarDates = [
    { offset: 1, platform: SocialPlatform.INSTAGRAM, status: ContentStatus.SCHEDULED, title: "Reel: How Indian weather affects your skin barrier" },
    { offset: 3, platform: SocialPlatform.LINKEDIN, status: SocialPlatform.LINKEDIN ? ContentStatus.SCHEDULED : ContentStatus.IDEA, title: "Founder Post: Building clean beauty manufacturing in Bengaluru" },
    { offset: 5, platform: SocialPlatform.INSTAGRAM, status: ContentStatus.APPROVED, title: "Carousel: 5 Signs your barrier is screaming for help" },
    { offset: 8, platform: SocialPlatform.FACEBOOK, status: ContentStatus.REVIEW, title: "Customer Story: Pooja's 14-day redness transformation" },
    { offset: 12, platform: SocialPlatform.YOUTUBE, status: ContentStatus.IDEA, title: "Video: Full Morning & Evening Barrier Repair Tutorial" },
  ];

  for (const item of calendarDates) {
    const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + item.offset, 14, 0, 0);
    await prisma.contentCalendarItem.create({
      data: {
        workspaceId: workspace.id,
        campaignId: campaign1.id,
        title: item.title,
        platform: item.platform,
        contentType: "social_post",
        status: item.status,
        scheduledDate,
        assignedUser: "Satkuri Kailash",
      },
    });
  }

  // 7. Tracked Keywords in India
  const keywords = [
    { term: "ayurvedic skin barrier repair serum india", intent: "Commercial", difficulty: 38, estimatedVolume: 24200, cpc: 28.5, category: "Product Search" },
    { term: "best natural ceramide moisturizer india", intent: "Commercial", difficulty: 42, estimatedVolume: 18400, cpc: 32.1, category: "Product Search" },
    { term: "how to heal damaged skin barrier", intent: "Informational", difficulty: 32, estimatedVolume: 45000, cpc: 14.5, category: "Guides" },
    { term: "clean beauty brands bengaluru", intent: "Transactional", difficulty: 25, estimatedVolume: 9200, cpc: 24.0, category: "Local Brand" },
    { term: "fragrance free moisturizer for sensitive skin india", intent: "Transactional", difficulty: 36, estimatedVolume: 16500, cpc: 30.2, category: "Product Search" },
  ];

  for (const kw of keywords) {
    await prisma.keyword.create({
      data: {
        workspaceId: workspace.id,
        ...kw,
        isAiEstimate: true,
      },
    });
  }

  // 8. Competitors in Indian Market
  await prisma.competitor.create({
    data: {
      workspaceId: workspace.id,
      name: "DermaPure India",
      domain: "dermapure.in",
      summary: "Clinical pharmaceutical barrier brand sold across pharmacies and clinics in Mumbai and Delhi.",
      strengthsJson: JSON.stringify([
        "High medical trust with dermatologist prescription presence",
        "Strong distribution across 8,000+ retail pharmacies",
      ]),
      weaknessesJson: JSON.stringify([
        "Sterile clinical branding with zero Ayurvedic or natural ingredients",
        "Heavy use of synthetic preservatives and non-recyclable plastic packaging",
      ]),
      seoOpportunitiesJson: JSON.stringify([
        "Capture 'eco-friendly Ayurvedic barrier cream' and 'plant ceramide serum india'",
      ]),
      battlecardJson: JSON.stringify({
        keyDifferentiator: "Same dermatological efficacy with 100% Ayurvedic plant botanicals and biodegradable glass.",
      }),
    },
  });

  // 9. Contacts
  const contacts = [
    { email: "pooja.sharma@techfirm.in", firstName: "Pooja", lastName: "Sharma", company: "TechFirm Bengaluru", tagsJson: JSON.stringify(["VIP", "Repeat Buyer", "Sensitive Skin"]) },
    { email: "rohit.verma@mumbaiwellness.in", firstName: "Rohit", lastName: "Verma", company: "Mumbai Wellness", tagsJson: JSON.stringify(["High Intent", "Quiz Completed"]) },
    { email: "ananya.r@delhiclinic.com", firstName: "Ananya", lastName: "Reddy", company: "Aesthetic Spa Delhi", tagsJson: JSON.stringify(["B2B Wholesale"]) },
  ];

  for (const c of contacts) {
    await prisma.contact.create({
      data: {
        workspaceId: workspace.id,
        ...c,
      },
    });
  }

  // 10. Email Campaign
  await prisma.emailCampaign.create({
    data: {
      workspaceId: workspace.id,
      campaignId: campaign1.id,
      name: "Festive Season VIP 15% Launch Drop",
      subject: "🌿 Pooja, restore your damaged skin barrier in 14 days (VIP 15% inside)",
      previewText: "Clinically proven redness relief with zero synthetic perfumes.",
      bodyHtml: "<p>Hello Pooja,</p><p>Experience pure Ayurvedic botanicals with 15% off using code <strong>VEDA15</strong>.</p>",
      status: "SENT",
      recipientsCount: 4850,
      openRate: 48.6,
      clickRate: 15.4,
      bounceRate: 0.4,
      sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  // 11. 30-Day Analytics Snapshots
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const baseVisitors = 1200 + Math.floor(Math.sin(i / 3) * 300) + Math.floor(Math.random() * 150);
    const leads = Math.floor(baseVisitors * 0.08);
    const conversions = Math.floor(leads * 0.28);
    const revenue = conversions * 1450;
    const adSpend = Math.floor(revenue / 4.2);

    await prisma.analyticsSnapshot.create({
      data: {
        workspaceId: workspace.id,
        date: d,
        visitors: baseVisitors,
        leads,
        conversions,
        revenue,
        adSpend,
        channelBreakdownJson: JSON.stringify({
          metaAds: Math.floor(revenue * 0.45),
          googleSearch: Math.floor(revenue * 0.32),
          emailLifecycle: Math.floor(revenue * 0.15),
          directReferral: Math.floor(revenue * 0.08),
        }),
      },
    });
  }

  // 12. Automation Rules
  await prisma.automationRule.create({
    data: {
      workspaceId: workspace.id,
      name: "Auto-Generate Social Bundle from Published Blog",
      triggerEvent: "blog.published",
      description: "When an SEO blog post is published, automatically generate tailored posts for Instagram, LinkedIn, and Email newsletter.",
      actionsJson: JSON.stringify([
        { action: "generate_social_posts", platforms: ["INSTAGRAM", "LINKEDIN", "X_TWITTER"] },
        { action: "draft_newsletter_email", template: "blog_announcement" },
      ]),
      isActive: true,
      executionCount: 14,
      lastRunAt: new Date(),
    },
  });

  // 13. AI Conversation
  const conversation = await prisma.aIConversation.create({
    data: {
      workspaceId: workspace.id,
      userId: primaryUser.id,
      title: "Festive Campaign Scaling Strategy (adAIPROMORA)",
      contextType: "campaign",
      contextId: campaign1.id,
    },
  });

  await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: "What are the top 3 tactical improvements we can make to our Festive Glow 2026 Barrier Serum Launch in India to hit our ₹25,00,000 revenue target?",
    },
  });

  await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      model: "adAIPROMORA-domain-v1 (by Satkuri Kailash)",
      content: `Based on **VedaGlow Organics India's** active campaign telemetry and brand profile, here are the **top 3 high-impact levers** to achieve ₹25,00,000 revenue:

### 1. Deploy Retargeting Carousels with Clinical Proof (Est. Revenue: +₹7,45,000)
- Current top-of-funnel traffic is strong (18.4k clicks at 4.96 ROAS across Meta India), but 91% of visitors leave on first touch.
- **Action:** Launch a dedicated retargeting ad group with a 3-slide visual carousel:
  1. *Slide 1:* 14-day redness reduction data (78% clinical proof).
  2. *Slide 2:* Dermatologist quote with clean Ayurvedic ingredients breakdown.
  3. *Slide 3:* 15% launch privilege coupon code: \`VEDA15\`.

### 2. High-Intent Quiz Abandonment WhatsApp & Email Flow (Est. Revenue: +₹5,20,000)
- Over 1,820 leads completed the Skin Diagnostic Quiz across Bengaluru, Mumbai, and Delhi.
- **Action:** Trigger a 3-part sequence within 2 hours of quiz completion offering customized skin routine kits.

### 3. SEO Content Interlinking Sprint for High-Intent Indian Keywords (Est. Revenue: +₹6,80,000)
- Your published guide *"The Definitive Guide to Skin Barrier Repair in India"* has an SEO score of **96/100** ranking #1 on Google India.
- **Action:** Insert a high-contrast sticky product banner inside Section 2 offering fast pan-India shipping.

Would you like me to auto-generate the exact 3-part email sequence or generate 5 new Meta Ad variations for these retargeting audiences?`,
    },
  });

  console.log("✅ Seed completed successfully! Lead Developer: Satkuri Kailash (kailash@aipromora.in / password123)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
