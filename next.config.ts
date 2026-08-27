import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/content", destination: "/dashboard/content", permanent: false },
      { source: "/assistant", destination: "/dashboard/assistant", permanent: false },
      { source: "/seo", destination: "/dashboard/seo", permanent: false },
      { source: "/seo/optimizer", destination: "/dashboard/seo/optimizer", permanent: false },
      { source: "/competitors", destination: "/dashboard/competitors", permanent: false },
      { source: "/calendar", destination: "/dashboard/calendar", permanent: false },
      { source: "/campaigns", destination: "/dashboard/campaigns", permanent: false },
      { source: "/email", destination: "/dashboard/email", permanent: false },
      { source: "/ads", destination: "/dashboard/ads", permanent: false },
      { source: "/landing-page", destination: "/dashboard/landing-page", permanent: false },
      { source: "/analytics", destination: "/dashboard/analytics", permanent: false },
      { source: "/reports", destination: "/dashboard/reports", permanent: false },
      { source: "/brand", destination: "/dashboard/brand", permanent: false },
      { source: "/automation", destination: "/dashboard/automation", permanent: false },
      { source: "/integrations", destination: "/dashboard/integrations", permanent: false },
      { source: "/settings", destination: "/dashboard/settings", permanent: false },
      { source: "/social", destination: "/dashboard/social", permanent: false },
      { source: "/transactions", destination: "/dashboard/transactions", permanent: false },
      { source: "/billing", destination: "/dashboard/transactions", permanent: false },
    ];
  },
};

export default nextConfig;
