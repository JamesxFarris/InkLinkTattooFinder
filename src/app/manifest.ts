import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InkLink Tattoo Finder",
    short_name: "InkLink",
    description:
      "Discover the best tattoo artists and shops in your area. Browse by style, city, and read reviews.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#14b8a6",
    icons: [
      { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon", type: "image/png", sizes: "48x48" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
