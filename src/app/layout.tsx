import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/auth/SessionProvider";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

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
    url: "/",
    siteName: "InkLink Tattoo Finder",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "InkLink Tattoo Finder — Find Tattoo Artists & Shops Near You",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@InkLinkTattoo",
    images: ["/opengraph-image"],
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
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', {
  allow_enhanced_conversions: true,
  link_attribution: true
});${GOOGLE_ADS_ID ? `\ngtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });` : ""}`}
            </Script>
          </>
        )}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="DDuYLpll8VzMdUzVsBDFyw"
          strategy="afterInteractive"
        />
      </head>
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
