import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell";
import { SettingsProvider } from "@/components/SettingsProvider";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import "./globals.css";

const outfit = localFont({
  src: "./fonts/outfit.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const bricolage = localFont({
  src: "./fonts/bricolage-grotesque.woff2",
  variable: "--font-heading",
  weight: "200 800",
  display: "swap",
});

const naskh = localFont({
  src: [
    { path: "./fonts/naskh-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/naskh-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/naskh-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/naskh-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sarf Trainer",
  description:
    "Recognize and memorize Arabic sarf patterns — Forms I–X, abwab, and weak verbs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${bricolage.variable} ${naskh.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="sarf-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
        />
        <SettingsProvider>
          <AppShell>{children}</AppShell>
        </SettingsProvider>
      </body>
    </html>
  );
}
