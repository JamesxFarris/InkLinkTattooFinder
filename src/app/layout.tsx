import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/auth/SessionProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InkLink Tattoo Finder — Find Tattoo Artists & Shops Near You",
    template: "%s | InkLink Tattoo Finder",
  },
  description:
    "Discover the best tattoo artists and shops in your area. Browse by style, city, and read reviews to find your next tattoo artist.",
  metadataBase: new URL("https://inklinktattoofinder.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "48x48" },
    ],
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "InkLink Tattoo Finder",
  },
  twitter: {
    card: "summary_large_image",
    site: "@InkLinkTattoo",
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
