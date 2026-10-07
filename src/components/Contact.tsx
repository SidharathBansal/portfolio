"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { container } from "@/lib/styles";
import { MaskLine, Reveal } from "./ui";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-28 md:py-44">
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_60%,#000,transparent)]" />
      <div className={container}>
        <Reveal>
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            <span className="text-accent">08</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            Contact
          </p>
        </Reveal>
        <h2 className="text-[clamp(2.6rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-ink">
          <MaskLine>Let&apos;s build something</MaskLine>
          <MaskLine delay={0.08}>
            that stays up<span className="text-accent">.</span>
          </MaskLine>
        </h2>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-dim">
            A platform problem, a role, or just want to talk Gateway API? My inbox is open.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-3 text-[clamp(1.25rem,3vw,1.9rem)] font-medium tracking-tight text-ink"
            >
              <span className="underline decoration-line-strong decoration-1 underline-offset-[10px] transition-colors group-hover:decoration-accent">
                {profile.email}
              </span>
            </a>
            <button
              type="button"
              onClick={copy}
              className="w-fit rounded-md border border-line-strong px-3 py-1.5 font-mono text-[12px] text-dim transition-colors hover:border-accent/50 hover:text-ink"
              aria-live="polite"
            >
              {copied ? <span className="text-ok">✓ copied</span> : "copy"}
            </button>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { label: "LinkedIn", href: profile.links.linkedin },
              { label: "GitHub", href: profile.links.github },
              ...(profile.resumeUrl ? [{ label: "Resume", href: profile.resumeUrl }] : []),
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line-strong bg-surface/70 px-4 py-2 text-sm text-dim transition-colors hover:border-accent/50 hover:text-ink"
              >
                {l.label} <span className="text-faint">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
