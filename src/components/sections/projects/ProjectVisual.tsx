"use client";

import { memo, type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * ProjectVisual — abstract generative "UI" for the flagship project used
 * as the full-bleed card artwork. TalkOps renders a noir "live console" —
 * cream linework on charcoal-ink panels with crimson live indicators —
 * plus a system pipeline strip (AI Voice → WhatsApp → Payments → Analytics).
 * No image assets required.
 */
function ProjectVisual({ project }: { project: Project }) {
  const base = project.theme.base;
  const accent = project.theme.base;

  return (
    <div
      className="pointer-events-none relative flex h-full w-full items-center justify-center"
      aria-hidden
    >
      {/* ambient gradient per project — crimson ink bleeding into charcoal */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 20% 0%, ${project.theme.from} 0%, ${project.theme.to} 100%)`,
        }}
      />
      {/* cream halftone dot grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(rgba(244,241,234,0.12) 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* crimson bloom behind the console */}
      <div
        className="absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{ background: base, opacity: 0.14 }}
      />

      <TalkOpsVisual accent={accent} />
    </div>
  );
}

function Frame({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative rounded-[3px] border-2 border-cream/12 bg-[#0b0b0f]/80 shadow-[6px_6px_0_0_rgba(200,35,35,0.22)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function TalkOpsVisual({ accent }: { accent: string }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-6 sm:p-10">
      {/* main voice console */}
      <Frame className="w-full max-w-3xl">
        {/* header — comic status dots + live badge */}
        <div className="flex items-center justify-between border-b-2 border-cream/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-crimson shadow-[0_0_10px_rgba(200,35,35,0.8)]" />
            <span className="h-2.5 w-2.5 rounded-full border-2 border-cream/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream/25" />
          </div>
          <p className="font-sans text-[11px] uppercase tracking-mega text-cream/55">
            TalkOps · Live Call
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-crimson/40 bg-crimson/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream/85">
            <span
              className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-crimson text-crimson"
              aria-hidden
            />
            Gen AI
          </span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-3">
            {/* waveform — cream bars with crimson live spikes */}
            <div className="flex h-14 items-end gap-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-1 origin-bottom rounded-full will-change-transform"
                  style={{
                    background: i % 8 === 3 ? accent : "rgba(244,241,234,0.7)",
                    opacity: i % 8 === 3 ? 0.95 : 0.55,
                    height: 6,
                  }}
                  animate={{ scaleY: [1, 3 + Math.random() * 7, 1] }}
                  transition={{
                    duration: 1.2 + Math.random() * 1.4,
                    repeat: Infinity,
                    delay: Math.random() * 1.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-mega text-cream/55">
              <span
                className="pulse-dot inline-block h-2 w-2 rounded-full bg-crimson text-crimson"
                aria-hidden
              />
              AI Agent Speaking · Lead: Qualified
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: "Call time", v: "04:12" },
              { k: "Sentiment", v: "+82" },
              { k: "Intent", v: "High" },
              { k: "Source", v: "WhatsApp" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-[3px] border-2 border-cream/12 bg-cream/[0.03] p-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-cream/45">{s.k}</p>
                <p className="mt-1 font-serif text-lg font-bold italic text-cream">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Frame>

      {/* pipeline strip — system architecture at a glance */}
      <Frame className="w-full max-w-3xl">
        <div className="flex items-center justify-between border-b-2 border-cream/10 px-5 py-2.5">
          <p className="font-sans text-[10px] uppercase tracking-mega text-cream/50">
            Pipeline · LLM → WhatsApp → Payments → Analytics
          </p>
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-crimson shadow-[0_0_8px_rgba(200,35,35,0.8)]"
            aria-hidden
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-4">
          {[
            { icon: "◉", k: "AI Voice", v: "LLM agents" },
            { icon: "⬡", k: "MSG91", v: "1000+ / day" },
            { icon: "▲", k: "Razorpay", v: "Billing" },
            { icon: "▤", k: "Analytics", v: "Firebase · DB" },
          ].map((s) => (
            <div
              key={s.k}
              className="flex items-center gap-3 rounded-[3px] border-2 border-cream/12 bg-cream/[0.02] px-3 py-2.5"
            >
              <span className="text-base" style={{ color: accent }}>
                {s.icon}
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold text-cream/90">{s.k}</span>
                <span className="block text-[10px] text-cream/50">{s.v}</span>
              </span>
            </div>
          ))}
        </div>
      </Frame>

      {/* floating chips — ink chips with crimson glyphs */}
      <FloatChip className="left-[3%] top-[10%] sm:left-[6%]">
        <span style={{ color: accent }}>✦</span> Prompt Engine
      </FloatChip>
      <FloatChip className="right-[4%] top-[16%] sm:right-[8%]">
        <span style={{ color: accent }}>⬡</span> MSG91 · 1000+ /day
      </FloatChip>
      <FloatChip className="bottom-[6%] left-[5%] sm:bottom-[8%] sm:left-[10%]">
        <span style={{ color: accent }}>●</span> Firebase Realtime
      </FloatChip>
    </div>
  );
}

function FloatChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "absolute z-20 hidden items-center gap-2 rounded-full border border-cream/20 bg-[#0b0b0f]/85 px-4 py-2 text-[11px] font-medium text-cream/75 shadow-[4px_4px_0_0_rgba(200,35,35,0.3)] backdrop-blur-md sm:flex",
        className
      )}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

const MemoizedProjectVisual = memo(ProjectVisual);
export default MemoizedProjectVisual;
export { ProjectVisual };
