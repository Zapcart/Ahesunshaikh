import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { meta } from "@/lib/data";
import SmoothScroll from "@/components/ux/SmoothScroll";
import CustomCursor from "@/components/ux/CustomCursor";
import Preloader from "@/components/ux/Preloader";
import Grain from "@/components/ux/Grain";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeStage from "@/components/ux/ThemeStage";
import BackgroundCanvas from "@/components/ux/BackgroundCanvas";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

const serif = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: false,
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${meta.firstName} ${meta.shortName} Shaikh — ${meta.role}`,
  description:
    "Portfolio of Mohmmed Ahesun Naushad Shaikh — Gen AI & AI Integration Developer / Full-Stack Engineer building AI voice agents, LLM workflows, WhatsApp automation and SaaS platforms with Next.js 14, React 19 and TypeScript.",
  keywords: [
    "Gen AI Developer",
    "AI Integration Developer",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "LLM Workflows",
    "AI Voice Agents",
    "WhatsApp Automation",
    "TypeScript",
    "Mumbai Developer",
    "TalkOps",
    "Ahesun Shaikh",
  ],
  openGraph: {
    title: `${meta.name} — ${meta.role}`,
    description:
      "Gen AI & AI Integration Developer / Full-Stack Engineer. AI voice agents, LLM workflows, WhatsApp automation and production SaaS.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body data-theme="charcoal">
        <Grain />
        <CustomCursor />
        <SmoothScroll>
          <ThemeStage />
          <BackgroundCanvas />
          <Preloader />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
