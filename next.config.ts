import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // /:state/:city/:category → /tattoo-shops/:state/:city/style/:category
      {
        source:
          "/:state((?!tattoo-shops|listing|categories|search|about|contact|privacy|login|register|list-your-shop|dashboard|admin|api|_next)[a-z0-9-]+)/:city/:category",
        destination: "/tattoo-shops/:state/:city/style/:category",
        permanent: true,
      },
      // /:state/:city → /tattoo-shops/:state/:city
      {
        source:
          "/:state((?!tattoo-shops|listing|categories|search|about|contact|privacy|login|register|list-your-shop|dashboard|admin|api|_next)[a-z0-9-]+)/:city",
        destination: "/tattoo-shops/:state/:city",
        permanent: true,
      },
      // /:state → /tattoo-shops/:state
      {
        source:
          "/:state((?!tattoo-shops|listing|categories|search|about|contact|privacy|login|register|list-your-shop|dashboard|admin|api|_next)[a-z0-9-]+)",
        destination: "/tattoo-shops/:state",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
