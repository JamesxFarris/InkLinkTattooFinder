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
    // Keep in sync with ALLOWED_IMAGE_HOSTS in src/lib/validation.ts
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "streetviewpixels-pa.googleapis.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
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
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap-index",
      },
    ];
  },
  async redirects() {
    // Every top-level route must be listed here, or the legacy /:state redirects
    // below will 308 it to /tattoo-shops/:page (this broke /blog, then the auth pages).
    const reservedTopLevel = [
      "tattoo-shops",
      "listing",
      "categories",
      "search",
      "about",
      "contact",
      "privacy",
      "terms",
      "dmca",
      "styles",
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "verify-email",
      "list-your-shop",
      "for-shop-owners",
      "tattoo-products",
      "dashboard",
      "admin",
      "api",
      "_next",
      "sitemap",
      "opengraph-image",
      "icon",
      "apple-icon",
      "favicon",
      "blog",
    ];
    const notReserved = `(?!${reservedTopLevel.join("|")})[a-z0-9-]+`;
    return [
      // /:state/:city/:category → /tattoo-shops/:state/:city/style/:category
      {
        source: `/:state(${notReserved})/:city/:category`,
        destination: "/tattoo-shops/:state/:city/style/:category",
        permanent: true,
      },
      // /:state/:city → /tattoo-shops/:state/:city
      {
        source: `/:state(${notReserved})/:city`,
        destination: "/tattoo-shops/:state/:city",
        permanent: true,
      },
      // /:state → /tattoo-shops/:state
      {
        source: `/:state(${notReserved})`,
        destination: "/tattoo-shops/:state",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
