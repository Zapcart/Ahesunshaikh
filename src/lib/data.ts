import raw from "./data.json";

/** Lightweight structural types derived from the single source JSON. */
export type SkillItem = { name: string; tag: string; level: number };
export type SkillGroup = { id: string; label: string; index: string; accent: string; items: SkillItem[] };

export type ArchitectureStep = {
  step: string;
  title: string;
  desc: string;
  tech: string[];
};

export type Project = {
  id: string;
  name: string;
  category: string;
  url: string;
  year: string;
  role: string;
  index: string;
  stack: string[];
  features: string[];
  description: string;
  stats: { label: string; value: string }[];
  theme: { base: string; from: string; to: string };
  architecture?: ArchitectureStep[];
};

export type JourneyItem = {
  type: "experience" | "education";
  period: string;
  title: string;
  org: string;
  location: string;
  current: boolean;
  accent: string;
  points: string[];
};

export type Social = {
  label: string;
  handle: string;
  url: string;
  short: string;
};

const data = raw;

export const meta = data.meta;
export const summary = data.summary;
export const highlights = data.highlights;
export const skills = data.skills;
export const projects = data.projects;
export const journey = data.journey;
export const contact = data.contact;
export const marquee = data.marquee;
export const footer = data.footer;

export type Data = typeof data;

export default data;
