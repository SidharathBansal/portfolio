"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";

// Used for the server render; replaced with the real current month after mount.
const FALLBACK_END = "2026-10";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Bar = { key: string; label: string; company: string; current: boolean };

function monthIndex(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function buildBars(end: string): Bar[] {
  const endIdx = monthIndex(end);
  const bars: Bar[] = [];
  for (const job of profile.career) {
    const from = monthIndex(job.from);
    const to = job.to ? monthIndex(job.to) : endIdx;
    for (let i = from; i <= to; i++) {
      const y = Math.floor(i / 12);
      bars.push({
        key: `${y}-${i % 12}`,
        label: `${MONTHS[i % 12]} ${y}`,
        company: job.company,
        current: !job.to && i === endIdx,
      });
    }
  }
  return bars;
}

export default function Uptime() {
  const [end, setEnd] = useState(FALLBACK_END);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const d = new Date();
    setEnd(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }, []);

  const bars = useMemo(() => buildBars(end), [end]);
  const spans = useMemo(() => {
    return profile.career.map((job) => {
      const count = bars.filter((b) => b.company === job.company).length;
      return { company: job.company, count };
    });
  }, [bars]);

  const shown = hover !== null ? bars[hover] : bars[bars.length - 1];

  return (
    <section id="uptime" className={`relative ${sectionPad}`}>
      <div className={container}>
        <SectionHeader
          index="01"
          label="Ethos"
          title={
            <>
              I build infrastructure that <span className="text-accent">stays up.</span>
            </>
          }
          lede="Most of the job is invisible when it goes well: migrations nobody notices, upgrades without a maintenance window, alerts that fire before customers do."
        />

        <Reveal>
          <div className="rounded-2xl border border-line bg-surface/60 p-5 md:p-8">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">career uptime</p>
                <p className="mt-1.5 text-lg font-medium text-ink">
                  <span suppressHydrationWarning>{bars.length}</span> months in production
                </p>
              </div>
              <p className="font-mono text-[12px] text-dim" aria-live="polite">
                <span className="text-ink">{shown.label}</span>
                <span className="text-faint"> · </span>
                {shown.company}
                <span className="text-faint"> · </span>
                <span className="text-ok">{shown.current ? "operational, now" : "operational"}</span>
              </p>
            </div>

            <div
              className="flex h-12 items-stretch gap-[2px] md:h-14 md:gap-[3px]"
              onMouseLeave={() => setHover(null)}
              role="img"
              aria-label={`${bars.length} months in production across ${profile.career.length} companies`}
            >
              {bars.map((b, i) => (
                <motion.span
                  key={b.key}
                  onMouseEnter={() => setHover(i)}
                  initial={{ scaleY: 0.2, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.012, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex-1 origin-bottom rounded-[2px] transition-colors ${
                    hover === i ? "bg-ink" : b.current ? "bg-ok" : "bg-ok/70 hover:bg-ok"
                  }`}
                >
                  {b.current && (
                    <span className="absolute inset-0 rounded-[2px] bg-ok animate-ping-soft" aria-hidden />
                  )}
                </motion.span>
              ))}
            </div>

            <div className="mt-3 flex gap-[2px] md:gap-[3px]" aria-hidden>
              {spans.map((s) => (
                <div key={s.company} style={{ flex: s.count }} className="min-w-0">
                  <div className="h-2 border-x border-b border-line-strong" />
                  <p className="mt-2 truncate font-mono text-[11px] text-faint">{s.company}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {profile.uptimeStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-bg p-6 md:p-7">
              <p className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-dim">{s.label}</p>
              <p className="mt-3 font-mono text-[11px] text-faint">{s.where}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
