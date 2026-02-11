import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreakingTicker from "@/components/BreakingTicker";
import FloatingVideoPlayer from "@/components/FloatingVideoPlayer";
import SkipToContent from "@/components/SkipToContent";
import { VideoPlayerProvider } from "@/contexts/VideoPlayerContext";
import { Toaster } from "sonner";
import { tiroBangla } from "@/lib/fonts";
import { fetchSettings } from "@/lib/actions-settings";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
    title: {
      default: settings.seo_title || settings.site_name || "সমকাল",
      template: `%s | ${settings.site_name || "সমকাল"}`,
    },
    description:
      settings.seo_description || "Samakal - Latest Bengali News and Analysis",
    keywords: settings.seo_keywords?.split(",").map((k) => k.trim()),
    icons: {
      icon: settings.site_favicon || "/favicon.ico",
    },
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchSettings();

  return (
    <VideoPlayerProvider>
      {settings.google_analytics_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.google_analytics_id}');
            `}
          </Script>
        </>
      )}
      <div
        className={`${tiroBangla.variable} font-serif antialiased bg-white dark:bg-white min-h-screen`}
      >
        <Toaster position="top-center" richColors />
        <SkipToContent />
        <Header settings={settings} />
        <BreakingTicker customTicker={settings.breaking_news_ticker} />
        {children}
      </div>
      <FloatingVideoPlayer />
      <Footer settings={settings} />
    </VideoPlayerProvider>
  );
}
