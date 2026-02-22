import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
