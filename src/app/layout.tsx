import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "InkFinder — Find Tattoo Artists & Shops Near You",
    template: "%s | InkFinder",
  },
  description:
    "Discover the best tattoo artists and shops in your area. Browse by style, city, and read reviews to find your next tattoo artist.",
  metadataBase: new URL("https://inkfinder.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "InkFinder",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
