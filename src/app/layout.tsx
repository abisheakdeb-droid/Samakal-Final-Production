import type { Metadata, Viewport } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import NextTopLoader from "nextjs-toploader";

const notoSerifBengali = Noto_Serif_Bengali({
  weight: ["400", "700"],
  subsets: ["bengali"],
  variable: "--font-noto-serif-bengali",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "সমকাল | অসংকোচ প্রকাশের দুরন্ত সাহস",
    template: "%s | সমকাল",
  },
  description:
    "সমকাল - বাংলাদেশের অন্যতম জনপ্রিয় বাংলা নিউজ পোর্টাল। সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা, এবং বিনোদনের আপডেট জানুন।",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com",
    siteName: "সমকাল",
    title: "সমকাল | অসংকোচ প্রকাশের দুরন্ত সাহস",
    description:
      "অসংকোচ প্রকাশের দুরন্ত সাহস - বাংলাদেশের অন্যতম সেরা নিউজ পোর্টাল",
    images: [
      {
        url: "/samakal-logo.png",
        width: 1200,
        height: 630,
        alt: "Samakal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "সমকাল | অসংকোচ প্রকাশের দুরন্ত সাহস",
    images: ["/samakal-logo.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "সমকাল",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

import { GoogleAnalytics } from "@next/third-parties/google";
import TrafficTracker from "@/components/TrafficTracker";
import ThemeProvider from "@/components/ThemeProvider";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${notoSerifBengali.variable} font-serif antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <Providers>
            <NextTopLoader
              color="#f59e0b"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #f59e0b,0 0 5px #f59e0b"
            />
            <ServiceWorkerRegistration />
            <TrafficTracker />
            {children}
            <InstallPrompt />
            <GoogleAnalytics
              gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
