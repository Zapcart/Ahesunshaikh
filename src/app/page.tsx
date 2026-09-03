import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/layout/Marquee";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Ahesun Shaikh — Gen AI & AI Integration Developer",
  description:
    "High-end interactive portfolio of Mohmmed Ahesun Naushad Shaikh — Gen AI & AI Integration Developer / Full-Stack Engineer in Mumbai. AI voice agents, LLM workflows, Next.js, React, SaaS.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Skills />
      <Journey />
      <Contact />
    </>
  );
}
