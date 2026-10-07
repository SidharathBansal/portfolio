"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";

type Rec = (typeof profile.recommendations)[number];

function Quote({ r, delay }: { r: Rec; delay: number }) {
  const [open, setOpen] = useState(false);
  const at = r.quote.indexOf(r.highlight);
  const before = at >= 0 ? r.quote.slice(0, at) : r.quote;
  const after = at >= 0 ? r.quote.slice(at + r.highlight.length) : "";
  const initials = r.author
    .split(" ")
    .map((p) => p[0])
    .join("");
  const id = `rec-${initials.toLowerCase()}`;

  return (
    <Reveal delay={delay} className="h-full">
      <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6 md:p-9">
        <span aria-hidden className="font-mono text-4xl leading-none text-accent">
          {'"'}
        </span>
        <blockquote className="mt-3 text-[clamp(1.3rem,2.4vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em] text-ink">
          {r.highlight}
        </blockquote>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={id}
              key="full"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pt-6 text-[15px] leading-relaxed text-dim">
                {before}
                <mark className="bg-transparent text-accent">{r.highlight}</mark>
                {after}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="mt-5 mb-8 w-fit font-mono text-[11.5px] text-faint transition-colors hover:text-ink"
        >
          {open ? "- hide full recommendation" : "+ read full recommendation"}
        </button>

        <figcaption className="mt-auto flex items-center gap-3.5 border-t border-line pt-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong bg-raised font-mono text-[12px] text-dim">
            {initials}
          </span>
          <span>
            <span className="block text-[15px] font-medium text-ink">{r.author}</span>
            <span className="block text-[13px] text-faint">
              {r.role} · {r.date}
            </span>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default function Words() {
  return (
    <section id="words" className={`relative border-t border-line ${sectionPad}`}>
      <div className={container}>
        <SectionHeader
          index="07"
          label="Words"
          title="From the people I worked for."
          lede="Quoted verbatim from their recommendations."
        />
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {profile.recommendations.map((r, i) => (
            <Quote key={r.author} r={r} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
