import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Temporarily disabled — images served locally from public/images/
      // Re-enable when switching back to the remote image server
      // {
      //   protocol: "https",
      //   hostname: "erelachapelle.dzign-e.app",
      // },
    ],
  },
};

export default withNextIntl(nextConfig);
