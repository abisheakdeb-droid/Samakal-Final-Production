import type { Metadata } from "next";
import { Tiro_Bangla } from "next/font/google";
import "./globals.css";

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
  variable: "--font-tiro-bangla",
});

export const metadata: Metadata = {
  title: "সমকাল | আপোষহীন সংবাদ",
  description: "বাংলাদেশের অন্যতম সেরা নিউজ পোর্টাল",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${tiroBangla.variable} font-serif antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
