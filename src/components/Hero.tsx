"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { container } from "@/lib/styles";
import { easeOut, scrollToId } from "@/lib/motion";
import { useModKey, openPalette } from "@/lib/hooks";
import DotField from "./DotField";
import { MaskLine } from "./ui";

const CMD = "whoami";

function Prompt() {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(CMD.length);
      return;
    }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      i += 1;
      setTyped(i);
      if (i < CMD.length) t = setTimeout(step, 70 + Math.random() * 60);
    };
    t = setTimeout(step, 450);
    return () => clearTimeout(t);
  }, []);

  const done = typed >= CMD.length;

  return (
    <div className="mb-8 font-mono text-[13px] leading-6 text-faint" aria-label={`whoami: ${profile.handle}`}>
      <div>
        <span className="text-ok">~</span> <span className="text-faint">%</span>{" "}
        <span className="text-ink">{CMD.slice(0, typed)}</span>
        {!done && <span className="ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[3px] bg-accent animate-caret" />}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.2, delay: done ? 0.15 : 0 }}
        className="text-dim"
      >
        {profile.handle}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const mod = useModKey();
  const [first, last] = profile.name.split(" ");

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <DotField className="absolute inset-0 -z-10 size-full [mask-image:radial-gradient(ellipse_80%_70%_at_60%_40%,#000_30%,transparent_80%)]" />

      <div className={container}>
        <Prompt />

        <h1 className="text-[clamp(3.4rem,12vw,10rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-ink">
          <MaskLine animateOnMount delay={0.9}>
            {first}
          </MaskLine>
          <MaskLine animateOnMount delay={1.0}>
            {last}
            <span className="text-accent">.</span>
          </MaskLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 1.35 }}
          className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end"
        >
          <div>
            <p className="text-xl font-medium tracking-tight text-ink md:text-2xl">{profile.tagline}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-dim md:text-[17px]">{profile.intro}</p>

            <p className="mt-6 flex items-center gap-2.5 font-mono text-[12.5px] text-dim">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-ok animate-ping-soft" />
                <span className="relative inline-flex size-2 rounded-full bg-ok" />
              </span>
              {profile.current.title} @ {profile.current.company}
              <span className="text-faint">· {profile.location}</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("work");
                }}
                className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                See the work ↓
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/60"
              >
                Get in touch
              </a>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/60"
                >
                  Resume
                </a>
              )}
              <button
                type="button"
                onClick={openPalette}
                className="hidden px-2 font-mono text-[12px] text-faint transition-colors hover:text-dim md:inline"
              >
                or press <kbd className="rounded border border-line-strong px-1.5 py-0.5 text-dim">{mod}K</kbd>
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {profile.heroStats.map((s) => (
              <div key={s.label} className="bg-bg/90 p-5 backdrop-blur-sm">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-ink md:text-[28px]">{s.value}</dd>
                <dd className="mt-1 text-[13px] text-faint">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
