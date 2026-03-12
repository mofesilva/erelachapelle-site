import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@cappuccino/web-sdk"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cappuccino.dzign-e.app",
      },
      {
        protocol: "https",
        hostname: "cappuccino.devel.dzign-e.app",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
