import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Inclui o host real configurado em NEXT_PUBLIC_API_URL (localhost, IP da rede local pra
// testar em celular, ou domínio de produção) — evita hardcodar um host fixo que quebra
// assim que o valor da env muda.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://images.unsplash.com https://img.youtube.com ${apiUrl} https://api.erelachapelle.fr`,
      "font-src 'self'",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://open.spotify.com",
      `connect-src 'self' ${apiUrl} https://api.erelachapelle.fr`,
      "media-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
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
